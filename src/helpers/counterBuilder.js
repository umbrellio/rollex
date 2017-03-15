import NumberCalculator from './numberCalculator'

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
 * Handles much of Counter initialization
 */
const CounterBuilder = {
  /**
   * Validates counter's props.
   * @param {Object} props - props to validate
   */
  validateProps (props) {
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
    if (props.minPeriod && PERIODS.indexOf(props.minPeriod) < 0) {
      throw new Error('"minPeriod" must be one of: days, hours, minutes, seconds')
    }
    if (props.maxPeriod && PERIODS.indexOf(props.maxPeriod) < 0) {
      throw new Error('"maxPeriod" must be one of: days, hours, minutes, seconds')
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
  },
  /**
   * Calculates initial state of the counter.
   * @param {object} props
   * @return {object} state
   */
  buildInitialState (counter) {
    this.counter = counter
    this.props = counter.props
    this.state = {}
    this.buildTimeProps()
    this.buildPeriods()
    this.buildMinAndMaxDigits()
    this.buildCSSClasses()
    this.buildInitialNumbers()
    return this.state
  },
  /**
   * Sets initial time parameters.
   */
  buildTimeProps () {
    const startTime = new Date().getTime()
    const from = (this.props.from === undefined) ? startTime : this.props.from
    const timeDiff = (this.props.seconds === undefined)
      ? (this.props.to - from)
      : (this.props.seconds * 1000)
    this.state = {
      ...this.state,
      startTime,
      from,
      timeDiff,
      initialTimeDiff: timeDiff
    }
  },
  /**
   * Gets an array of periods to create segments for.
   */
  buildPeriods () {
    const periods = PERIODS.slice(
      PERIODS.indexOf(this.props.maxPeriod),
      PERIODS.indexOf(this.props.minPeriod) + 1
    )
    this.state = {
      ...this.state,
      periods
    }
  },
  /**
   * Gets CSS classes for main counter.
   */
  buildCSSClasses () {
    const type = this.props.easingFunction ? 'animated' : 'static'
    var cssClasses = `rollex rollex-${type}`
    if (this.props.frozen) cssClasses += ' rollex-frozen'
    this.state = {
      ...this.state,
      cssClasses
    }
  },
  /**
   * Builds minDigits and maxDigits state properties.
   */
  buildMinAndMaxDigits () {
    var [minDigits, maxDigits] = this.getMinAndMaxDigitsFromProps()
    this.state = {
      ...this.state,
      ...this.normalizeMinAndMaxDigits(minDigits, maxDigits)
    }
  },
  /**
   * Gets minDigits and maxDigits from props specified by the user.
   * @return {array}
   */
  getMinAndMaxDigitsFromProps () {
    var minDigits = {}
    var maxDigits = {}

    if (typeof this.props.minDigits === 'number') {
      for (let period of this.state.periods) minDigits[period] = this.props.minDigits
    } else if (typeof this.props.minDigits === 'object') {
      minDigits = this.props.minDigits
    }
    if (typeof this.props.maxDigits === 'number') {
      for (let period of this.state.periods) maxDigits[period] = this.props.maxDigits
    } else if (typeof this.props.maxDigits === 'object') {
      maxDigits = this.props.maxDigits
    }
    return [minDigits, maxDigits]
  },
  /**
   * Normalizes minDigits and maxDigits and sets default values where user did not specify them.
   * @param {number|object} minDigits
   * @param {number|object} maxDigits
   * @return {object}
   */
  normalizeMinAndMaxDigits (minDigits, maxDigits) {
    for (let period of this.state.periods) {
      const minSegmentSize = this.getMinSegmentSize(period)
      const minDigitsProvided = minDigits[period] !== undefined
      const maxDigitsProvided = maxDigits[period] !== undefined
      if (!minDigitsProvided) minDigits[period] = minSegmentSize
      if (!maxDigitsProvided) maxDigits[period] = minSegmentSize

      if (minDigitsProvided && !maxDigitsProvided && minDigits[period] > maxDigits[period]) {
        maxDigits[period] = minDigits[period]
      }
      if (maxDigits[period]) {
        if (!minDigitsProvided && minDigits[period] > maxDigits[period]) {
          minDigits[period] = maxDigits[period]
        }
        if (minDigitsProvided && minDigits[period] > maxDigits[period]) {
          throw new Error(
            `conflict: minDigits (${minDigits[period]}) > maxDigits (${maxDigits[period]})`
          )
        }
      }
    }
    return { minDigits, maxDigits }
  },
  /**
   * Calculates minimum number of digits for current radix and given period.
   * @param {string} period - period to calculate minDigits for
   * @return {number}
   */
  getMinSegmentSize (period) {
    const maxValue = this.getPeriodMaxValue(period)
    return (maxValue).toString(this.props.radix).length
  },
  /**
   * Calculates maximum value for given period.
   * @param {string} period
   * @return {number}
   */
  getPeriodMaxValue (period) {
    switch (period) {
      case 'seconds':
      case 'minutes':
        return 59
      case 'hours':
        return 23
      default:
        if (period === this.props.minPeriod) {
          // max number possible for this period during the countdown
          return NumberCalculator.getPeriodNumberAt(
            period, this.props.maxPeriod, this.state.initialTimeDiff
          )
        } else {
          return this.getPeriodMaxValue(this.props.minPeriod)
        }
    }
  },
  /**
   * Calculates initial numbers for all periods.
   */
  buildInitialNumbers () {
    const timestamp = (this.props.direction === 'down') ? this.state.initialTimeDiff : 0
    this.state = {
      ...this.state,
      numbers: NumberCalculator.calculateNumbers(this.state.periods, timestamp)
    }
  }
}

export default CounterBuilder
