import React from 'react'
import ReactDOM from 'react-dom'
import Counter from '../../../src/'

export function bootstrapDOM () {
  var root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
}

export function clearDOM () {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'))
  document.body.innerHTML = ''
}

export function render (component) {
  const ref = ReactDOM.render(component, document.getElementById('root'))
  return ReactDOM.findDOMNode(ref)
}

export function renderTenSecondCounter (params = {}) {
  const ref = ReactDOM.render(
    <Counter seconds={10} maxPeriod='second' {...params} />,
    document.getElementById('root')
  )
  return ReactDOM.findDOMNode(ref)
}

export function renderAnimatedTenSecondCounter (params = {}) {
  const ref = ReactDOM.render(
    <Counter seconds={10} maxPeriod='second' easingFunction='ease-in' easingDuration={0} {...params} />,
    document.getElementById('root')
  )
  return ReactDOM.findDOMNode(ref)
}
