import { bootstrapDOM, clearDOM } from './support/helpers'
import matchers from './support/matchers'

beforeAll(() => {
  jasmine.addMatchers(matchers)
})

beforeEach(() => {
  jasmine.clock().install()
  bootstrapDOM()
})

afterEach(() => {
  clearDOM()
  jasmine.clock().uninstall()
})
