import React from 'react'
import { Counter } from '../../src/'
import { render, renderAnimatedTenSecondCounter } from './support/helpers'

// Unmocked setTimeout
const timeout = setTimeout

describe('ticking', function () {
  it('changes as time passes', function () {
    const component = renderAnimatedTenSecondCounter()
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('09')
    jasmine.clock().tick(3000)
    expect(component).toDisplayDigits('06')
  })

  it('stops when reaches zero', function () {
    const component = renderAnimatedTenSecondCounter()
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('00')
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('00')
  })

  it('changes with non-zero easing time', function (done) {
    if (process.env.WATCH) {
      pending(
        `This spec in too inconsistent for the watch mode and thus is disabled.
        Use single run mode to run it.`
      )
    }

    const component = render(
      <Counter seconds={10} maxPeriod='second' easingFunction='ease-in' easingDuration={50} />
    )
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(5000)
    timeout(function () {
      expect(component).toDisplayDigits('05')
      done()
    }, 100) // extra 50 ms for consistency
  })
})

describe('ticking in up direction', function () {
  it('changes as time passes', function () {
    const component = renderAnimatedTenSecondCounter({ direction: 'up' })
    expect(component).toDisplayDigits('00')
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('01')
    jasmine.clock().tick(3000)
    expect(component).toDisplayDigits('04')
  })

  it('stops when reaches target', function () {
    const component = renderAnimatedTenSecondCounter({ direction: 'up' })
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')
  })
})

describe('freezing', function () {
  it('does not tick when frozen', function () {
    const component = renderAnimatedTenSecondCounter({ frozen: true })
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')
  })

  it('stops when set to frozen', function () {
    const component = renderAnimatedTenSecondCounter()
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('09')

    renderAnimatedTenSecondCounter({ frozen: true })
    jasmine.clock().tick(2000)
    expect(component).toDisplayDigits('09')
  })

  it('starts when unfrozen', function () {
    const component = renderAnimatedTenSecondCounter({ frozen: true })
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')

    renderAnimatedTenSecondCounter({ frozen: false })
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('09')
  })
})

describe('custom interval', function () {
  it('updates every two seconds if interval is set to 2000', function () {
    const component = renderAnimatedTenSecondCounter({ interval: 2000 })
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('08')
  })

  it('updates every one second if interval is set to 500', function () {
    const component = renderAnimatedTenSecondCounter({ interval: 500 })
    jasmine.clock().tick(500)
    expect(component).toDisplayDigits('09')
    jasmine.clock().tick(500)
    expect(component).toDisplayDigits('09')
    jasmine.clock().tick(500)
    expect(component).toDisplayDigits('08')
  })
})

describe('time synchronization', function () {
  it('catches up with current time on each tick', function () {
    const baseTime = new Date(2017, 1, 1).getTime()
    const to = baseTime + 10000
    var dateSpy = spyOn(Date.prototype, 'getTime').and.returnValue(baseTime)

    const component = render(
      <Counter to={to} maxPeriod='second' easingFunction='ease-in' easingDuration={0} syncTime />
    )
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('10')

    dateSpy.and.returnValue(baseTime + 7000)
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('03')
  })
})

describe('digit map and digit wrapper', function () {
  it('displays digits from the map', function () {
    const digitMap = { '0': 'o', '1': 'i' }
    const component = renderAnimatedTenSecondCounter({ digitMap: digitMap })
    expect(component).toDisplayDigits('io')
  })

  it('processes digits according to digit wrapper', function () {
    const digitWrapper = (digit) => <span>[{digit}]</span>
    const component = renderAnimatedTenSecondCounter({ digitWrapper: digitWrapper })
    expect(component).toDisplayDigits('[1][0]')
  })
})

describe('radix', function () {
  it('displays numbers in given radix', function () {
    const component = renderAnimatedTenSecondCounter({ radix: 8 })
    expect(component).toDisplayDigits('12')
  })
})
