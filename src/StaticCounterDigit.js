import React from 'react'
import AbstractCounterDigit from './AbstractCounterDigit'

/**
 * static digit component
 * used when no easing function is set
 * @example
 * <StaticCounterDigit
 *   digit='5'
 *   height={18}
 *   radix={10}
 *   digitMap={{}}
 *   digitWrapper={(digit) => digit}
 * />
 */
class StaticCounterDigit extends AbstractCounterDigit {
  /**
   * render
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
