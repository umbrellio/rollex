import { bootstrapDOM, clearDOM } from './support/helpers'
import matchers from './support/matchers'

beforeAll(function () {
  jasmine.addMatchers(matchers);
  (function () {
    function CustomEvent (event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined }
      var evt = document.createEvent('CustomEvent')
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
      return evt
    }

    CustomEvent.prototype = window.Event.prototype

    window.CustomEvent = CustomEvent
  })()
})

beforeEach(function () {
  jasmine.clock().install()
  bootstrapDOM()
})

afterEach(function () {
  clearDOM()
  jasmine.clock().uninstall()
})
