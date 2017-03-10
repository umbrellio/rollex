import { shallowToJson } from 'enzyme-to-json'
import { AnimatedCounterDigitBuilder as Builder } from './support/builders'

it('matches snapshot', function () {
  const component = Builder.shallow()
  const tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})

it('limits the value to maxValue', function () {
  const component = Builder.shallow({ maxValue: 5 })
  expect(component.find('.rollex-digit-lane-label').length).toBe(7)
})

it('sets correct initial zero position', function () {
  const downComponent = Builder.shallow({ direction: 'down', height: 1 })
  expect(downComponent.state().initialZeroPosition).toBe(-10)
  const downComponentWithMax = Builder.shallow({ direction: 'down', maxValue: 2, height: 1 })
  expect(downComponentWithMax.state().initialZeroPosition).toBe(-10)

  const upComponent = Builder.shallow({ direction: 'up', height: 1 })
  expect(upComponent.state().initialZeroPosition).toBe(0)
  const upComponentWithMax = Builder.shallow({ direction: 'up', maxValue: 2, height: 1 })
  expect(upComponentWithMax.state().initialZeroPosition).toBe(-7)
})

it('sets correct final zero position', function () {
  const downComponent = Builder.shallow({ direction: 'down', height: 1 })
  expect(downComponent.state().finalZeroPosition).toBe(0)
  const downComponentWithMax = Builder.shallow({ direction: 'down', maxValue: 2, height: 1 })
  expect(downComponentWithMax.state().finalZeroPosition).toBe(-7)

  const upComponent = Builder.shallow({ direction: 'up', height: 1 })
  expect(upComponent.state().finalZeroPosition).toBe(-10)
  const upComponentWithMax = Builder.shallow({ direction: 'up', maxValue: 2, height: 1 })
  expect(upComponentWithMax.state().finalZeroPosition).toBe(-10)
})

test('reset() is being called on transition end', function () {
  const component = Builder.mount()
  component.instance().reset = jest.genMockFunction()
  component.instance().forceUpdate() // required for the mock to work
  component.find('.rollex-digit').simulate('transitionEnd')
  expect(component.instance().reset.mock.calls.length).toBe(1)
})
