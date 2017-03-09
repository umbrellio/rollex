import React from 'react'
import ReactDOM from 'react-dom'
import AbstractCounterDigit from './AbstractCounterDigit'
const { number, string } = React.PropTypes

function forceReflow (element) {
  element.offsetHeight // eslint-disable-line no-unused-expressions
}

class AnimatedCounterDigit extends AbstractCounterDigit {
  static propTypes = {
    ...AbstractCounterDigit.propTypes,
    maxValue: number.isRequired,
    easingFunction: string.isRequired,
    easingDuration: number.isRequired
  }

  componentDidMount () {
    this.reset({ target: ReactDOM.findDOMNode(this) })
  }

  /**
   * Change vertical position of digit lane without transition.
   * In a lane like [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0] go from first zero to last zero instantly.
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

  buildDigitDiv (digit, key) {
    return (
      <div key={key || digit} className='rollex-digit-lane-label' style={{ height: this.props.height }}>
        {this.decorateDigit(digit)}
      </div>
    )
  }

  buildDigitLane () {
    var digitDivs = []
    for (let i = 0; i <= this.props.maxValue; i++) {
      digitDivs.push(this.buildDigitDiv(i))
    }
    digitDivs.push(this.buildDigitDiv(0, this.props.radix + 1))
    return digitDivs
  }

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
