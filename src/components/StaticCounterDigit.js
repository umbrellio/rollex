import React from 'react'
import { digitPropTypes, decorateDigit } from '../helpers/counterDigitHelper'

/**
 * @property {string} digit - digit to display
 * @property {number} radix
 * @property {Object} digitMap - a map for transforming particular digits
 * @property {function(digit: number)} digitWrapper - a function for wrapping mapped digits
 */
StaticCounterDigit.propTypes = digitPropTypes

/**
 * Static digit component.
 * Used when no easing function is set for a counter.
 * @example
 * <StaticCounterDigit
 *   digit='5'
 *   radix={10}
 *   digitMap={{}}
 *   digitWrapper={(digit) => digit}
 * />
 */
export default function StaticCounterDigit (props) {
  return (
    <div className='rollex-digit'>
      {decorateDigit(props.digit, props)}
    </div>
  )
}
