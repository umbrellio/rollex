import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import Counter from '../../../src/components/Counter'
import CounterSegment from '../../../src/components/CounterSegment'
import CounterSegmentSeparator from '../../../src/components/CounterSegmentSeparator'
import { toHaveDigits } from '../support/matchers'

beforeAll(function () {
  expect.extend({ toHaveDigits })
})

describe('rendering', function () {
  const to =
    (1000 * 60 * 60 * 24 * 200) +
    (1000 * 60 * 60 * 6) +
    (1000 * 60 * 35) +
    (1000 * 54)

  it('matches snapshot', function () {
    const component = shallow(<Counter from={0} to={1} />)
    const tree = shallowToJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders a CounterSegment for each segment', function () {
    const component = shallow(<Counter from={0} to={1} />)
    expect(component.find(CounterSegment).length).toEqual(4)
  })

  it('passes digits correctly', function () {
    expect(<Counter from={0} to={to} />)
      .toHaveDigits([
        ['9', '9'],
        ['0', '6'],
        ['3', '5'],
        ['5', '4']
      ])
  })

  describe('renders zeros when time diff is negative', function () {
    test('from and to', function () {
      const component = <Counter from={1000} to={0} />
      expect(component)
        .toHaveDigits([
          ['0', '0'],
          ['0', '0'],
          ['0', '0'],
          ['0', '0']
        ])
    })

    test('seconds', function () {
      const component = <Counter seconds={-10000} />
      expect(component)
        .toHaveDigits([
          ['0', '0'],
          ['0', '0'],
          ['0', '0'],
          ['0', '0']
        ])
    })
  })

  it('works with "up" direction', function () {
    expect(<Counter from={0} to={to} direction='up' />)
      .toHaveDigits([
        ['0', '0'],
        ['0', '0'],
        ['0', '0'],
        ['0', '0']
      ])
  })

  test('minPeriod', function () {
    expect(<Counter from={0} to={to} minPeriod='minutes' />)
      .toHaveDigits([
        ['9', '9'],
        ['0', '6'],
        ['3', '5']
      ])
  })

  test('maxPeriod', function () {
    var component = shallow(<Counter from={0} to={to} maxPeriod='hours' digits={0} />)
    var counterSegments = component.find(CounterSegment)
    expect(counterSegments.length).toBe(3)
    expect(counterSegments.at(0).props().period).toBe('hours')
    expect(counterSegments.at(0).props().digits).toEqual(['4', '8', '0', '6'])

    component = shallow(<Counter from={0} to={to} maxPeriod='minutes' digits={0} />)
    counterSegments = component.find(CounterSegment)
    expect(counterSegments.length).toBe(2)
    expect(counterSegments.at(0).props().period).toBe('minutes')
    expect(counterSegments.at(0).props().digits).toEqual(['2', '8', '8', '3', '9', '5'])

    component = shallow(<Counter from={0} to={to} maxPeriod='seconds' digits={0} />)
    counterSegments = component.find(CounterSegment)
    expect(counterSegments.length).toBe(1)
    expect(counterSegments.at(0).props().period).toBe('seconds')
    expect(counterSegments.at(0).props().digits).toEqual(['1', '7', '3', '0', '3', '7', '5', '4'])
  })

  test('radix', function () {
    expect(<Counter from={0} to={to} radix={12} />)
      .toHaveDigits([
        ['11', '11'],
        ['0', '6'],
        ['2', 'b'],
        ['4', '6']
      ])
  })

  it('passes digitWrapper to segments', function () {
    const digitWrapper = (digit) => digit + '0'
    const component = shallow(<Counter from={0} to={to} digitWrapper={digitWrapper} />)
    const counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digitWrapper).toEqual(digitWrapper)
    expect(counterSegments.at(1).props().digitWrapper).toEqual(digitWrapper)
    expect(counterSegments.at(2).props().digitWrapper).toEqual(digitWrapper)
    expect(counterSegments.at(3).props().digitWrapper).toEqual(digitWrapper)
  })

  it('passes digitMap to segments', function () {
    const digitMap = { '0': 'o' }
    const component = shallow(<Counter from={0} to={to} digitMap={digitMap} />)
    const counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digitMap).toEqual(digitMap)
    expect(counterSegments.at(1).props().digitMap).toEqual(digitMap)
    expect(counterSegments.at(2).props().digitMap).toEqual(digitMap)
    expect(counterSegments.at(3).props().digitMap).toEqual(digitMap)
  })

  describe('segment labels', function () {
    it('passes default labels', function () {
      const component = shallow(<Counter to={1} />)
      const counterSegments = component.find(CounterSegment)
      expect(counterSegments.at(0).props().label).toEqual('days')
      expect(counterSegments.at(1).props().label).toEqual('hours')
      expect(counterSegments.at(2).props().label).toEqual('minutes')
      expect(counterSegments.at(3).props().label).toEqual('seconds')
    })

    it('passes labels when given a map', function () {
      const labelMap = {
        days: 'DD',
        hours: 'HH',
        minutes: 'MM',
        seconds: 'SS'
      }
      const component = shallow(<Counter to={1} labels={labelMap} />)
      const segments = component.find(CounterSegment)
      expect(segments.at(0).props().label).toEqual('DD')
      expect(segments.at(1).props().label).toEqual('HH')
      expect(segments.at(2).props().label).toEqual('MM')
      expect(segments.at(3).props().label).toEqual('SS')
    })

    it('passes labels when given a function', function () {
      const labelFunc = function (period, number) {
        if (number % 10 === 1) {
          return period.slice(0, -1)
        } else {
          return period
        }
      }
      const component = shallow(<Counter seconds={61} labels={labelFunc} />)
      const segments = component.find(CounterSegment)
      expect(segments.at(0).props().label).toEqual('days')
      expect(segments.at(1).props().label).toEqual('hours')
      expect(segments.at(2).props().label).toEqual('minute')
      expect(segments.at(3).props().label).toEqual('second')
    })
  })

  test('separator', function () {
    const component = shallow(<Counter seconds={10} separator=':' />)
    const separators = component.find(CounterSegmentSeparator)
    expect(separators.at(0).props().content).toEqual(':')
    expect(separators.at(1).props().content).toEqual(':')
    expect(separators.at(2).props().content).toEqual(':')
    expect(separators.at(3).props().content).toEqual(undefined)
  })
})
