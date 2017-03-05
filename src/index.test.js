import React from 'react'
import { shallow, mount } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import Counter from './'
import CounterSegment from './CounterSegment'

describe('initialization', function () {
  it('should throw an error when no time options are provided', function () {
    expect(
      () => shallow(<Counter />)
    ).toThrowError('provide either "seconds" or "to" and "from"')
  })

  it('should throw an error when "to", "from" and "seconds" are provided', function () {
    expect(
      () => shallow(<Counter from={0} to={1} seconds={2} />)
    ).toThrowError('cannot use "to" and "from" with "seconds"')
  })

  it('should throw an error when time options are provided incorrectly', function () {
    expect(
      () => shallow(<Counter from={0} />)
    ).toThrowError('provide either "seconds" or "to" and "from"')
    expect(
      () => shallow(<Counter to={0} />)
    ).toThrowError('provide either "seconds" or "to" and "from"')
    expect(
      () => shallow(<Counter from={0} seconds={2} />)
    ).toThrowError('cannot use "to" and "from" with "seconds"')
    expect(
      () => shallow(<Counter to={0} seconds={2} />)
    ).toThrowError('cannot use "to" and "from" with "seconds"')
    expect(
      () => shallow(<Counter from={1} to={0} />)
    ).toThrowError('"to" must be bigger than "from"')
    expect(
      () => shallow(<Counter seconds={-1} />)
    ).toThrowError('"seconds" must be greater than or equal to zero')
    expect(
      () => shallow(<Counter seconds={0} minDigits={0} />)
    ).toThrowError('"minDigits" must be positive')
  })

  it('should initialize correctly when "to" and "from" are correct', function () {
    expect(
      () => shallow(<Counter from={0} to={1} />)
    ).not.toThrow()
  })

  it('should initialize correctly when "seconds" option is correct', function () {
    expect(
      () => shallow(<Counter seconds={2} />)
    ).not.toThrow()
  })

  it('should initialize correctly when "minDigits" option is correct', function () {
    expect(
      () => shallow(<Counter seconds={2} minDigits={1} />)
    ).not.toThrow()
  })
})

describe('rendering', function () {
  it('matches snapshot', function () {
    const component = shallow(<Counter from={0} to={1} />)
    const tree = shallowToJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should render a CounterSegment for each segment', function () {
    const component = shallow(<Counter from={0} to={1} />)
    expect(component.find(CounterSegment).length).toEqual(4)
  })
})

describe('state and props', function () {
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
})

describe('counting', function () {
  var component

  beforeEach(function () {
    jest.useFakeTimers()
    component = mount(<Counter from={0} to={10000} />)
    expect(component.state().digits.seconds).toBe(10)
    expect(setInterval.mock.calls.length).toBe(1)
  })

  it('starts to count when mounted', function () {
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(5000)
    expect(component.state().digits.seconds).toBe(5)
  })

  it('works with "seconds" prop', function () {
    component = mount(<Counter seconds={10} />)
    expect(component.state().digits.seconds).toBe(10)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(5000)
    expect(component.state().digits.seconds).toBe(5)
  })

  it('does not count when "frozen" is true', function () {
    component = mount(<Counter seconds={10} frozen />)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(10000)
    expect(component.state().digits.seconds).toBe(10)
  })

  it('stops to count when stopped', function () {
    jest.runTimersToTime(5000)
    expect(component.state().digits.seconds).toBe(5)

    component.instance().stop()

    jest.runTimersToTime(10000)
    expect(component.state().digits.seconds).toBe(5)
  })

  it('stops to count when reached zero', function () {
    jest.runTimersToTime(10000)
    expect(component.state().timeDiff).toBe(0)
    expect(component.state().digits.seconds).toBe(0)

    jest.runTimersToTime(10000)
    expect(component.state().timeDiff).toBe(0)
    expect(component.state().digits.seconds).toBe(0)
  })
})
