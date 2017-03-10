/* eslint-disable react/prop-types */
import React from 'react'
import Counter from '../'

export default class CounterWithControls extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      frozen: true
    }
  }

  onClick = () => {
    this.setState({
      frozen: !this.state.frozen
    })
  }

  render () {
    const label = this.state.frozen ? 'unfreeze' : 'freeze'
    return (
      <div className='counter-with-controls'>
        <Counter {...this.props.counter} frozen={this.state.frozen} />
        <div className='freeze-button' onClick={this.onClick}>{label}</div>
      </div>
    )
  }
}
