import React from 'react'
import AnimatedCounterDigit from './AnimatedCounterDigit'
import StaticCounterDigit from './StaticCounterDigit'
const { arrayOf, object, number, string, func } = React.PropTypes

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
class CounterSegment extends React.Component {
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
  static propTypes = {
    digits: arrayOf(string).isRequired,
    period: string.isRequired,
    radix: number.isRequired,
    direction: string.isRequired,
    easingFunction: string,
    easingDuration: number.isRequired,
    digitMap: object.isRequired,
    digitWrapper: func.isRequired,
    label: string
  }

  /**
   * OPTIMIZE: this probably shouldn't be done in buildDigits. Perhaps we could perform calculations
   * for each possible index it in the constructor, but only for animated counters.
   *
   * Gets maximum value for period's digit with account for radix.
   * Used for building digit lanes in {@link AnimatedCounterDigit}.
   * @param {number} index - digit's index in number
   * @return {number} maxValue
   */
  getMaxValue (index) {
    const maxValue = PERIOD_LIMITS[this.props.period]
    if (!maxValue) return this.props.radix - 1

    const maxValueString = maxValue.toString(this.props.radix)
    const maxDigitPos = maxValueString.length
    return (index === this.props.digits.length - maxDigitPos)
      ? parseInt(maxValueString[0])
      : this.props.radix - 1
  }

  /**
   * Maps digits to corresponding components according to easing function.
   * @return {ReactElement[]}
   */
  buildDigits () {
    return this.props.digits.map((digit, index) => {
      if (this.props.easingFunction) {
        return (
          <AnimatedCounterDigit
            key={index}
            digit={digit}
            maxValue={this.getMaxValue(index)}
            radix={this.props.radix}
            direction={this.props.direction}
            easingFunction={this.props.easingFunction}
            easingDuration={this.props.easingDuration}
            digitMap={this.props.digitMap}
            digitWrapper={this.props.digitWrapper}
          />
        )
      } else {
        return (
          <StaticCounterDigit
            key={index}
            digit={digit}
            radix={this.props.radix}
            digitMap={this.props.digitMap}
            digitWrapper={this.props.digitWrapper}
          />
        )
      }
    })
  }

  /**
   * Renders the segment.
   * @return {ReactElement} counter segment
   */
  render () {
    return (
      <div className='rollex-segment'>
        <div className='rollex-digits' style={{ overflow: 'hidden' }}>
          {this.buildDigits()}
        </div>
        <div className='rollex-label'>
          {this.props.label}
        </div>
      </div>
    )
  }
}

export default CounterSegment
