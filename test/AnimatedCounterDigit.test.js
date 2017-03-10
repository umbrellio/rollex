import { AnimatedCounterDigitBuilder as Builder } from './support/builders'
import { shallowToJson } from 'enzyme-to-json'

it('matches snapshot', function () {
  const component = Builder.shallow()
  const tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})

it('limits the value to maxValue', function () {
  const component = Builder.shallow({ maxValue: 5 })
  expect(component.find('.rollex-digit-lane-label').length).toBe(7)
})
