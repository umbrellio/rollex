import React from 'react'
import PropTypes from 'prop-types'
import CounterSegment from './CounterSegment'
import CounterSegmentSeparator from './CounterSegmentSeparator'
import GlobalIntervals from '../helpers/globalIntervals'
import CounterBuilder from '../helpers/counterBuilder'
import NumberCalculator from '../helpers/numberCalculator'

/**
 * Main counter component.
 * @example
 * <Counter seconds={98} />
 */
export default class Counter extends React.Component {
  /**
   * @property {number} from - timestamp to count from
   * @property {number} to - timestamp to count to
   * @property {number} seconds - a number of seconds to count
   * @property {number} interval - update interval
   * @property {string} direction - direction to count in
   * @property {number|object} digits - number of digits per segment
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
    from: PropTypes.number,
    to: PropTypes.number,
    seconds: PropTypes.number,
    interval: PropTypes.number,
    direction: PropTypes.oneOf(['up', 'down']),
    digits: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    minPeriod: PropTypes.string,
    maxPeriod: PropTypes.string,
    frozen: PropTypes.bool,
    syncTime: PropTypes.bool,
    easingFunction: PropTypes.string,
    easingDuration: PropTypes.number,
    radix: PropTypes.number,
    digitMap: PropTypes.object,
    digitWrapper: PropTypes.func,
    labels: PropTypes.oneOfType([
      PropTypes.objectOf(PropTypes.string),
      PropTypes.func,
    ]),
    separator: PropTypes.any,
  }

  static defaultProps = {
    interval: 1000,
    frozen: false,
    direction: 'down',
    minPeriod: 'seconds',
    maxPeriod: 'days',
    easingFunction: null,
    easingDuration: 300,
    radix: 10,
    digitMap: {},
    digitWrapper: digit => <span>{digit}</span>,
  }

  /**
   * constructor
   * @param {Object} props
   */
  constructor (props) {
    CounterBuilder.validateProps(props)
    super(props)

    /**
     * @type {object}
     * @property {number} timeDiff - current amount of time to count from in milliseconds
     * @property {number} initialTimeDiff - original time diff
     * @property {Map<string, number>} digits - a map from periods to theis segment sizes
     * @property {Map<string, number>} numbers - a map from periods to their corresponding numbers
     * @property {number} startTime - a timestamp of current moment
     * @property {number} from - timestamp to count from
     * @property {string[]} periods - an array of periods to create segments for
     */
    this.state = new CounterBuilder(props).buildInitialState()

    /**
     * Creates a function bound to "this"
     * for subscribing to and unsubscribing from global Rollex tick event.
     */
    this.boundTick = this.tick.bind(this)
  }

  componentDidMount () {
    if (!this.props.frozen) this.start()
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

  componentWillUnmount () {
    if (!this.props.frozen && !this.stopped) this.stop()
  }

  /**
   * Starts the countdown.
   */
  start () {
    this.unsubscribe = GlobalIntervals.subscribe(
      this.props.interval,
      this.boundTick
    )
    this.stopped = false
  }

  /**
   * Pauses the countdown.
   */
  stop () {
    if (!this.unsubscribe) return
    this.unsubscribe()
    this.stopped = true
  }

  /**
   * Handles counter ticks.
   */
  tick () {
    const newTimeDiff = this.getTimeDiff()
    if (newTimeDiff < 0) {
      return this.stop()
    }

    const timestamp = this.props.direction === 'down'
      ? newTimeDiff
      : this.state.initialTimeDiff - newTimeDiff

    /**
     * @type {object}
     * @property {number} timeDiff - current amount of time to count from in milliseconds
     * @property {Object} numbers - a map from periods to their corresponding numbers
     */
    this.setState({
      timeDiff: newTimeDiff,
      numbers: NumberCalculator.calculateNumbers(this.state.periods, timestamp),
    })
  }

  /**
   * Gets current amount of time to count from.
   * @return {number} timestamp
   */
  getTimeDiff () {
    if (this.props.syncTime) {
      return (
        this.props.to -
        this.state.from -
        new Date().getTime() +
        this.state.startTime
      )
    } else {
      return this.state.timeDiff - this.props.interval
    }
  }

  /**
   * Gets correct digits for given period accounting for counter's radix and periods's segment size.
   * @param {string} period
   * @return {string[]} digits
   */
  getDigits (period) {
    let number = this.state.numbers[period]
    const digits = this.state.digits[period]
    const radix = this.props.radix

    if (digits && number >= Math.pow(radix, digits)) {
      const maxValueArray = []
      for (let i = 0; i < digits; i += 1) {
        maxValueArray.push((radix - 1).toString())
      }
      return maxValueArray
    }

    number = number.toString(radix)
    const zeroArray = []
    for (let i = 0; i < digits - number.length; i += 1) {
      zeroArray.push('0')
    }
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
   * Gets CSS classes for the counter.
   * @return {string} cssClasses
   */
  getCSSClasses () {
    const type = this.props.easingFunction ? 'animated' : 'static'
    let cssClasses = `rollex rollex-${type}`
    if (this.props.frozen) cssClasses += ' rollex-frozen'
    return cssClasses
  }

  /**
   * Renders the counter.
   * @return {ReactElement} counter
   */
  render () {
    const segments = this.state.periods.map((period, index) => {
      const separator = index < this.state.periods.length - 1
        ? <CounterSegmentSeparator content={this.props.separator} />
        : null
      return (
        <div key={index} className='rollex-segment-wrapper'>
          <CounterSegment
            period={period}
            digits={this.getDigits(period)}
            radix={this.props.radix}
            direction={this.props.direction}
            easingFunction={this.props.easingFunction}
            easingDuration={this.props.easingDuration}
            digitMap={this.props.digitMap}
            digitWrapper={this.props.digitWrapper}
            label={this.getLabel(period, this.state.numbers[period])}
          />
          {separator}
        </div>
      )
    })
    return (
      <div className={this.getCSSClasses()}>
        {segments}
      </div>
    )
  }
}
