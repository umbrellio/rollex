import PropTypes from 'prop-types'

/**
 * @property {string} digit - digit to display
 * @property {number} radix
 * @property {Object} digitMap - a map for transforming particular digits
 * @property {function(digit: number)} digitWrapper - a function for wrapping mapped digits
 */
export const digitPropTypes = {
  digit: PropTypes.string.isRequired,
  radix: PropTypes.number.isRequired,
  digitMap: PropTypes.objectOf(PropTypes.any).isRequired,
  digitWrapper: PropTypes.func.isRequired
}

/**
 * Decorates given digit according to radix, digit map and digit wrapper.
 * @param {number} digit
 * @return {string} decoratedDigit
 */
export function decorateDigit (digit, props) {
  const digitString = (digit).toString(props.radix)
  return props.digitWrapper(props.digitMap[digitString] || digitString)
}
