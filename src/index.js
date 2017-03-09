import React from 'react'
import CounterSegment from './CounterSegment'
const { number, string, bool, objectOf, any, func } = React.PropTypes

const PERIODS = [
  'days',
  'hours',
  'minutes',
  'seconds'
]

const PERIOD_DURATIONS = {
  'days': 86400000,
  'hours': 3600000,
  'minutes': 60000,
  'seconds': 1000
}

const PERIOD_DURATION_FUNCTIONS = {
  'hours': 'getUTCHours',
  'minutes': 'getMinutes',
  'seconds': 'getSeconds'
}

export default class Counter extends React.Component {
  /**
   * propTypes
   * @property {number} from - timestamp to count from.
   * @property {number} to - timestamp to count to.
   * @property {number} seconds - a number of seconds to count.
   * @property {number} interval - update interval.
   * @property {number} minDigits - minimum number of digits per segment.
   * @property {number} maxDigits - maximum number of digits per segment.
   * @property {string} minPeriod - smallest period to create a segment for.
   * @property {string} maxPeriod - largest period to create a segment for.
   * @property {boolean} frozen - determines if counter is frozen.
   * @property {boolean} syncTime - determines if counter should try to synchronize with client
   * time.
   * @property {string} easingFunction - easing function to use for rolling digits.
   * @property {number} easingDuration - easing duration in milliseconds.
   * @property {number} radix - numeral base to use.
   * @property {object} digitMap - a map to use when transforming digit symbols.
   * @property {function(digit: number)} digitWrapper - a wrapping function for mapped digits.
   */
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
    easingFunction: string,
    easingDuration: number,
    radix: number,
    digitMap: objectOf(any),
    digitWrapper: func
  }

  static defaultProps = {
    interval: 1000,
    minDigits: 2,
    minPeriod: 'second',
    maxPeriod: 'day',
    easingFunction: null,
    easingDuration: 300,
    radix: 10,
    digitMap: {},
    digitWrapper: (digit) => <span>{digit}</span>
  }

  constructor (props) {
    validateProps(props)
    super(props)

    const { to, from, seconds } = this.props
    const timeDiff = (seconds === undefined) ? (to - from) : (seconds * 1000)

    var minDigits = this.props.minDigits
    if (this.props.minDigits > this.props.maxDigits) minDigits = this.props.maxDigits

    this.state = {
      timeDiff,
      minDigits,
      digits: this.calculateDigits(timeDiff),
      currentTime: new Date().getTime()
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
    const newTimeDiff = this.getTimeDiff()
    if (newTimeDiff < 0) {
      return this.stop()
    }

    this.setState({
      timeDiff: newTimeDiff,
      digits: this.calculateDigits(newTimeDiff)
    })
  }

  getTimeDiff () {
    if (this.props.syncTime) {
      return this.props.to - this.props.from - new Date().getTime() + this.state.currentTime
    } else {
      return this.state.timeDiff - this.props.interval
    }
  }

  getPeriods () {
    return PERIODS.slice(
      PERIODS.indexOf(this.props.maxPeriod + 's'),
      PERIODS.indexOf(this.props.minPeriod + 's') + 1
    )
  }

  formatDigits (number) {
    const { maxDigits, radix } = this.props
    const minDigits = this.state.minDigits

    if (maxDigits && maxDigits > 0 && number >= Math.pow(radix, maxDigits)) {
      var nineArray = []
      for (let i = 0; i < maxDigits; i++) nineArray.push((radix - 1).toString())
      return nineArray
    }

    number = number.toString(radix)
    var zeroArray = []
    for (let i = 0; i < minDigits - number.length; i++) zeroArray.push('0')
    return (zeroArray.join('') + number).split('')
  }

  calculateDigits (timeDiff) {
    var digits = {}
    for (let period of this.getPeriods()) {
      digits = { ...digits, [period]: this.calculateDigit(period, timeDiff) }
    }
    return digits
  }

  calculateDigit (period, timeDiff) {
    const date = new Date(timeDiff)
    if (this.props.maxPeriod + 's' === period) {
      return Math.floor(timeDiff / PERIOD_DURATIONS[period])
    } else {
      return date[PERIOD_DURATION_FUNCTIONS[period]]()
    }
  }

  render () {
    const digits = this.state.digits
    const segments = this.getPeriods().map((period, index) => {
      return (<CounterSegment
        period={period}
        key={index}
        digits={this.formatDigits(digits[period])}
        radix={this.props.radix}
        easingFunction={this.props.easingFunction}
        easingDuration={this.props.easingDuration}
        digitMap={this.props.digitMap}
        digitWrapper={this.props.digitWrapper}
      />)
    })
    return (
      <div className='rollex'>
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
  if (props.radix < 2 || props.radix > 36) {
    throw new Error('"radix" must be between 2 and 36')
  }
  if (typeof props.digitWrapper !== 'function') {
    throw new Error('"digitWrapper" must be a function')
  }
  if (typeof props.digitMap !== 'object') {
    throw new Error('"digitMap" must be an object')
  }
}
