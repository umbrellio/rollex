import React from 'react'
import Counter from '../../src/components/Counter'
import { render, renderAnimatedTenSecondCounter } from './support/helpers'

// Unmocked setTimeout
const timeout = setTimeout

describe('ticking', () => {
  it('changes as time passes', () => {
    const component = renderAnimatedTenSecondCounter()
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('09')
    jasmine.clock().tick(3000)
    expect(component).toDisplayDigits('06')
  })

  it('stops when reaches zero', () => {
    const component = renderAnimatedTenSecondCounter()
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('00')
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('00')
  })

  it('changes with non-zero easing time', done => {
    if (process.env.WATCH) {
      pending(
        `This spec in too inconsistent for the watch mode and thus is disabled.
        Use single run mode to run it.`
      )
    }

    const component = render(
      <Counter
        seconds={10}
        maxPeriod='seconds'
        easingFunction='ease-in'
        easingDuration={50}
      />
    )
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(5000)
    timeout(() => {
      expect(component).toDisplayDigits('05')
      done()
    }, 350) // extra 300 ms for consistency
  })
})

describe('ticking in up direction', () => {
  it('changes as time passes', () => {
    const component = renderAnimatedTenSecondCounter({ direction: 'up' })
    expect(component).toDisplayDigits('00')
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('01')
    jasmine.clock().tick(3000)
    expect(component).toDisplayDigits('04')
  })

  it('stops when reaches target', () => {
    const component = renderAnimatedTenSecondCounter({ direction: 'up' })
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')
  })
})

describe('freezing', () => {
  it('does not tick when frozen', () => {
    const component = renderAnimatedTenSecondCounter({ frozen: true })
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')
  })

  it('stops when set to frozen', () => {
    const component = renderAnimatedTenSecondCounter()
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('09')

    renderAnimatedTenSecondCounter({ frozen: true })
    jasmine.clock().tick(2000)
    expect(component).toDisplayDigits('09')
  })

  it('starts when unfrozen', () => {
    const component = renderAnimatedTenSecondCounter({ frozen: true })
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')

    renderAnimatedTenSecondCounter({ frozen: false })
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('09')
  })
})

describe('custom interval', () => {
  it('updates every two seconds if interval is set to 2000', () => {
    const component = renderAnimatedTenSecondCounter({ interval: 2000 })
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('08')
  })

  it('updates every one second if interval is set to 500', () => {
    const component = renderAnimatedTenSecondCounter({ interval: 500 })
    jasmine.clock().tick(500)
    expect(component).toDisplayDigits('09')
    jasmine.clock().tick(500)
    expect(component).toDisplayDigits('09')
    jasmine.clock().tick(500)
    expect(component).toDisplayDigits('08')
  })
})

describe('time synchronization', () => {
  it('catches up with current time on each tick', () => {
    const baseTime = new Date(2017, 1, 1).getTime()
    const to = baseTime + 10000
    const dateSpy = spyOn(Date.prototype, 'getTime').and.returnValue(baseTime)

    const component = render(
      <Counter
        to={to}
        maxPeriod='seconds'
        easingFunction='ease-in'
        easingDuration={0}
        syncTime
      />
    )
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('10')

    dateSpy.and.returnValue(baseTime + 7000)
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('03')
  })
})

describe('digit map and digit wrapper', () => {
  it('displays digits from the map', () => {
    const digitMap = { 0: 'o', 1: 'i' }
    const component = renderAnimatedTenSecondCounter({ digitMap })
    expect(component).toDisplayDigits('io')
  })

  it('processes digits according to digit wrapper', () => {
    const digitWrapper = digit => <span>[{digit}]</span>
    const component = renderAnimatedTenSecondCounter({
      digitWrapper,
    })
    expect(component).toDisplayDigits('[1][0]')
  })
})

describe('radix', () => {
  it('displays numbers in given radix', () => {
    const component = renderAnimatedTenSecondCounter({ radix: 8 })
    expect(component).toDisplayDigits('12')
  })
})
