import React from 'react'
import CounterSegment from './CounterSegment'
const { number, string } = React.PropTypes

function countDigits (timeDiff) {
  return {
    days: Math.floor(timeDiff / 1000 / 60 / 60 / 24),
    hours: new Date(timeDiff).getUTCHours(),
    minutes: new Date(timeDiff).getMinutes(),
    seconds: new Date(timeDiff).getSeconds()
  }
}

class Counter extends React.Component {
  static propTypes = {
    from: number.isRequired,
    to: number.isRequired,
    interval: number,
    minDigits: number,
    easing: string
  }

  static defaultProps = {
    interval: 1000,
    minDigits: 2
  }

  constructor (props) {
    super(props)
    const timeDiff = this.props.to - this.props.from
    this.state = {
      timeDiff,
      digits: countDigits(timeDiff)
    }
  }

  componentDidMount () {
    this.start()
  }

  componentWillUnmount () {
    this.stop()
  }

  start () {
    this.interval = setInterval(() => this.tick(), this.props.interval)
  }

  stop () {
    clearInterval(this.interval)
  }

  tick () {
    const newTimeDiff = this.state.timeDiff - this.props.interval
    if (newTimeDiff < 0) {
      return this.stop()
    }

    this.setState({
      timeDiff: newTimeDiff,
      digits: countDigits(newTimeDiff)
    })
  }

  render () {
    const digits = this.state.digits
    return (
      <div className='cntr'>
        <CounterSegment label='days' digits={this.format(digits.days)} />
        <CounterSegment label='hours' digits={this.format(digits.hours)} />
        <CounterSegment label='minutes' digits={this.format(digits.minutes)} />
        <CounterSegment label='seconds' digits={this.format(digits.seconds)} />
      </div>
    )
  }

  format (number) {
    var zeroArray = []
    for (let i = 0; i < this.props.minDigits; i++) zeroArray.push(0)
    const zeroString = zeroArray.join('')
    return (zeroString + number.toString()).slice(-this.props.minDigits).split('')
  }
}

export default Counter
