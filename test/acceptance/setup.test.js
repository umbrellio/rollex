import { bootstrapDOM, clearDOM, applyIEPolyfill } from './support/helpers'
import matchers from './support/matchers'

beforeAll(function () {
  jasmine.addMatchers(matchers)
  applyIEPolyfill()
})

beforeEach(function () {
  jasmine.clock().install()
  bootstrapDOM()
})

afterEach(function () {
  clearDOM()
  jasmine.clock().uninstall()
})
