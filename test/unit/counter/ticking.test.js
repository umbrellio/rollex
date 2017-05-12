import React from 'react'
import { mount } from 'enzyme'
import Counter from '../../../src/components/Counter'

/**
 * Stores component instance. Useful for unmounting the component after each test.
 */
let component

describe('counting', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    component.unmount()
    jest.clearAllTimers()
  })

  it('starts to count when mounted', () => {
    component = mount(<Counter from={0} to={10000} />)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(5000)
    expect(component.state().numbers.seconds).toBe(5)
  })

  it('works with "seconds" prop', () => {
    component = mount(<Counter seconds={10} />)
    expect(component.state().numbers.seconds).toBe(10)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(5000)
    expect(component.state().numbers.seconds).toBe(5)
  })

  it('works without "from" prop', () => {
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(78781234)
    const to = new Date().getTime() + 10000
    component = mount(<Counter to={to} />)
    expect(component.state().timeDiff).toBe(10000)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(5000)
  })

  it('stops to count when stopped', () => {
    component = mount(<Counter from={0} to={10000} />)
    jest.runTimersToTime(5000)
    expect(component.state().numbers.seconds).toBe(5)

    component.instance().stop()

    jest.runTimersToTime(10000)
    expect(component.state().numbers.seconds).toBe(5)
  })

  it('stops to count when reached zero', () => {
    component = mount(<Counter from={0} to={10000} />)
    jest.runTimersToTime(10000)
    expect(component.state().timeDiff).toBe(0)
    expect(component.state().numbers.seconds).toBe(0)

    jest.runTimersToTime(10000)
    expect(component.state().timeDiff).toBe(0)
    expect(component.state().numbers.seconds).toBe(0)
  })

  it('syncs time when syncTime is set', () => {
    component = mount(<Counter from={0} to={10000} syncTime />)
    const newDate = component.state().startTime + 7000
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(newDate)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(3000)
  })

  it('works with "up" direction', () => {
    component = mount(<Counter seconds={10} direction='up' />)
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

  describe('frozen prop', () => {
    it('does not count when "frozen" is true', () => {
      component = mount(<Counter seconds={10} frozen />)
      jest.runTimersToTime(5000)
      expect(component.state().timeDiff).toBe(10000)
      expect(component.state().numbers.seconds).toBe(10)
    })

    it('stops to count if frozen prop is updated to true', () => {
      component = mount(<Counter from={0} to={10000} />)
      component.instance().stop = jest.genMockFunction()
      component.instance().forceUpdate()
      component.setProps(
        {
          frozen: true,
        },
        () => expect(component.instance().stop.mock.calls.length).toBe(1)
      )
    })

    it('does nothing when component is already frozen', () => {
      component = mount(<Counter from={0} to={10000} frozen />)
      component.instance().stop = jest.genMockFunction()
      component.instance().forceUpdate()
      component.setProps(
        {
          frozen: true,
        },
        () => expect(component.instance().stop.mock.calls.length).toBe(0)
      )
    })

    it('starts to count if frozen prop is updated to false', () => {
      component = mount(<Counter from={0} to={10000} />)
      component.instance().start = jest.genMockFunction()
      component.instance().forceUpdate()
      component.setProps(
        {
          frozen: false,
        },
        () => expect(component.instance().start.mock.calls.length).toBe(0)
      )
    })

    it('does nothing when component is already not frozen', () => {
      component = mount(<Counter from={0} to={10000} frozen />)
      component.instance().start = jest.genMockFunction()
      component.instance().forceUpdate()
      component.setProps(
        {
          frozen: false,
        },
        () => expect(component.instance().start.mock.calls.length).toBe(1)
      )
    })
  })
})
