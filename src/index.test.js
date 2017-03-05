import React from 'react'
import { shallow, mount } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import Counter from './'
import CounterSegment from './CounterSegment'

it('matches snapshot', function () {
  const component = shallow(<Counter from={0} to={1} />)
  const tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})

it('should render a CounterSegment for each segment', function () {
  const component = shallow(<Counter from={0} to={1} />)
  expect(component.find(CounterSegment).length).toEqual(4)
})

test('default state', function () {
  const from = (new Date()).getTime()
  const to = from +
    (1000 * 60 * 60 * 24 * 2) +
    (1000 * 60 * 60 * 6) +
    (1000 * 60 * 35) +
    (1000 * 54)
  const component = shallow(<Counter from={from} to={to} />)
  expect(component.state()).toEqual({
    timeDiff: to - from,
    digits: {
      days: 2,
      hours: 6,
      minutes: 35,
      seconds: 54
    }
  })
})

test('default props', function () {
  const component = mount(<Counter from={0} to={1} />)
  expect(component.props()).toEqual({
    from: 0,
    to: 1,
    interval: 1000,
    minDigits: 2
  })
})

it('allows to set props', function () {
  const component = mount(<Counter from={10} to={20} interval={897} minDigits={3} easing='myEasing' />)
  expect(component.props()).toEqual({
    from: 10,
    to: 20,
    interval: 897,
    minDigits: 3,
    easing: 'myEasing'
  })
})

it('starts to count when mounted', function () {
  jest.useFakeTimers()
  const component = mount(<Counter from={0} to={10000} />)
  expect(component.state().digits.seconds).toBe(10)
  expect(setInterval.mock.calls.length).toBe(1)

  jest.runTimersToTime(5000)
  expect(component.state().timeDiff).toBe(5000)
  expect(component.state().digits.seconds).toBe(5)
})

it('stops to count when stopped', function () {
  jest.useFakeTimers()
  const component = mount(<Counter from={0} to={10000} />)

  jest.runTimersToTime(5000)
  expect(component.state().digits.seconds).toBe(5)

  component.instance().stop()
  jest.runTimersToTime(10000)
  expect(component.state().digits.seconds).toBe(5)
})

it('stops to count when reached zero', function () {
  jest.useFakeTimers()
  const component = mount(<Counter from={0} to={10000} />)

  jest.runTimersToTime(10000)
  expect(component.state().timeDiff).toBe(0)
  expect(component.state().digits.seconds).toBe(0)

  jest.runTimersToTime(10000)
  expect(component.state().timeDiff).toBe(0)
  expect(component.state().digits.seconds).toBe(0)
})
