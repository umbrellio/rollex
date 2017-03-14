import React from 'react'
import Counter from '../../src/components/Counter'
import { render, renderTenSecondCounter } from './support/helpers'

describe('ticking', function () {
  it('changes as time passes', function () {
    const component = renderTenSecondCounter()
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('09')
    jasmine.clock().tick(3000)
    expect(component).toDisplayDigits('06')
  })

  it('stops when reaches zero', function () {
    const component = renderTenSecondCounter()
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('00')
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('00')
  })
})

describe('ticking in up direction', function () {
  it('changes as time passes', function () {
    const component = renderTenSecondCounter({ direction: 'up' })
    expect(component).toDisplayDigits('00')
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('01')
    jasmine.clock().tick(3000)
    expect(component).toDisplayDigits('04')
  })

  it('stops when reaches target', function () {
    const component = renderTenSecondCounter({ direction: 'up' })
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')
  })
})

describe('freezing', function () {
  it('does not tick when frozen', function () {
    const component = renderTenSecondCounter({ frozen: true })
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')
  })

  it('stops when set to frozen', function () {
    const component = renderTenSecondCounter()
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('09')

    renderTenSecondCounter({ frozen: true })
    jasmine.clock().tick(2000)
    expect(component).toDisplayDigits('09')
  })

  it('starts when unfrozen', function () {
    const component = renderTenSecondCounter({ frozen: true })
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')

    renderTenSecondCounter({ frozen: false })
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('09')
  })
})

describe('custom interval', function () {
  it('updates every two seconds if interval is set to 2000', function () {
    const component = renderTenSecondCounter({ interval: 2000 })
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('08')
  })

  it('updates every one second if interval is set to 500', function () {
    const component = renderTenSecondCounter({ interval: 500 })
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

    const component = render(<Counter to={to} maxPeriod='seconds' syncTime />)
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
    const component = renderTenSecondCounter({ digitMap: digitMap })
    expect(component).toDisplayDigits('io')
  })

  it('processes digits according to digit wrapper', function () {
    const digitWrapper = (digit) => <span>[{digit}]</span>
    const component = renderTenSecondCounter({ digitWrapper: digitWrapper })
    expect(component).toDisplayDigits('[1][0]')
  })
})

describe('radix', function () {
  it('displays numbers in given radix', function () {
    const component = renderTenSecondCounter({ radix: 8 })
    expect(component).toDisplayDigits('12')
  })
})
