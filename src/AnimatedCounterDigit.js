import React from 'react'
import ReactDOM from 'react-dom'
import AbstractCounterDigit from './AbstractCounterDigit'
const { number, string } = React.PropTypes

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
 *   height={18}
 *   radix={10}
 *   direction='down'
 *   digitMap={{}}
 *   digitWrapper={(digit) => digit}
 *   maxValue={9}
 *   easingFunction='ease-in'
 *   easingDuration={200}
 * />
 */
class AnimatedCounterDigit extends AbstractCounterDigit {
  /**
   * @property {string} direction - counting direction
   * @property {number} maxValue - maximum value used to build a digit lane
   * @property {string} easingFunction - easing function for transitions
   * @property {number} easingDuration - duration for digit transitions in milliseconds
   */
  static propTypes = {
    ...AbstractCounterDigit.propTypes,
    direction: string.isRequired,
    maxValue: number.isRequired,
    easingFunction: string.isRequired,
    easingDuration: number.isRequired
  }

  constructor (props) {
    super(props)

    const upperZeroPosition = -this.props.height * (this.props.radix - this.props.maxValue - 1)
    const lowerZeroPosition = -this.props.height * this.props.radix
    const initialZeroPosition = (this.props.direction === 'down')
      ? lowerZeroPosition : upperZeroPosition
    const finalZeroPosition = (this.props.direction === 'down')
      ? upperZeroPosition : lowerZeroPosition

    this.state = {
      initialZeroPosition,
      finalZeroPosition
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
  reset = (event) => {
    if (this.props.digit === '0') {
      event.target.style.transitionProperty = 'none'
      event.target.style.transform = `translateY(${this.state.initialZeroPosition}px)`
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
      <div key={key || digit} className='rollex-digit-lane-label' style={{ height: this.props.height }}>
        {this.decorateDigit(digit)}
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
    var digitDivs = []
    for (let i = 0; i <= this.props.maxValue; i++) {
      digitDivs.push(this.buildDigitDiv(i))
    }
    digitDivs.push(this.buildDigitDiv(0, this.props.radix + 1))
    return digitDivs
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
      return -this.props.height * (digitIndex + (this.props.radix - this.props.maxValue - 1))
    }
  }

  /**
   * Renders the digit.
   * @return {ReactElement} digit
   */
  render () {
    const style = {
      transform: `translateY(${this.getDigitPositionY()}px)`,
      transitionTimingFunction: this.props.easingFunction,
      transitionDuration: `${this.props.easingDuration}ms`,
      transitionProperty: 'transform',
      willChange: 'transform'
    }

    return (
      <div className='rollex-digit' onTransitionEnd={this.reset} style={style}>
        {this.buildDigitLane()}
      </div>
    )
  }
}

export default AnimatedCounterDigit
