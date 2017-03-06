import React from 'react'
import CounterSegment from './CounterSegment'
const { number, string, bool } = React.PropTypes

const PERIODS = [
  'days',
  'hours',
  'minutes',
  'seconds'
]

export default class Counter extends React.Component {
  static propTypes = {
    from: number,
    to: number,
    seconds: number,
    interval: number,
    minDigits: number,
    maxDigits: number,
    minPeriod: string,
    maxPeriod: string,
    frozen: bool,
    syncTime: bool,
    currentTime: number,
    easing: string // currently unused
  }

  static defaultProps = {
    interval: 1000,
    minDigits: 2,
    minPeriod: 'second',
    maxPeriod: 'day',
    currentTime: (new Date()).getTime()
  }

  constructor (props) {
    validateProps(props)
    super(props)

    const { to, from, seconds } = this.props
    const timeDiff = (seconds === undefined) ? (to - from) : (seconds * 1000)
    this.state = {
      timeDiff,
      digits: this.calculateDigits(timeDiff)
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
    const { syncTime, currentTime, to, from, interval } = this.props
    const newTimeDiff = syncTime ? (to - from - (new Date()).getTime() + currentTime) : (this.state.timeDiff - interval)
    if (newTimeDiff < 0) {
      return this.stop()
    }

    this.setState({
      timeDiff: newTimeDiff,
      digits: this.calculateDigits(newTimeDiff)
    })
  }

  periods () {
    return PERIODS.slice(
      PERIODS.indexOf(this.props.maxPeriod + 's'),
      PERIODS.indexOf(this.props.minPeriod + 's') + 1
    )
  }

  formatDigits (number) {
    var { minDigits, maxDigits } = this.props
    if (minDigits > maxDigits) minDigits = maxDigits

    if (maxDigits && maxDigits > 0 && number > Math.pow(10, maxDigits)) {
      var nineArray = []
      for (let i = 0; i < maxDigits; i++) nineArray.push('9')
      return nineArray
    }

    number = number.toString()
    var zeroArray = []
    for (let i = 0; i < minDigits - number.length; i++) zeroArray.push(0)
    return (zeroArray.join('') + number).split('')
  }

  calculateDigits (timeDiff) {
    var digits = {}
    for (let period of this.periods()) {
      Object.assign(digits, { [period]: this.calculateDigit(period, timeDiff) })
    }
    return digits
  }

  calculateDigit (period, timeDiff) {
    const date = new Date(timeDiff)
    switch (period) {
      case 'days':
        return Math.floor(timeDiff / 1000 / 60 / 60 / 24)
      case 'hours':
        if (this.props.maxPeriod !== 'hour') {
          return date.getUTCHours()
        } else {
          return Math.floor(timeDiff / 1000 / 60 / 60)
        }
      case 'minutes':
        if (this.props.maxPeriod !== 'minute') {
          return date.getMinutes()
        } else {
          return Math.floor(timeDiff / 1000 / 60)
        }
      case 'seconds':
        if (this.props.maxPeriod !== 'second') {
          return date.getSeconds()
        } else {
          return Math.floor(timeDiff / 1000)
        }
    }
  }

  render () {
    const digits = this.state.digits
    const segments = this.periods().map((period, index) => {
      return <CounterSegment
        label={period}
        key={index}
        digits={this.formatDigits(digits[period])}
      />
    })
    return (
      <div className='cntr'>
        {segments}
      </div>
    )
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
  if (props.minPeriod && PERIODS.indexOf(props.minPeriod + 's') < 0) {
    throw new Error('"minPeriod" must be one of: day, hour, minute, second')
  }
  if (props.maxPeriod && PERIODS.indexOf(props.maxPeriod + 's') < 0) {
    throw new Error('"maxPeriod" must be one of: day, hour, minute, second')
  }
  if (props.syncTime && props.to === undefined) {
    throw new Error('"syncTime" must only be used with "to" and "from"')
  }
}
