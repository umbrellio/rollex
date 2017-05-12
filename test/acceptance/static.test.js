import React from 'react'
import Counter from '../../src/components/Counter'
import { render, renderTenSecondCounter } from './support/helpers'

describe('ticking', () => {
  it('changes as time passes', () => {
    const component = renderTenSecondCounter()
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('09')
    jasmine.clock().tick(3000)
    expect(component).toDisplayDigits('06')
  })

  it('stops when reaches zero', () => {
    const component = renderTenSecondCounter()
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('00')
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('00')
  })
})

describe('ticking in up direction', () => {
  it('changes as time passes', () => {
    const component = renderTenSecondCounter({ direction: 'up' })
    expect(component).toDisplayDigits('00')
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('01')
    jasmine.clock().tick(3000)
    expect(component).toDisplayDigits('04')
  })

  it('stops when reaches target', () => {
    const component = renderTenSecondCounter({ direction: 'up' })
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')
  })
})

describe('freezing', () => {
  it('does not tick when frozen', () => {
    const component = renderTenSecondCounter({ frozen: true })
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')
  })

  it('stops when set to frozen', () => {
    const component = renderTenSecondCounter()
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('09')

    renderTenSecondCounter({ frozen: true })
    jasmine.clock().tick(2000)
    expect(component).toDisplayDigits('09')
  })

  it('starts when unfrozen', () => {
    const component = renderTenSecondCounter({ frozen: true })
    jasmine.clock().tick(10000)
    expect(component).toDisplayDigits('10')

    renderTenSecondCounter({ frozen: false })
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('09')
  })
})

describe('custom interval', () => {
  it('updates every two seconds if interval is set to 2000', () => {
    const component = renderTenSecondCounter({ interval: 2000 })
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('10')
    jasmine.clock().tick(1000)
    expect(component).toDisplayDigits('08')
  })

  it('updates every one second if interval is set to 500', () => {
    const component = renderTenSecondCounter({ interval: 500 })
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

    const component = render(<Counter to={to} maxPeriod='seconds' syncTime />)
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
    const component = renderTenSecondCounter({ digitMap })
    expect(component).toDisplayDigits('io')
  })

  it('processes digits according to digit wrapper', () => {
    const digitWrapper = digit => <span>[{digit}]</span>
    const component = renderTenSecondCounter({ digitWrapper })
    expect(component).toDisplayDigits('[1][0]')
  })
})

describe('radix', () => {
  it('displays numbers in given radix', () => {
    const component = renderTenSecondCounter({ radix: 8 })
    expect(component).toDisplayDigits('12')
  })
})
