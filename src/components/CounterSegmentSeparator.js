import React from 'react'
import PropTypes from 'prop-types'

CounterSegmentSeparator.propTypes = {
  content: PropTypes.any,
}

/**
 * Separator between {@link CounterSegment} elements.
 * @example
 * <CounterSegmentSeparator content=':' />
 */
export default function CounterSegmentSeparator (props) {
  if (props.content === undefined) return null
  return (
    <div className='rollex-separator'>
      {props.content}
    </div>
  )
}
