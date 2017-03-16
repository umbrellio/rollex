import React from 'react'
import { mount } from 'enzyme'
import Counter from '../../../src/components/Counter'

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
