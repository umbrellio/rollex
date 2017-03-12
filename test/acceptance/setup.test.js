import { bootstrapDOM, clearDOM } from './support/helpers'
import matchers from './support/matchers'

beforeAll(function () {
  jasmine.addMatchers(matchers)
})

beforeEach(function () {
  jasmine.clock().install()
  bootstrapDOM()
})

afterEach(function () {
  clearDOM()
  jasmine.clock().uninstall()
})
