import React from 'react'
import ReactDOMServer from 'react-dom/server'
import AnimatedCounterDigit from './AnimatedCounterDigit'
import StaticCounterDigit from './StaticCounterDigit'
const { arrayOf, objectOf, number, string, any, func } = React.PropTypes

const PERIOD_LIMITS = {
  'seconds': 59,
  'minutes': 59,
  'hours': 23,
  'days': 0
}

class CounterSegment extends React.Component {
  static propTypes = {
    digits: arrayOf(string).isRequired,
    period: string.isRequired,
    radix: number.isRequired,
    easingFunction: string,
    easingDuration: number.isRequired,
    digitMap: objectOf(any).isRequired,
    digitWrapper: func.isRequired
  }

  constructor (props) {
    super(props)

    const testDigit = document.createElement('div')
    testDigit.innerHTML = ReactDOMServer.renderToString(this.props.digitWrapper('0'))
    document.getElementsByTagName('body')[0].appendChild(testDigit)
    this.state = {
      digitHeight: testDigit.clientHeight
    }
    testDigit.remove()
  }

  getMaxValue (index) {
    const maxValue = PERIOD_LIMITS[this.props.period].toString(this.props.radix)
    const maxDigitPos = maxValue.length
    return (index === this.props.digits.length - maxDigitPos)
      ? parseInt(maxValue[0])
      : this.props.radix - 1
  }

  buildDigits () {
    return this.props.digits.map((digit, index) => {
      if (this.props.easingFunction) {
        return (
          <AnimatedCounterDigit
            key={index}
            digit={digit}
            maxValue={this.getMaxValue(index)}
            radix={this.props.radix}
            easingFunction={this.props.easingFunction}
            easingDuration={this.props.easingDuration}
            height={this.state.digitHeight}
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
            height={this.state.digitHeight}
            digitMap={this.props.digitMap}
            digitWrapper={this.props.digitWrapper}
          />
        )
      }
    })
  }

  render () {
    const style = {
      overflow: 'hidden',
      height: `${this.state.digitHeight}px`
    }
    return (
      <div className='rollex-segment'>
        <div className='rollex-digits' style={style}>
          {this.buildDigits()}
        </div>
        <div className='rollex-label'>
          {this.props.period}
        </div>
      </div>
    )
  }
}

export default CounterSegment
