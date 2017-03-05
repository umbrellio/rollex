import React from 'react'
import CounterSegment from './CounterSegment'
const { number, string, bool } = React.PropTypes

export default class Counter extends React.Component {
  static propTypes = {
    from: number,
    to: number,
    seconds: number,
    interval: number,
    minDigits: number,
    frozen: bool,
    easing: string
  }

  static defaultProps = {
    interval: 1000,
    minDigits: 2
  }

  constructor (props) {
    validateProps(props)
    super(props)

    const { to, from, seconds } = this.props
    const timeDiff = (seconds === undefined) ? (to - from) : (seconds * 1000)
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
    if (!this.props.frozen) this._interval = setInterval(() => this.tick(), this.props.interval)
  }

  stop () {
    if (!this.props.frozen) clearInterval(this._interval)
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

function countDigits (timeDiff) {
  return {
    days: Math.floor(timeDiff / 1000 / 60 / 60 / 24),
    hours: new Date(timeDiff).getUTCHours(),
    minutes: new Date(timeDiff).getMinutes(),
    seconds: new Date(timeDiff).getSeconds()
  }
}

function validateProps (props) {
  if (props.seconds !== undefined) {
    if (props.to !== undefined || props.from !== undefined) {
      throw new Error('cannot use "to" and "from" with "seconds"')
    } else if (props.seconds < 0) {
      throw new Error('"seconds" must be greater than or equal to zero')
    }
  } else if (props.to === undefined || props.from === undefined) {
    throw new Error('provide either "seconds" or "to" and "from"')
  } else if (props.to < props.from) {
    throw new Error('"to" must be bigger than "from"')
  }
  if (props.minDigits !== undefined && props.minDigits < 1) {
    throw new Error('"minDigits" must be positive')
  }
}
