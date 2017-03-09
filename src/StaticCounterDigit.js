import React from 'react'
import AbstractCounterDigit from './AbstractCounterDigit'

class StaticCounterDigit extends AbstractCounterDigit {
  render () {
    return (
      <div className='rollex-digit'>
        {this.decorateDigit(this.props.digit)}
      </div>
    )
  }
}

export default StaticCounterDigit
