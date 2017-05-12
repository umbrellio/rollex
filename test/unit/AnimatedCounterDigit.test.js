import { shallowToJson } from 'enzyme-to-json'
import { AnimatedCounterDigitBuilder as Builder } from './support/builders'

it('matches snapshot', () => {
  const component = Builder.shallow()
  const tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})

it('limits the value to maxValue', () => {
  const component = Builder.shallow({ maxValue: 5 })
  expect(component.find('.rollex-digit-lane-label').length).toBe(7)
})

test('reset() is being called on transition end', () => {
  const component = Builder.mount()
  component.instance().reset = jest.genMockFunction()
  component.instance().forceUpdate() // required for the mock to work
  component.find('.rollex-digit').simulate('transitionEnd')
  expect(component.instance().reset.mock.calls.length).toBe(1)
})
