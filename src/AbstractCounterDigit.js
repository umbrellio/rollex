import React from 'react'
const { objectOf, any, number, string, func } = React.PropTypes

/**
 * Common logic for {@link StaticCounterDigit} and {@link AnimatedCounterDigit}.
 */
class AbstractCounterDigit extends React.Component {
  /**
   * @property {string} digit - digit to display
   * @property {number} height - digit height in pixels
   * @property {number} radix
   * @property {Object} digitMap - a map for transforming particular digits
   * @property {function(digit: number)} digitWrapper - a function for wrapping mapped digits
   */
  static propTypes = {
    digit: string.isRequired,
    height: number.isRequired,
    radix: number.isRequired,
    digitMap: objectOf(any).isRequired,
    digitWrapper: func.isRequired
  }

  /**
   * Decorates given digit according to radix, digit map and digit wrapper.
   * @param {number} digit
   * @return {string} decoratedDigit
   */
  decorateDigit (digit) {
    const digitString = (digit).toString(this.props.radix)
    return this.props.digitWrapper(this.props.digitMap[digitString] || digitString)
  }
}

export default AbstractCounterDigit
