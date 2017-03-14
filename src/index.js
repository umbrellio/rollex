import React from 'react'
import CounterSegment from './CounterSegment'
import CounterSegmentSeparator from './CounterSegmentSeparator'
import GlobalIntervals from './globalIntervals'
const { number, string, bool, objectOf, object, oneOfType, oneOf, func, any } = React.PropTypes

/**
 * @type {string[]}
 * Names for available periods.
 */
const PERIODS = [
  'days',
  'hours',
  'minutes',
  'seconds'
]

/**
 * @type {Object}
 * Durations for available periods (in milliseconds).
 */
const PERIOD_DURATIONS = {
  'days': 86400000,
  'hours': 3600000,
  'minutes': 60000,
  'seconds': 1000
}

/**
 * @type {Object}
 * Time calculation functions for available periods.
 */
const PERIOD_DURATION_FUNCTIONS = {
  'hours': 'getUTCHours',
  'minutes': 'getMinutes',
  'seconds': 'getSeconds'
}

/**
 * Main counter component.
 * @example
 * <Counter seconds={98} />
 */
export class Counter extends React.Component {
  /**
   * @property {number} from - timestamp to count from
   * @property {number} to - timestamp to count to
   * @property {number} seconds - a number of seconds to count
   * @property {number} interval - update interval
   * @property {string} direction - direction to count in
   * @property {number} minDigits - minimum number of digits per segment
   * @property {number} maxDigits - maximum number of digits per segment
   * @property {string} minPeriod - smallest period to create a segment for
   * @property {string} maxPeriod - largest period to create a segment for
   * @property {boolean} frozen - determines if counter is frozen
   * @property {boolean} syncTime - determines if counter should try to synchronize with client
   * time.
   * @property {string} easingFunction - easing function to use for rolling digits
   * @property {number} easingDuration - easing duration in milliseconds
   * @property {number} radix - numeral base to use
   * @property {Object} digitMap - a map to use when transforming digit symbols
   * @property {function(digit: number)} digitWrapper - a wrapping function for mapped digits
   * @property {Map<string, string>|function(period: string, number: number)} labels - a map or a
   * function that returns labels for given period and number
   * @property separator - what to separate segments with
   */
  static propTypes = {
    from: number,
    to: number,
    seconds: number,
    interval: number,
    direction: oneOf(['up', 'down']),
    minDigits: number,
    maxDigits: number,
    minPeriod: string,
    maxPeriod: string,
    frozen: bool,
    syncTime: bool,
    easingFunction: string,
    easingDuration: number,
    radix: number,
    digitMap: object,
    digitWrapper: func,
    labels: oneOfType([objectOf(string), func]),
    separator: any
  }

  static defaultProps = {
    interval: 1000,
    frozen: false,
    direction: 'down',
    minPeriod: 'second',
    maxPeriod: 'day',
    easingFunction: null,
    easingDuration: 300,
    radix: 10,
    digitMap: {},
    digitWrapper: (digit) => <span>{digit}</span>
  }

  /**
   * constructor
   * @param {Object} props
   */
  constructor (props) {
    validateProps(props)
    super(props)

    const startTime = new Date().getTime()
    const from = (this.props.from === undefined) ? startTime : this.props.from
    const timeDiff = (this.props.seconds === undefined)
      ? (this.props.to - from)
      : (this.props.seconds * 1000)

    var minDigits = this.props.minDigits || this.getInitialMinDigits()
    if (minDigits > this.props.maxDigits) minDigits = this.props.maxDigits

    /**
     * @type {object}
     * @property {number} timeDiff - current amount of time to count from in milliseconds
     * @property {number} minDigits - minimum number of digits per segment
     * @property {Map<string, number>} numbers - a map from periods to their corresponding numbers
     * @property {number} startTime - a timestamp of current moment
     * @property {string[]} periods - an array of periods to create segments for
     */
    this.state = {
      timeDiff,
      minDigits,
      startTime,
      from,
      initialTimeDiff: timeDiff,
      periods: this.getPeriods(),
      cssClasses: this.getCSSClassNames()
    }
    this.state.numbers = this.calculateNumbers(timeDiff)

    /**
     * Creates a function bound to "this"
     * for subscribing to and unsubscribing from global Rollex tick event.
     */
    this.boundTick = this.tick.bind(this)
  }

  componentDidMount () {
    if (!this.props.frozen) this.start()
  }

  componentWillUnmount () {
    if (!this.props.frozen && !this.state.stopped) this.stop()
  }

  /**
   * Handles prop updates.
   * @param {Object} nextProps - new props
   */
  componentWillReceiveProps (nextProps) {
    if (this.props.frozen !== nextProps.frozen) {
      if (nextProps.frozen) {
        this.stop()
      } else {
        this.start()
      }
    }
  }

  /**
   * Starts the countdown.
   */
  start () {
    GlobalIntervals.ensureExistence(this.props.interval)
    GlobalIntervals.subscribe(this.props.interval, this.boundTick)
    this.setState({ stopped: false })
  }

  /**
   * Pauses the countdown.
   */
  stop () {
    GlobalIntervals.unsubscribe(this.props.interval, this.boundTick)
    GlobalIntervals.cleanup(this.props.interval)
    this.setState({ stopped: true })
  }

  /**
   * Handles counter ticks.
   */
  tick () {
    const newTimeDiff = this.getTimeDiff()
    if (newTimeDiff < 0) {
      return this.stop()
    }

    /**
     * @type {object}
     * @property {number} timeDiff - current amount of time to count from in milliseconds
     * @property {Object} numbers - a map from periods to their corresponding numbers
     */
    this.setState({
      timeDiff: newTimeDiff,
      numbers: this.calculateNumbers(newTimeDiff)
    })
  }

