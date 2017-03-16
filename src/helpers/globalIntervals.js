/**
 * Helper object with global interval management functions.
 */
const GlobalIntervals = {
  /**
   * Ensures existence of an interval.
   * @param {!number} duration - interval duration in milliseconds
   */
  ensureExistence (duration) {
    if (!window.rollexIntervals) window.rollexIntervals = {}
    if (!window.rollexIntervals[duration]) {
      window.rollexIntervals[duration] = {
        interval: setInterval(() => {
          window.dispatchEvent(new CustomEvent(`rollex:tick:${duration}`))
        }, duration, false),
        counterCount: 0
      }
    }
  },
  /**
   * Cleans up an interval.
   * @param {!number} duration - interval duration in milliseconds
   */
  cleanup (duration) {
    if (window.rollexIntervals[duration].counterCount === 0) {
      clearInterval(window.rollexIntervals[duration].interval)
      delete (window.rollexIntervals[duration])
    }
  },
  /**
   * Adds a subscriber to an interval.
   * @param {!number} duration - interval duration in milliseconds
   * @param {!Object|function} subscriber
   */
  subscribe (duration, subscriber) {
    window.rollexIntervals[duration].counterCount += 1
    window.addEventListener(`rollex:tick:${duration}`, subscriber, false)
  },
  /**
   * Removes a subscriber from an interval.
   * @param {!number} duration - interval duration in milliseconds
   * @param {!Object|function} subscriber
   */
  unsubscribe (duration, subscriber) {
    window.removeEventListener(`rollex:tick:${duration}`, subscriber, false)
    window.rollexIntervals[duration].counterCount -= 1
  }
}

export default GlobalIntervals
