/**
 * Helper object with global interval management functions.
 */
const GlobalIntervals = {
  /**
   * Returns an interval with a given duration. Creates one if it doesn't exist.
   * @param {!number} duration - interval duration in milliseconds
   * @return {object}
   */
  getInterval (duration) {
    if (!this.intervals[duration]) {
      const intervalsObj = (this.intervals[duration] = {
        callbacks: [],
      })
      intervalsObj.interval = setInterval(
        function () {
          this.callbacks.forEach(cb => cb())
        }.bind(intervalsObj),
        duration,
        false
      )
    }
    return this.intervals[duration]
  },
  /**
   * @param {!number} duration - interval duration in milliseconds
   */
  removeIntervalWithDuration (duration) {
    clearInterval(this.intervals[duration].interval)
    delete this.intervals[duration]
  },
  /**
   * Adds a listener to an interval.
   * @param {!number} duration - interval duration in milliseconds
   * @param {!function} callback - listener
   * @return {function} unsubscribe
   */
  subscribe (duration, callback) {
    const callbacks = this.getInterval(duration).callbacks
    callbacks.push(callback)
    return () => this.removeListener(duration, callback)
  },
  /**
   * Removes a listener from its interval. Stops the interval if it no longer has listeners.
   * @param {!number} duration
   * @param {!function} cb - listener
   */
  removeListener (duration, cb) {
    const interval = this.intervals[duration]
    if (!interval) return
    const callbacks = interval.callbacks

    if (callbacks.length > 1) {
      callbacks.splice(callbacks.indexOf(cb), 1)
    } else {
      this.removeIntervalWithDuration(duration)
    }
  },
  /**
   * Stores global intervals
   */
  intervals: {},
}

export default GlobalIntervals
