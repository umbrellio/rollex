import React from 'react'
const { arrayOf, string } = React.PropTypes

class CounterSegment extends React.Component {
  static propTypes = {
    digits: arrayOf(string).isRequired,
    label: string.isRequired
  }

  render () {
    const digits = this.props.digits.map((digit, index) => {
      return (
        <div className='cntr-digit' key={index}>
          { digit }
        </div>
      )
    })
    return (
      <div className='cntr-segment'>
        { digits }
        <div className='cntr-label'>
          { this.props.label }
        </div>
      </div>
    )
  }
}

export default CounterSegment
