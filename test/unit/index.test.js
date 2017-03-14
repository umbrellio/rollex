import React from 'react'
import { shallow, mount } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import { Counter } from '../../src/'
import CounterSegment from '../../src/CounterSegment'
import CounterSegmentSeparator from '../../src/CounterSegmentSeparator'

describe('initialization', function () {
  it('throws an error when options are provided incorrectly', function () {
    const originalError = console.error
    console.error = () => {} // disable React PropTypes warnings

    expect(
      () => shallow(<Counter />)
    ).toThrowError('provide either "seconds" or "to"')
    expect(
      () => shallow(<Counter from={0} to={1} seconds={2} />)
    ).toThrowError('cannot use "to" and "from" with "seconds"')
    expect(
      () => shallow(<Counter from={0} />)
    ).toThrowError('provide either "seconds" or "to"')
    expect(
      () => shallow(<Counter from={0} seconds={2} />)
    ).toThrowError('cannot use "to" and "from" with "seconds"')
    expect(
      () => shallow(<Counter seconds={2} syncTime />)
    ).toThrowError('"syncTime" must be used with "to"')
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
    expect(
      () => shallow(<Counter seconds={0} minPeriod='sobaka' />)
    ).toThrowError('"minPeriod" must be one of: day, hour, minute, second')
    expect(
      () => shallow(<Counter seconds={0} maxPeriod='sobaka' />)
    ).toThrowError('"maxPeriod" must be one of: day, hour, minute, second')
    expect(
      () => shallow(<Counter seconds={0} radix={37} />)
    ).toThrowError('"radix" must be between 2 and 36')
    expect(
      () => shallow(<Counter seconds={0} digitWrapper={48} />)
    ).toThrowError('"digitWrapper" must be a function')
    expect(
      () => shallow(<Counter seconds={0} digitMap='111' />)
    ).toThrowError('"digitMap" must be an object')
    expect(
      () => shallow(<Counter to={0} direction='sobaka' />)
    ).toThrowError('"direction" must be either up or down')

    console.error = originalError
  })

  it('initializes when options are correct', function () {
    expect(
      () => shallow(<Counter to={0} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter from={0} to={1} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={2} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={2} minDigits={1} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={2} maxDigits={3} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={2} minPeriod='minute' />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={2} maxPeriod='hour' />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter from={0} to={1} syncTime />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={0} radix={12} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={0} digitWrapper={() => null} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={0} digitMap={{}} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter to={9} direction='up' />)
    ).not.toThrow()
  })
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
    const component = shallow(<Counter from={0} to={to} />)
    const counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digits).toEqual(['2', '0', '0'])
    expect(counterSegments.at(1).props().digits).toEqual(['0', '6'])
    expect(counterSegments.at(2).props().digits).toEqual(['3', '5'])
    expect(counterSegments.at(3).props().digits).toEqual(['5', '4'])
  })

  it('works with "up" direction', function () {
    const component = shallow(<Counter from={0} to={to} direction='up' />)
    const counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digits).toEqual(['0', '0'])
    expect(counterSegments.at(1).props().digits).toEqual(['0', '0'])
    expect(counterSegments.at(2).props().digits).toEqual(['0', '0'])
    expect(counterSegments.at(3).props().digits).toEqual(['0', '0'])
  })

  test('minDigits', function () {
    var component = shallow(<Counter from={0} to={to} minDigits={1} />)
    var counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digits).toEqual(['2', '0', '0'])
    expect(counterSegments.at(1).props().digits).toEqual(['6'])
    expect(counterSegments.at(2).props().digits).toEqual(['3', '5'])
    expect(counterSegments.at(3).props().digits).toEqual(['5', '4'])

    component = shallow(<Counter from={0} to={to} minDigits={3} />)
    counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digits).toEqual(['2', '0', '0'])
    expect(counterSegments.at(1).props().digits).toEqual(['0', '0', '6'])
    expect(counterSegments.at(2).props().digits).toEqual(['0', '3', '5'])
    expect(counterSegments.at(3).props().digits).toEqual(['0', '5', '4'])
  })

  test('maxDigits', function () {
    var component = shallow(<Counter from={0} to={to} maxDigits={1} />)
    var counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digits).toEqual(['9'])
    expect(counterSegments.at(1).props().digits).toEqual(['6'])
    expect(counterSegments.at(2).props().digits).toEqual(['9'])
    expect(counterSegments.at(3).props().digits).toEqual(['9'])

    component = shallow(<Counter from={0} to={to} maxDigits={2} />)
    counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digits).toEqual(['9', '9'])
    expect(counterSegments.at(1).props().digits).toEqual(['0', '6'])
    expect(counterSegments.at(2).props().digits).toEqual(['3', '5'])
    expect(counterSegments.at(3).props().digits).toEqual(['5', '4'])
  })

  test('minPeriod', function () {
    const component = shallow(<Counter from={0} to={to} minPeriod='minute' />)
    const counterSegments = component.find(CounterSegment)
    expect(counterSegments.length).toBe(3)
    expect(counterSegments.at(2).props().period).toBe('minutes')
    expect(counterSegments.at(2).props().digits).toEqual(['3', '5'])
  })

  test('maxPeriod', function () {
    var component = shallow(<Counter from={0} to={to} maxPeriod='hour' />)
    var counterSegments = component.find(CounterSegment)
    expect(counterSegments.length).toBe(3)
    expect(counterSegments.at(0).props().period).toBe('hours')
    expect(counterSegments.at(0).props().digits).toEqual(['4', '8', '0', '6'])

    var component = shallow(<Counter from={0} to={to} maxPeriod='minute' />)
    var counterSegments = component.find(CounterSegment)
    expect(counterSegments.length).toBe(2)
    expect(counterSegments.at(0).props().period).toBe('minutes')
    expect(counterSegments.at(0).props().digits).toEqual(['2', '8', '8', '3', '9', '5'])

    var component = shallow(<Counter from={0} to={to} maxPeriod='second' />)
    var counterSegments = component.find(CounterSegment)
    expect(counterSegments.length).toBe(1)
    expect(counterSegments.at(0).props().period).toBe('seconds')
    expect(counterSegments.at(0).props().digits).toEqual(['1', '7', '3', '0', '3', '7', '5', '4'])
  })

  test('radix', function () {
    var component = shallow(<Counter from={0} to={to} radix={12} />)
    var counterSegments = component.find(CounterSegment)

    expect(counterSegments.at(0).props().digits).toEqual(['1', '4', '8'])
    expect(counterSegments.at(1).props().digits).toEqual(['0', '6'])
    expect(counterSegments.at(2).props().digits).toEqual(['2', 'b'])
    expect(counterSegments.at(3).props().digits).toEqual(['4', '6'])
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

describe('state and props', function () {
  test('default state', function () {
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(1234)
    const to = 1234 +
      (1000 * 60 * 60 * 24 * 2) +
      (1000 * 60 * 60 * 6) +
      (1000 * 60 * 35) +
      (1000 * 54)
    const component = shallow(<Counter to={to} />)
    expect(component.state()).toEqual({
      timeDiff: to - 1234,
      minDigits: 2,
      startTime: 1234,
      from: 1234,
      initialTimeDiff: to - 1234,
      periods: ['days', 'hours', 'minutes', 'seconds'],
      cssClasses: 'rollex rollex-static',
      numbers: {
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
      minPeriod: 'second',
      maxPeriod: 'day',
      radix: 10,
      direction: 'down',
      frozen: false,
      easingFunction: null,
      easingDuration: 300,
      digitMap: {},
      digitWrapper: expect.any(Function)
    })
  })

  it('allows to set props', function () {
    const digitWrapper = (digit) => <div>{digit}</div>
    const component = mount(
      <Counter from={10} to={20} interval={897}
        minDigits={3} maxDigits={4}
        minPeriod='minute' maxPeriod='hour'
        syncTime radix={8} direction='up'
        easingFunction='myEasingFn' easingDuration={123}
        digitMap={{ '0': 'o' }} digitWrapper={digitWrapper}
        separator=':'
      />
    )
    expect(component.props()).toEqual({
      from: 10,
      to: 20,
      interval: 897,
      minDigits: 3,
      maxDigits: 4,
      minPeriod: 'minute',
      maxPeriod: 'hour',
      syncTime: true,
      easingFunction: 'myEasingFn',
      easingDuration: 123,
      radix: 8,
      frozen: false,
      direction: 'up',
      digitMap: { '0': 'o' },
      digitWrapper: digitWrapper,
      separator: ':'
    })
  })
})

describe('counting', function () {
  beforeEach(function () {
    jest.clearAllTimers()
    jest.useFakeTimers()
    delete (window.rollexIntervals)
    // FIXME: the following line is required. It shouldn't be. Something's wrong with global state.
    mount(<Counter seconds={10000} />)
  })

  it('starts to count when mounted', function () {
    const component = mount(<Counter from={0} to={10000} />)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(5000)
    expect(component.state().numbers.seconds).toBe(5)
  })

  it('works with "seconds" prop', function () {
    const component = mount(<Counter seconds={10} />)
    expect(component.state().numbers.seconds).toBe(10)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(5000)
    expect(component.state().numbers.seconds).toBe(5)
  })

  it('works without "from" prop', function () {
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(78781234)
    const to = new Date().getTime() + 10000
    const component = mount(<Counter to={to} />)
    expect(component.state().timeDiff).toBe(10000)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(5000)
  })

  it('does not count when "frozen" is true', function () {
    const component = mount(<Counter seconds={10} frozen />)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(10000)
    expect(component.state().numbers.seconds).toBe(10)
  })

  it('stops to count when stopped', function () {
    const component = mount(<Counter from={0} to={10000} />)
    jest.runTimersToTime(5000)
    expect(component.state().numbers.seconds).toBe(5)

    component.instance().stop()

    jest.runTimersToTime(10000)
    expect(component.state().numbers.seconds).toBe(5)
  })

  it('stops to count when reached zero', function () {
    const component = mount(<Counter from={0} to={10000} />)
    jest.runTimersToTime(10000)
    expect(component.state().timeDiff).toBe(0)
    expect(component.state().numbers.seconds).toBe(0)

    jest.runTimersToTime(10000)
    expect(component.state().timeDiff).toBe(0)
    expect(component.state().numbers.seconds).toBe(0)
  })

  it('stops to count if frozen prop is updated to true', function () {
    const component = mount(<Counter from={0} to={10000} />)
    component.instance().stop = jest.genMockFunction()
    component.instance().forceUpdate()
    component.setProps({
      frozen: true
    }, () => expect(component.instance().stop.mock.calls.length).toBe(1))

    const frozenComponent = mount(<Counter from={0} to={10000} frozen />)
    frozenComponent.instance().stop = jest.genMockFunction()
    frozenComponent.instance().forceUpdate()
    frozenComponent.setProps({
      frozen: true
    }, () => expect(frozenComponent.instance().stop.mock.calls.length).toBe(0))
  })

  it('starts to count if frozen prop is updated to false', function () {
    const component = mount(<Counter from={0} to={10000} />)
    component.instance().start = jest.genMockFunction()
    component.instance().forceUpdate()
    component.setProps({
      frozen: false
    }, () => expect(component.instance().start.mock.calls.length).toBe(0))

    const frozenComponent = mount(<Counter from={0} to={10000} frozen />)
    frozenComponent.instance().start = jest.genMockFunction()
    frozenComponent.instance().forceUpdate()
    frozenComponent.setProps({
      frozen: false
    }, () => expect(frozenComponent.instance().start.mock.calls.length).toBe(1))
  })

  it('syncs time when syncTime is set', function () {
    const component = mount(<Counter from={0} to={10000} syncTime />)
    const newDate = component.state().startTime + 7000
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(newDate)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(3000)
  })

  it('works with "up" direction', function () {
    const component = mount(<Counter seconds={10} direction='up' />)
    expect(component.state().timeDiff).toBe(10000)
    expect(component.state().numbers.seconds).toBe(0)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(5000)
    expect(component.state().numbers.seconds).toBe(5)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(0)
    expect(component.state().numbers.seconds).toBe(10)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(0)
    expect(component.state().numbers.seconds).toBe(10)
  })
})

describe('CSS classes', function () {
  it('applies rollex and rollex-static classes to static counters', function () {
    const component = shallow(<Counter seconds={0} />)
    expect(component.find('.rollex').at(0).hasClass('rollex-static')).toBe(true)
  })

  it('applies rollex and rollex-animated classes to animated counters', function () {
    const component = shallow(<Counter seconds={0} easingFunction='ease-in' />)
    expect(component.find('.rollex').at(0).hasClass('rollex-animated')).toBe(true)
  })

  it('applies rollex-frozen class to frozen counters', function () {
    const staticComponent = shallow(<Counter seconds={0} frozen />)
    expect(staticComponent.find('.rollex').at(0).hasClass('rollex-frozen')).toBe(true)
    const animatedComponent = shallow(<Counter seconds={0} easingFunction='ease-in' frozen />)
    expect(animatedComponent.find('.rollex').at(0).hasClass('rollex-frozen')).toBe(true)
  })
})
