import React from 'react'
import AbstractCounterDigit from './AbstractCounterDigit'

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
class StaticCounterDigit extends AbstractCounterDigit {
  /**
   * Renders the digit.
   * @return {ReactElement} digit
   */
  render () {
    return (
      <div className='rollex-digit'>
        {this.decorateDigit(this.props.digit)}
      </div>
    )
  }
}

export default StaticCounterDigit
