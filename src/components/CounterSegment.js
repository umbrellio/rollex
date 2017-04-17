import React from 'react'
import PropTypes from 'prop-types'
import AnimatedCounterDigit from './AnimatedCounterDigit'
import StaticCounterDigit from './StaticCounterDigit'

/**
 * @type {Object}
 * Maximum decimal values for available periods' numbers.
 */
const PERIOD_LIMITS = {
  'seconds': 59,
  'minutes': 59,
  'hours': 23,
  'days': 0
}

/**
 * @property {string[]} digits - digits to display
 * @property {string} period
 * @property {number} radix
 * @property {string} direction - counting direction
 * @property {string} easingFunction - easing function to use for digit transitions
 * @property {number} easingDuration - duration of digit transitions
 * @property {Object} digitMap - a map for transforming particular digits
 * @property {function(digit: number)} digitWrapper - a function for wrapping mapped digits
 * @property {string} label
 */
CounterSegment.propTypes = {
  digits: PropTypes.arrayOf(PropTypes.string).isRequired,
  period: PropTypes.string.isRequired,
  radix: PropTypes.number.isRequired,
  direction: PropTypes.string.isRequired,
  easingFunction: PropTypes.string,
  easingDuration: PropTypes.number.isRequired,
  digitMap: PropTypes.object.isRequired,
  digitWrapper: PropTypes.func.isRequired,
  label: PropTypes.string
}

/**
 * Counter segment component.
 * @example
 * <CounterSegment
 *   digits={['0', '0']}
 *   period='days'
 *   radix={10}
 *   direction='down'
 *   easingDuration={300}
 *   digitMap={{ '0' => 'o' }}
 *   digitWrapper={(digit) => digit}
 * />
 */
export default function CounterSegment (props) {
  /**
   * Gets maximum value for period's digit with account for radix.
   * Used for building digit lanes in {@link AnimatedCounterDigit}.
   * @param {number} index - digit's index in number
   * @return {number} maxValue
   */
  function getMaxValue (index) {
    const maxValue = PERIOD_LIMITS[props.period]
    if (!maxValue) return props.radix - 1

    const maxValueString = maxValue.toString(props.radix)
    const maxDigitPos = maxValueString.length
    return (index === props.digits.length - maxDigitPos)
      ? parseInt(maxValueString[0])
      : props.radix - 1
  }

  /**
   * Maps digits to corresponding components according to easing function.
   * @return {ReactElement[]}
   */
  function buildDigits () {
    return props.digits.map((digit, index) => {
      if (props.easingFunction) {
        return (
          <AnimatedCounterDigit
            key={index}
            digit={digit}
            maxValue={getMaxValue(index)}
            radix={props.radix}
            direction={props.direction}
            easingFunction={props.easingFunction}
            easingDuration={props.easingDuration}
            digitMap={props.digitMap}
            digitWrapper={props.digitWrapper}
          />
        )
      } else {
        return (
          <StaticCounterDigit
            key={index}
            digit={digit}
            radix={props.radix}
            digitMap={props.digitMap}
            digitWrapper={props.digitWrapper}
          />
        )
      }
    })
  }

  return (
    <div className='rollex-segment'>
      <div className='rollex-digits' style={{ overflow: 'hidden' }}>
        {buildDigits()}
      </div>
      <div className='rollex-label'>
        {props.label}
      </div>
    </div>
  )
}
