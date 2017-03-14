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
    const props = counter.props
    const timeProps = this.buildTimeProps(props)
    const periods = this.buildPeriods(props)
    const minAndMaxDigits = this.buildMinAndMaxDigits(props, periods)
    const timestamp = (props.direction === 'down') ? this.initialTimeDiff : 0
    return {
      ...timeProps,
      ...minAndMaxDigits,
      periods,
      cssClasses: this.buildCSSClasses(props),
      numbers: NumberCalculator.calculateNumbers(periods, timestamp)
    }
  },
  /**
   * Calculates initial time parameters.
   * @param {object} props
   * @return {object} state properties related to time
   */
  buildTimeProps (props) {
    const startTime = new Date().getTime()
    const from = (props.from === undefined) ? startTime : props.from
    const timeDiff = (props.seconds === undefined)
      ? (props.to - from)
      : (props.seconds * 1000)
    this.initialTimeDiff = timeDiff // For internal use in later build stage
    return {
      startTime,
      from,
      timeDiff,
      initialTimeDiff: timeDiff
    }
  },
  /**
   * Gets an array of periods to create segments for.
   * @param {object} props
   * @return {string[]} periods
   */
  buildPeriods (props) {
    return PERIODS.slice(
      PERIODS.indexOf(props.maxPeriod),
      PERIODS.indexOf(props.minPeriod) + 1
    )
  },
  /**
   * Gets CSS classes for main counter.
   * @param {object} props
   * @return {string} class names
   */
  buildCSSClasses (props) {
    const type = props.easingFunction ? 'animated' : 'static'
    var classNames = `rollex rollex-${type}`
    if (props.frozen) classNames += ' rollex-frozen'
    return classNames
  },
  /**
   * Builds minDigits and maxDigits state properties.
   * @param {object} props
   * @param {string[]} periods - all periods available to the counter
   * @return {object} minDigits and maxDigits
   */
  buildMinAndMaxDigits (props, periods) {
    var [minDigits, maxDigits] = this.getMinAndMaxDigitsFromProps(props, periods)
    return this.normalizeMinAndMaxDigits(minDigits, maxDigits, props, periods)
  },
  /**
   * Gets minDigits and maxDigits from props specified by the user.
   * @param {object} props
   * @param {string[]} periods
   * @return {array}
   */
  getMinAndMaxDigitsFromProps (props, periods) {
    var minDigits = {}
    var maxDigits = {}

    if (typeof props.minDigits === 'number') {
      for (let period of periods) minDigits[period] = props.minDigits
    } else if (typeof props.minDigits === 'object') {
      minDigits = props.minDigits
    }
    if (typeof props.maxDigits === 'number') {
      for (let period of periods) maxDigits[period] = props.maxDigits
    } else if (typeof props.maxDigits === 'object') {
      maxDigits = props.maxDigits
    }
    return [minDigits, maxDigits]
  },
  /**
   * Normalizes minDigits and maxDigits and sets default values where user did not specify them.
   * @param {number|object} minDigits
   * @param {number|object} maxDigits
   * @param {object} props
   * @param {string[]} periods
   * @return {object}
   */
  normalizeMinAndMaxDigits (minDigits, maxDigits, props, periods) {
    for (let period of periods) {
      const minSegmentSize = this.getMinSegmentSize(props, period)
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
  getMinSegmentSize (props, period) {
    const maxValue = this.getPeriodMaxValue(props, period)
    return (maxValue).toString(props.radix).length
  },
  /**
   * Calculates maximum value for given period.
   * @return {number}
   */
  getPeriodMaxValue (props, period) {
    switch (period) {
      case 'seconds':
      case 'minutes':
        return 59
      case 'hours':
        return 23
      default:
        if (period === props.minPeriod) {
          // max number possible for this period during the countdown
          return NumberCalculator.getPeriodNumberAt(period, props.maxPeriod, this.initialTimeDiff)
        } else {
          return this.getPeriodMaxValue(props, props.minPeriod)
        }
    }
  }
}

export default CounterBuilder
