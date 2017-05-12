import React from 'react'
import { shallow, mount } from 'enzyme'
import Counter from '../../../src/components/Counter'

describe('state and props', () => {
  test('default state', () => {
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(1234)
    const to =
      1234 +
      1000 * 60 * 60 * 24 * 2 +
      1000 * 60 * 60 * 6 +
      1000 * 60 * 35 +
      1000 * 54
    const component = shallow(<Counter to={to} />)
    expect(component.state()).toEqual({
      timeDiff: to - 1234,
      digits: {
        days: 2,
        hours: 2,
        minutes: 2,
        seconds: 2,
      },
      startTime: 1234,
      from: 1234,
      initialTimeDiff: to - 1234,
      periods: ['days', 'hours', 'minutes', 'seconds'],
      numbers: {
        days: 2,
        hours: 6,
        minutes: 35,
        seconds: 54,
      },
    })
  })

  test('default props', () => {
    const component = mount(<Counter from={0} to={1} />)
    expect(component.props()).toEqual({
      from: 0,
      to: 1,
      interval: 1000,
      minPeriod: 'seconds',
      maxPeriod: 'days',
      radix: 10,
      direction: 'down',
      frozen: false,
      easingFunction: null,
      easingDuration: 300,
      digitMap: {},
      digitWrapper: expect.any(Function),
    })
  })

  it('allows to set props', () => {
    const digitWrapper = digit => <div>{digit}</div>
    const component = mount(
      <Counter
        from={10}
        to={20}
        interval={897}
        digits={3}
        minPeriod='minutes'
        maxPeriod='hours'
        syncTime
        radix={8}
        direction='up'
        easingFunction='myEasingFn'
        easingDuration={123}
        digitMap={{ 0: 'o' }}
        digitWrapper={digitWrapper}
        separator=':'
      />
    )
    expect(component.props()).toEqual({
      from: 10,
      to: 20,
      interval: 897,
      digits: 3,
      minPeriod: 'minutes',
      maxPeriod: 'hours',
      syncTime: true,
      easingFunction: 'myEasingFn',
      easingDuration: 123,
      radix: 8,
      frozen: false,
      direction: 'up',
      digitMap: { 0: 'o' },
      digitWrapper,
      separator: ':',
    })
  })

  describe('sets timeDiff to zero when its negative', () => {
    test('from and to', () => {
      const component = mount(<Counter from={10000} to={0} />)
      expect(component.state()).toMatchObject({
        timeDiff: 0,
        initialTimeDiff: 0,
      })
    })

    test('seconds', () => {
      const component = mount(<Counter seconds={-10000} />)
      expect(component.state()).toMatchObject({
        timeDiff: 0,
        initialTimeDiff: 0,
      })
    })
  })
})
