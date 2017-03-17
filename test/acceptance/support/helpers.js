import React from 'react'
import ReactDOM from 'react-dom'
import Counter from '../../../src/components/Counter'

export function bootstrapDOM () {
  var root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
}

export function clearDOM () {
  const root = document.getElementById('root')
  ReactDOM.unmountComponentAtNode(root)
  root.parentNode.removeChild(root)
}

export function applyIEPolyfill () {
  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype
  window.CustomEvent = CustomEvent
}

export function render (component) {
  const ref = ReactDOM.render(component, document.getElementById('root'))
  return ReactDOM.findDOMNode(ref)
}

export function renderTenSecondCounter (params = {}) {
  const ref = ReactDOM.render(
    <Counter seconds={10} maxPeriod='seconds' {...params} />,
    document.getElementById('root')
  )
  return ReactDOM.findDOMNode(ref)
}

export function renderAnimatedTenSecondCounter (params = {}) {
  const ref = ReactDOM.render(
    <Counter seconds={10} maxPeriod='seconds' easingFunction='ease-in' easingDuration={0} {...params} />,
    document.getElementById('root')
  )
  return ReactDOM.findDOMNode(ref)
}
