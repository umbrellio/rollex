import React from 'react'
import PropTypes from 'prop-types'
const { any } = PropTypes

/**
 * Separator between {@link CounterSegment} elements.
 * @example
 * <CounterSegmentSeparator content=':' />
 */
class CounterSegmentSeparator extends React.Component {
  /**
   * @property content
   */
  static propTypes = {
    content: any
  }

  /**
   * Renders the separator.
   * @return {ReactElement} separator
   */
  render () {
    if (this.props.content === undefined) return null
    return (
      <div className='rollex-separator'>
        {this.props.content}
      </div>
    )
  }
}

export default CounterSegmentSeparator
