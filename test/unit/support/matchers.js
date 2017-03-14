import { shallow } from 'enzyme'
import diff from 'jest-diff'
import CounterSegment from '../../../src/components/CounterSegment'

export function toHaveDigits (object, expected) {
  const component = shallow(object)
  const segments = component.find(CounterSegment)

  var actual = []
  segments.forEach(function (segment) {
    actual.push(segment.props().digits)
  })

  const pass = jasmine.matchersUtil.equals(actual, expected)

  const message = pass
    ? () => {
      return (
        this.utils.matcherHint('.not.toBe') + '\n\n' +
        `Expected value to not be (using ===):\n` +
        `  ${this.utils.printExpected(expected)}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(actual)}`
      )
    }
    : () => {
      const diffString = diff(expected, actual, {
        expand: this.expand
      })
      return (
        this.utils.matcherHint('.toBe') + '\n\n' +
        `Expected value to be (using ===):\n` +
        `  ${this.utils.printExpected(expected)}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(actual)}` +
        (diffString ? `\n\nDifference:\n\n${diffString}` : '')
      )
    }

  return { pass, message }
}
