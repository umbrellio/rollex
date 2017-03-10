import React from 'react'
import ReactDOM from 'react-dom'
import Counter from '../'
import CounterWithControls from './CounterWithControls'

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    <div>
      <Counter
        seconds={100000}
      />
      <Counter
        seconds={24891235}
        minDigits={3}
      />
      <Counter
        seconds={243523}
      />
      <Counter
        seconds={53423}
        radix={2}
      />
      <Counter
        seconds={10}
        interval={2000}
      />
      <Counter
        seconds={1000000}
        easingFunction='ease-in'
      />
      <Counter
        seconds={3128741412}
        easingFunction='ease-in-out'
        easingDuration={800}
        maxDigits={2}
      />
      <Counter
        seconds={4132749}
        easingFunction='ease-out'
        radix={12}
        digitMap={{
          'a': 'X',
          'b': 'E'
        }}
      />
      <Counter
        seconds={10}
        easingFunction='cubic-bezier(0.6, 0.04, 0.98, 0.335)'
      />
      <CounterWithControls
        counter={{
          from: new Date().getTime(),
          to: new Date().getTime() + 2321343445,
          easingFunction: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
          radix: 16,
          syncTime: true
        }}
        frozen={false}
      />
    </div>,
    document.getElementById('app')
  )
})
