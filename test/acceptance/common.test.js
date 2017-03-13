import React from 'react'
import Counter from '../../src/'
import { render } from './support/helpers'

// We want to get '01234509' on the display (for default props)
const seconds = (60 * 60 * 24 * 1) + // 1 day
                (60 * 60 * 23) +     // 23 hours
                (60 * 45) +          // 45 minutes
                (9)                  // 9 seconds

describe('min/max digits', function () {
  it('adds zeros to supply desired minimum number of digits', function () {
    const component = render(<Counter seconds={seconds} minDigits={3} />)
    expect(component).toDisplayDigits('001023045009')
  })

  it('shows minimal possible number of digits when minDigits is small', function () {
    const component = render(<Counter seconds={seconds} minDigits={1} />)
    expect(component).toDisplayDigits('123459')
  })

  it('caps numbers at 9 when maxDigits is small', function () {
    const component = render(<Counter seconds={seconds} maxDigits={1} />)
    expect(component).toDisplayDigits('1999')
  })
})

describe('min/max period', function () {
  it('does not show periods that are smaller than minPeriod', function () {
    const component = render(<Counter seconds={seconds} minPeriod='minute' />)
    expect(component).toDisplayDigits('012345')
    expect(component).toHaveLabels(['days', 'hours', 'minutes'])
  })

  it('does not show periods that are bigger than maxPeriod', function () {
    const component = render(<Counter seconds={seconds} maxPeriod='hour' />)
    expect(component).toHaveLabels(['hours', 'minutes', 'seconds'])
  })

  it('shows days in hours if maxPeriod is "hours"', function () {
    const component = render(<Counter seconds={seconds} maxPeriod='hour' />)
    expect(component).toDisplayDigits('474509')
  })
})

describe('custom labels', function () {
  it('works with objects', function () {
    const labels = { days: 'DD', hours: 'HH', minutes: 'MM', seconds: 'SS' }
    const component = render(<Counter seconds={10} labels={labels} />)
    expect(component).toHaveLabels(['DD', 'HH', 'MM', 'SS'])
  })

  it('works with functions', function () {
    const labels = (label) => label.toUpperCase()
    const component = render(<Counter seconds={10} labels={labels} />)
    expect(component).toHaveLabels(['DAYS', 'HOURS', 'MINUTES', 'SECONDS'])
  })
})

describe('separators', function () {
  it('works with jsx', function () {
    const separator = <a href='#'>l0l</a>
    const component = render(<Counter seconds={10} separator={separator} />)
    expect(component).toHaveSeparators(['l0l', 'l0l', 'l0l'])
  })

  it('works with numbers', function () {
    const separator = 420
    const component = render(<Counter seconds={10} separator={separator} />)
    expect(component).toHaveSeparators(['420', '420', '420'])
  })

  it('works with strings', function () {
    const separator = 'ur mum'
    const component = render(<Counter seconds={10} separator={separator} />)
    expect(component).toHaveSeparators(['ur mum', 'ur mum', 'ur mum'])
  })
})
