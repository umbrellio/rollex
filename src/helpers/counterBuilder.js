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
    if (props.digits !== undefined && props.digits < 0) {
      throw new Error('"digits" must not be negative')
    }
    if (props.minPeriod && PERIODS.indexOf(props.minPeriod) < 0) {
      throw new Error(`"minPeriod" must be one of: ${PERIODS.join(', ')}'`)
    }
    if (props.maxPeriod && PERIODS.indexOf(props.maxPeriod) < 0) {
      throw new Error(`"maxPeriod" must be one of: ${PERIODS.join(', ')}`)
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

  /**
   * @param {object} props
   */
  constructor (props) {
    this.props = props
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
   * Builds "digits" state property.
   */
  buildDigitLimits () {
    var digits = this.getDigitLimitsFromProps()
    this.state = {
      ...this.state,
      ...this.normalizeDigitLimits(digits)
    }
  }

  /**
   * Gets digit limits from props specified by the user.
   * @return {Map<string, number>}
   */
  getDigitLimitsFromProps () {
    var digits = {}

    if (typeof this.props.digits === 'number') {
      for (let period of this.state.periods) digits[period] = this.props.digits
    } else if (typeof this.props.digits === 'object') {
      digits = this.props.digits
    }
    return digits
  }

  /**
   * Normalizes "digits" property.
   * @param {object} digits
   * @return {object}
   */
  normalizeDigitLimits (digits) {
    var normalizedDigits = {}

    for (let period of this.state.periods) {
      if (digits[period]) {
        normalizedDigits[period] = digits[period]
      } else {
        const limited = digits[period] === undefined
        normalizedDigits[period] = this.getMinSegmentSize(period, limited)
      }
    }
    return { digits: normalizedDigits }
  }

  /**
   * Calculates number of digits for current radix and given period.
   * @param {string} period - period to calculate digits for
   * @param {boolean} limited
   * @return {number}
   */
  getMinSegmentSize (period, limited) {
    const maxValue = this.getPeriodMaxValue(period, limited)
    return (maxValue).toString(this.props.radix).length
  }

  /**
   * Calculates maximum value for given period.
   * @param {string} period
   * @param {boolean} limited
   * @return {number}
   */
  getPeriodMaxValue (period, limited) {
    if (!limited && period === this.props.maxPeriod) {
      return NumberCalculator.getPeriodNumberAt(
        period, this.props.maxPeriod, this.state.initialTimeDiff
      )
    }
    switch (period) {
      case 'seconds':
      case 'minutes':
        return 59
      case 'hours':
        return 23
      case 'days':
        return Math.pow(this.props.radix, 2) - 1 // 99 for decimal
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
}
