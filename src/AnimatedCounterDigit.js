import React from 'react'
import ReactDOM from 'react-dom'
import AbstractCounterDigit from './AbstractCounterDigit'
const { number, string } = React.PropTypes

/**
 * forces reflow of a given element
 * @param {Element} element
 */
function forceReflow (element) {
  element.offsetHeight // eslint-disable-line no-unused-expressions
}

/**
 * animated digit component
 * used when easing function is provided
 * @example
 * <AnimatedCounterDigit
 *   digit='5'
 *   height={18}
 *   radix={10}
 *   digitMap={{}}
 *   digitWrapper={(digit) => digit}
 *   maxValue={9}
 *   easingFunction='ease-in'
 *   easingDuration={200}
 * />
 */
class AnimatedCounterDigit extends AbstractCounterDigit {
  /**
   * propTypes
   * @property {number} maxValue - maximum value used to build a digit lane
   * @property {string} easingFunction - easing function for transitions
   * @property {number} easingDuration - duration for digit transitions in milliseconds
   */
  static propTypes = {
    ...AbstractCounterDigit.propTypes,
    maxValue: number.isRequired,
    easingFunction: string.isRequired,
    easingDuration: number.isRequired
  }

  /**
   * componentDidMount
   * calls reset in case current digit is a zero
   */
  componentDidMount () {
    this.reset({ target: ReactDOM.findDOMNode(this) })
  }

  /**
   * changes vertical position of digit lane without triggering a transition
   * in a lane like [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0] goes from first zero to last zero instantly
   * @param {SyntheticEvent} event
   */
  reset = (event) => {
    if (this.props.digit === '0') {
      event.target.style.transitionProperty = 'none'
      event.target.style.transform = `translateY(-${this.props.height * this.props.radix}px)`
      forceReflow(event.target)
      event.target.style.transitionProperty = ''
    }
  }

  /**
   * creates a div for a digit lane member
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
   * builds the digit lane
   * digit lane contains all available digits
   * it changes its vertical position in order to emulate counter rolling
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
   * render
   * @return {ReactElement} digit
   */
  render () {
    const digitIndex = parseInt(this.props.digit, this.props.radix)
    const yPosition = -this.props.height * (digitIndex + (this.props.radix - this.props.maxValue - 1))
    const style = {
      transform: `translateY(${yPosition}px)`,
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
