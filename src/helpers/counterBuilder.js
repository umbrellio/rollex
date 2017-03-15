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
export default class CounterBuilder {
  /**
   * @param {Counter} counter
   */
  constructor (counter) {
    this.counter = counter
    this.props = counter.props
    this.state = {}
  }

  /**
   * Calculates initial state of the counter.
   * @return {object} state
   */
  buildInitialState () {
    this.buildTimeProps()
    this.buildPeriods()
    this.buildDigitLimits()
    this.buildCSSClasses()
    this.buildInitialNumbers()
    return this.state
  }

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
  }

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
  }

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
  }

  /**
   * Builds minDigits and maxDigits state properties.
   */
  buildDigitLimits () {
    var [minDigits, maxDigits] = this.getDigitLimitsFromProps()
    this.state = {
      ...this.state,
      ...this.normalizeDigitLimits(minDigits, maxDigits)
    }
  }

  /**
   * Gets minDigits and maxDigits from props specified by the user.
   * @return {array}
   */
  getDigitLimitsFromProps () {
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
  }

  /**
   * Calculates minimum number of digits for current radix and given period.
   * @param {string} period - period to calculate minDigits for
   * @return {number}
   */
  getMinSegmentSize (period) {
    const maxValue = this.getPeriodMaxValue(period)
    return (maxValue).toString(this.props.radix).length
  }

  /**
   * Normalizes minDigits and maxDigits and sets default values where user did not specify them.
   * @param {number|object} minDigits
   * @param {number|object} maxDigits
   * @return {object}
   */
  normalizeDigitLimits (minDigits, maxDigits) {
    var normalizedMinDigits = {}
    var normalizedMaxDigits = {}

    for (let period of this.state.periods) {
      const minSegmentSize = this.getMinSegmentSize(period);
      [normalizedMinDigits[period], normalizedMaxDigits[period]] = this.normalizeDigitLimitsForPeriod(
        minDigits[period], maxDigits[period], minSegmentSize
      )
    }
    return {
      minDigits: normalizedMinDigits,
      maxDigits: normalizedMaxDigits
    }
  }

  normalizeDigitLimitsForPeriod (min, max, minSegmentSize) {
    const minProvided = min !== undefined
    const maxProvided = max !== undefined
    function throwError () {
      throw new Error(`conflict: minDigits (${min}) > maxDigits (${max})`)
    }

    if (minProvided && max) {
      return (min > max) ? throwError() : [min, max]
    } else if (minProvided && !maxProvided) {
      return [min, (min > minSegmentSize) ? min : minSegmentSize]
    } else if (!minProvided && max) {
      return [(minSegmentSize > max) ? max : minSegmentSize, max]
    } else {
      return [minSegmentSize, maxProvided ? max : minSegmentSize]
    }
  }

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
  }

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

  /**
   * Validates counter's props.
   * @param {Object} props - props to validate
   */
  static validateProps (props) {
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
  }
}
