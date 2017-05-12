/**
 * @type {Object}
 * Durations for available periods (in milliseconds).
 */
const PERIOD_DURATIONS = {
  days: 86400000,
  hours: 3600000,
  minutes: 60000,
  seconds: 1000,
}

/**
 * @type {Object}
 * Time calculation functions for available periods.
 */
const PERIOD_DURATION_FUNCTIONS = {
  hours: 'getUTCHours',
  minutes: 'getMinutes',
  seconds: 'getSeconds',
}

/**
 * Handles period number calculations.
 */
const NumberCalculator = {
  /**
   * Calculates numbers for each period for a given timestamp.
   * @param {string[]} periods - periods to calculate numbers for
   * @param {number} timestamp - timestamp to calculate numbers for
   * @return {Map<string, number>} numbers - a map from periods to corresponding numbers
   */
  calculateNumbers (periods, timestamp) {
    let numbers = {}
    const maxPeriod = periods[0]
    periods.forEach(period => {
      numbers = {
        ...numbers,
        [period]: this.getPeriodNumberAt(period, maxPeriod, timestamp),
      }
    })
    return numbers
  },
  /**
   * Calculates number for given period and timestamp.
   * @param {string} period
   * @param {string} maxPeriod
   * @param {number} timestamp
   * @return {number}
   */
  getPeriodNumberAt (period, maxPeriod, timestamp) {
    const date = new Date(timestamp)
    if (maxPeriod === period) {
      return Math.floor(timestamp / PERIOD_DURATIONS[period])
    } else {
      return date[PERIOD_DURATION_FUNCTIONS[period]]()
    }
  },
}

export default NumberCalculator
