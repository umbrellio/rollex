import React from 'react'
import Counter from '../../src/components/Counter'
import { render } from './support/helpers'

// We want to get '01234509' on the display (for default props)
const seconds =
  60 * 60 * 24 * 1 + // 1 day
  60 * 60 * 23 + // 23 hours
  60 * 45 + // 45 minutes
  9 // 9 seconds

describe('min/max digits', () => {
  it('adds zeros to supply desired minimum number of digits', () => {
    const component = render(<Counter seconds={seconds} digits={3} />)
    expect(component).toDisplayDigits('001023045009')
  })

  it('caps numbers at 9 when "digits" is small', () => {
    const component = render(<Counter seconds={seconds} digits={1} />)
    expect(component).toDisplayDigits('1999')
  })
})

describe('min/max period', () => {
  it('does not show periods that are smaller than minPeriod', () => {
    const component = render(<Counter seconds={seconds} minPeriod='minutes' />)
    expect(component).toDisplayDigits('012345')
    expect(component).toHaveLabels(['days', 'hours', 'minutes'])
  })

  it('does not show periods that are bigger than maxPeriod', () => {
    const component = render(<Counter seconds={seconds} maxPeriod='hours' />)
    expect(component).toHaveLabels(['hours', 'minutes', 'seconds'])
  })

  it('shows days in hours if maxPeriod is "hours"', () => {
    const component = render(<Counter seconds={seconds} maxPeriod='hours' />)
    expect(component).toDisplayDigits('474509')
  })
})

describe('custom labels', () => {
  it('works with objects', () => {
    const labels = { days: 'DD', hours: 'HH', minutes: 'MM', seconds: 'SS' }
    const component = render(<Counter seconds={10} labels={labels} />)
    expect(component).toHaveLabels(['DD', 'HH', 'MM', 'SS'])
  })

  it('works with functions', () => {
    const labels = label => label.toUpperCase()
    const component = render(<Counter seconds={10} labels={labels} />)
    expect(component).toHaveLabels(['DAYS', 'HOURS', 'MINUTES', 'SECONDS'])
  })
})

describe('separators', () => {
  it('works with jsx', () => {
    const separator = <a href='#'>l0l</a>
    const component = render(<Counter seconds={10} separator={separator} />)
    expect(component).toHaveSeparators(['l0l', 'l0l', 'l0l'])
  })

  it('works with numbers', () => {
    const separator = 420
    const component = render(<Counter seconds={10} separator={separator} />)
    expect(component).toHaveSeparators(['420', '420', '420'])
  })

  it('works with strings', () => {
    const separator = 'ur mum'
    const component = render(<Counter seconds={10} separator={separator} />)
    expect(component).toHaveSeparators(['ur mum', 'ur mum', 'ur mum'])
  })
})
