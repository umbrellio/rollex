import React from 'react'
const { objectOf, any, number, string, func } = React.PropTypes

class AbstractCounterDigit extends React.Component {
  static propTypes = {
    digit: string.isRequired,
    height: number.isRequired,
    radix: number.isRequired,
    digitMap: objectOf(any).isRequired,
    digitWrapper: func.isRequired
  }

  decorateDigit (digit) {
    const digitString = (digit).toString(this.props.radix)
    return this.props.digitWrapper(this.props.digitMap[digitString] || digitString)
  }
}

export default AbstractCounterDigit
