import React from 'react'
import ReactDOM from 'react-dom'
import Counter from './'

ReactDOM.render(
  <div>
    <Counter
      seconds={100000}
    />
    <Counter
      seconds={1000000}
      easingFunction='ease-in'
    />
  </div>,
  document.getElementById('app')
)