  /**
   * Calculates minimum number of digits for current radix.
   * @return {number}
   */
  getInitialMinDigits () {
    return (59).toString(this.props.radix).length
  }

  /**
   * Gets current amount of time to count from.
   * @return {number} timestamp
   */
  getTimeDiff () {
    if (this.props.syncTime) {
      return this.props.to - this.state.from - new Date().getTime() + this.state.startTime
    } else {
      return this.state.timeDiff - this.props.interval
    }
  }

  /**
   * Gets an array of periods to create segments for.
   * @return {string[]} periods
   */
  getPeriods () {
    return PERIODS.slice(
      PERIODS.indexOf(this.props.maxPeriod + 's'),
      PERIODS.indexOf(this.props.minPeriod + 's') + 1
    )
  }

  /**
   * Gets CSS classes for main counter.
   * @return {string} class names
   */
  getCSSClassNames () {
    const type = this.props.easingFunction ? 'animated' : 'static'
    var classNames = `rollex rollex-${type}`
    if (this.props.frozen) classNames += ' rollex-frozen'
    return classNames
  }

  /**
   * Calculates numbers for each period for a given timestamp.
   * @param {number} timeDiff - timestamp to calculate numbers for
   * @return {Map<string, number>} numbers - a map from periods to corresponding numbers
   */
  calculateNumbers (timeDiff) {
    var numbers = {}
    for (let period of this.state.periods) {
      numbers = { ...numbers, [period]: this.calculatePeriodNumber(period, timeDiff) }
    }
    return numbers
  }

  /**
   * Calculates number for given period and timestamp.
   * @param {string} period - period to calculate number for
   * @param {number} timeDiff - timestamp to use for calculation
   * @return {number}
   */
  calculatePeriodNumber (period, timeDiff) {
    const timestamp = (this.props.direction === 'down')
      ? timeDiff
      : this.state.initialTimeDiff - timeDiff
    const date = new Date(timestamp)
    if (this.props.maxPeriod + 's' === period) {
      return Math.floor(timestamp / PERIOD_DURATIONS[period])
    } else {
      return date[PERIOD_DURATION_FUNCTIONS[period]]()
    }
  }

  /**
   * Gets correct digits for given number accounting for counter's radix, minDigits and maxDigits.
   * @param {number} number - number to get digits for
   * @return {string[]} digits
   */
  getDigits (number) {
    const { maxDigits, radix } = this.props
    const minDigits = this.state.minDigits

    if (maxDigits && number >= Math.pow(radix, maxDigits)) {
      var nineArray = []
      for (let i = 0; i < maxDigits; i++) nineArray.push((radix - 1).toString())
      return nineArray
    }

    number = number.toString(radix)
    var zeroArray = []
    for (let i = 0; i < minDigits - number.length; i++) zeroArray.push('0')
    return (zeroArray.join('') + number).split('')
  }

  /**
   * Gets a label for given period and number.
   * @param {string} period
   * @param {number} number
   * @return {string} label
   */
  getLabel (period, number) {
    if (!this.props.labels) {
      return period
    } else if (typeof this.props.labels === 'function') {
      return this.props.labels(period, number)
    } else {
      return this.props.labels[period]
    }
  }

  /**
   * Renders the counter.
   * @return {ReactElement} counter
   */
  render () {
    const numbers = this.state.numbers
    const segments = this.state.periods.map((period, index) => {
      const separator = index < this.state.periods.length - 1
        ? <CounterSegmentSeparator content={this.props.separator} />
        : null
      return (<div key={index}>
        <CounterSegment
          period={period}
          digits={this.getDigits(numbers[period])}
          radix={this.props.radix}
          direction={this.props.direction}
          easingFunction={this.props.easingFunction}
          easingDuration={this.props.easingDuration}
          digitMap={this.props.digitMap}
          digitWrapper={this.props.digitWrapper}
          label={this.getLabel(period, numbers[period])}
        />
        {separator}
      </div>)
    })
    return (
      <div className={this.state.cssClasses}>
        {segments}
      </div>
    )
  }
}

/**
 * Validates counter's props.
 * @param {Object} props - props to validate
 */
function validateProps (props) {
  if (props.seconds !== undefined) {
    if (props.to !== undefined || props.from !== undefined) {
      throw new Error('cannot use "to" and "from" with "seconds"')
    } else if (props.seconds < 0) {
      throw new Error('"seconds" must be greater than or equal to zero')
    }
  } else if (props.to === undefined) {
    throw new Error('provide either "seconds" or "to"')
  } else if (props.to < props.from) {
    throw new Error('"to" must be bigger than "from"')
  }
  if (props.minDigits !== undefined && props.minDigits < 1) {
    throw new Error('"minDigits" must be positive')
  }
  if (props.minPeriod && PERIODS.indexOf(props.minPeriod + 's') < 0) {
    throw new Error('"minPeriod" must be one of: day, hour, minute, second')
  }
  if (props.maxPeriod && PERIODS.indexOf(props.maxPeriod + 's') < 0) {
    throw new Error('"maxPeriod" must be one of: day, hour, minute, second')
  }
  if (props.syncTime && props.to === undefined) {
    throw new Error('"syncTime" must be used with "to"')
  }
  if (props.radix < 2 || props.radix > 36) {
    throw new Error('"radix" must be between 2 and 36')
  }
  if (typeof props.digitWrapper !== 'function') {
    throw new Error('"digitWrapper" must be a function')
  }
  if (typeof props.digitMap !== 'object') {
    throw new Error('"digitMap" must be an object')
  }
  if (props.direction !== 'up' && props.direction !== 'down') {
    throw new Error('"direction" must be either up or down')
  }
}
