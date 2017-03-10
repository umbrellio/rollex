import React from 'react'
import CounterSegment from './CounterSegment'
const { number, string, bool, objectOf, any, func } = React.PropTypes

/**
 * @type {string[]}
 * names for available periods
 */
const PERIODS = [
  'days',
  'hours',
  'minutes',
  'seconds'
]

/**
 * @type {Object}
 * durations for available periods (in milliseconds)
 */
const PERIOD_DURATIONS = {
  'days': 86400000,
  'hours': 3600000,
  'minutes': 60000,
  'seconds': 1000
}

/**
 * @type {Object}
 * time calculation functions for available periods
 */
const PERIOD_DURATION_FUNCTIONS = {
  'hours': 'getUTCHours',
  'minutes': 'getMinutes',
  'seconds': 'getSeconds'
}

/**
 * main counter component
 * @example
 * <Counter seconds={98} />
 */
export default class Counter extends React.Component {
  /**
   * propTypes
   * @property {number} from - timestamp to count from
   * @property {number} to - timestamp to count to
   * @property {number} seconds - a number of seconds to count
   * @property {number} interval - update interval
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
   */
  static propTypes = {
    from: number,
    to: number,
    seconds: number,
    interval: number,
    minDigits: number,
    maxDigits: number,
    minPeriod: string,
    maxPeriod: string,
    frozen: bool,
    syncTime: bool,
    easingFunction: string,
    easingDuration: number,
    radix: number,
    digitMap: objectOf(any),
    digitWrapper: func
  }

  static defaultProps = {
    interval: 1000,
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

    const { to, from, seconds } = this.props
    const timeDiff = (seconds === undefined) ? (to - from) : (seconds * 1000)

    var minDigits = this.props.minDigits || this.getInitialMinDigits()
    if (minDigits > this.props.maxDigits) minDigits = this.props.maxDigits

    /**
     * @type {object}
     * @property {number} timeDiff - current amount of time to count from in milliseconds
     * @property {number} minDigits - minimum number of digits per segment
     * @property {Object} numbers - a map from periods to their corresponding numbers
     * @property {number} currentTime - a timestamp of current moment
     * @property {string[]} periods - an array of periods to create segments for
     */
    this.state = {
      timeDiff,
      minDigits,
      currentTime: new Date().getTime(),
      periods: this.getPeriods()
    }
    this.state.numbers = this.calculateNumbers(timeDiff)
  }

  componentDidMount () {
    this.start()
  }

  componentWillUnmount () {
    this.stop()
  }

  /**
   * start the countdown
   */
  start () {
    if (!this.props.frozen) {
      this._interval = setInterval(() => this.tick(), this.props.interval)
    }
  }

  /**
   * pause / stop the countdown
   */
  stop () {
    if (!this.props.frozen) clearInterval(this._interval)
  }

  /**
   * handle counter tick
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
   * calculates minimum number of digits for current radix
   * @return {number}
   */
  getInitialMinDigits () {
    return (59).toString(this.props.radix).length
  }

  /**
   * get current amount of time to count from
   * @return {number} timestamp
   */
  getTimeDiff () {
    if (this.props.syncTime) {
      return this.props.to - this.props.from - new Date().getTime() + this.state.currentTime
    } else {
      return this.state.timeDiff - this.props.interval
    }
  }

  /**
   * get an array of periods to create segments for
   * @return {string[]} periods
   */
  getPeriods () {
    return PERIODS.slice(
      PERIODS.indexOf(this.props.maxPeriod + 's'),
      PERIODS.indexOf(this.props.minPeriod + 's') + 1
    )
  }

  /**
   * get CSS classes for main counter
   * @return {string} class names
   */
  getCSSClassNames () {
    const type = this.props.easingFunction ? 'animated' : 'static'
    return `rollex rollex-${type}`
  }

  /**
   * calculate numbers for each period for a given timestamp
   * @param {number} timeDiff - timestamp to calculate numbers for
   * @return {Object} numbers - a map from periods to corresponding numbers
   */
  calculateNumbers (timeDiff) {
    var numbers = {}
    for (let period of this.state.periods) {
      numbers = { ...numbers, [period]: this.calculatePeriodNumber(period, timeDiff) }
    }
    return numbers
  }

  /**
   * calculate number for given period and timestamp
   * @param {string} period - period to calculate number for
   * @param {number} timeDiff - timestamp to use for calculation
   * @return {number}
   */
  calculatePeriodNumber (period, timeDiff) {
    const date = new Date(timeDiff)
    if (this.props.maxPeriod + 's' === period) {
      return Math.floor(timeDiff / PERIOD_DURATIONS[period])
    } else {
      return date[PERIOD_DURATION_FUNCTIONS[period]]()
    }
  }

  /**
   * get correct digits for given number accounting for counter's radix, minDigits and maxDigits
   * @param {number} number - number to get digits for
   * @return {string[]} digits
   */
  getDigits (number) {
    const { maxDigits, radix } = this.props
    const minDigits = this.state.minDigits

    if (maxDigits && maxDigits > 0 && number >= Math.pow(radix, maxDigits)) {
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
   * render
   * @return {ReactElement} counter
   */
  render () {
    const numbers = this.state.numbers
    const segments = this.getPeriods().map((period, index) => {
      return (<CounterSegment
        period={period}
        key={index}
        digits={this.getDigits(numbers[period])}
        radix={this.props.radix}
        easingFunction={this.props.easingFunction}
        easingDuration={this.props.easingDuration}
        digitMap={this.props.digitMap}
        digitWrapper={this.props.digitWrapper}
      />)
    })
    return (
      <div className={this.getCSSClassNames()}>
        {segments}
      </div>
    )
  }
}

/**
 * validate counter's props
 * @param {Object} props - props to validate
 */
function validateProps (props) {
  if (props.seconds !== undefined) {
    if (props.to !== undefined || props.from !== undefined) {
      throw new Error('cannot use "to" and "from" with "seconds"')
    } else if (props.seconds < 0) {
      throw new Error('"seconds" must be greater than or equal to zero')
    }
  } else if (props.to === undefined || props.from === undefined) {
    throw new Error('provide either "seconds" or "to" and "from"')
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
    throw new Error('"syncTime" must only be used with "to" and "from"')
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
}
