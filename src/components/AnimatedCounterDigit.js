import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { digitPropTypes, decorateDigit } from '../helpers/counterDigitHelper'

/**
 * Forces reflow of a given element.
 * @param {Element} element
 */
function forceReflow (element) {
  element.offsetHeight // eslint-disable-line no-unused-expressions
}

/**
 * Animated digit component.
 * Used when counter has an easing function.
 * @example
 * <AnimatedCounterDigit
 *   digit='5'
 *   radix={10}
 *   direction='down'
 *   digitMap={{}}
 *   digitWrapper={(digit) => digit}
 *   maxValue={9}
 *   easingFunction='ease-in'
 *   easingDuration={200}
 * />
 */
class AnimatedCounterDigit extends React.Component {
  /**
   * @property {string} digit - digit to display
   * @property {number} radix
   * @property {Object} digitMap - a map for transforming particular digits
   * @property {function(digit: number)} digitWrapper - a function for wrapping mapped digits
   * @property {string} direction - counting direction
   * @property {number} maxValue - maximum value used to build a digit lane
   * @property {string} easingFunction - easing function for transitions
   * @property {number} easingDuration - duration for digit transitions in milliseconds
   */
  static propTypes = {
    ...digitPropTypes,
    direction: PropTypes.string.isRequired,
    maxValue: PropTypes.number.isRequired,
    easingFunction: PropTypes.string.isRequired,
    easingDuration: PropTypes.number.isRequired
  }

  constructor (props) {
    super(props)

    // e.x.: 0..9 and another 0 => 9+2 = 11 digits total (see reset method)
    const singleDigitHeight = 100 / (props.maxValue + 2)
    const upperZeroPosition =
      -singleDigitHeight * (props.radix - props.maxValue - 1)
    const lowerZeroPosition = -singleDigitHeight * props.radix
    const initialZeroPosition = props.direction === 'down'
      ? lowerZeroPosition
      : upperZeroPosition
    const finalZeroPosition = props.direction === 'down'
      ? upperZeroPosition
      : lowerZeroPosition

    this.state = {
      initialZeroPosition,
      finalZeroPosition,
      singleDigitHeight,
      digitLane: this.buildDigitLane()
    }
  }

  componentDidMount () {
    this.reset({ target: ReactDOM.findDOMNode(this) })
  }

  /**
   * Changes vertical position of digit lane without triggering a transition.
   * In a lane like [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0] goes from first zero to last zero instantly.
   * @param {SyntheticEvent} event
   */
  reset = event => {
    if (this.props.digit === '0') {
      event.target.style.transitionProperty = 'none'
      event.target.style.transform = `translate3D(0, ${this.state.initialZeroPosition}%, 0)`
      forceReflow(event.target)
      event.target.style.transitionProperty = ''
    }
  }

  /**
   * Creates a div for a digit lane member.
   * @param {string} digit
   * @param {number} key - index to use for React's key property
   * @return {ReactElement}
   */
  buildDigitDiv (digit, key) {
    return (
      <div key={key || digit} className='rollex-digit-lane-label'>
        {decorateDigit(digit, this.props)}
      </div>
    )
  }

  /**
   * Builds the digit lane.
   * Digit lane contains all available digits.
   * It changes its vertical position in order to emulate counter rolling.
   * @return {ReactElement[]}
   */
  buildDigitLane () {
    var digitLane = []
    for (let i = 0; i <= this.props.maxValue; i++) {
      digitLane.push(this.buildDigitDiv(i))
    }
    digitLane.push(this.buildDigitDiv(0, this.props.radix + 1))
    return digitLane
  }

  /**
   * Calculates Y position for the digit.
   * @return {number} yPosition
   */
  getDigitPositionY () {
    const digitIndex = parseInt(this.props.digit, this.props.radix)
    if (digitIndex === 0) {
      return this.state.finalZeroPosition
    } else {
      return (
        -this.state.singleDigitHeight *
        (digitIndex + (this.props.radix - this.props.maxValue - 1))
      )
    }
  }

  /**
   * Renders the digit.
   * @return {ReactElement} digit
   */
  render () {
    const transform = `translate3D(0, ${this.getDigitPositionY()}%, 0)`
    const style = {
      transform: transform,
      WebkitTransform: transform,
      MsTransform: transform,
      transitionTimingFunction: this.props.easingFunction,
      transitionDuration: `${this.props.easingDuration}ms`,
      transitionProperty: 'transform',
      willChange: 'transform'
    }

    return (
      <div className='rollex-digit' onTransitionEnd={this.reset} style={style}>
        {this.state.digitLane}
      </div>
    )
  }
}

export default AnimatedCounterDigit
