import React from 'react'
import { mount } from 'enzyme'
import Counter from '../../../../src/components/Counter'
import CounterSegment from '../../../../src/components/CounterSegment'
import { toHaveDigits } from '../../support/matchers'

const to =
  (1000 * 60 * 60 * 24 * 200) +
  (1000 * 60 * 60 * 6) +
  (1000 * 60 * 35) +
  (1000 * 54)

beforeAll(function () {
  expect.extend({ toHaveDigits })
})

describe('defaults', function () {
  test('radix = 10', function () {
    expect(<Counter from={0} to={to} />)
      .toHaveDigits([
        ['9', '9'],
        ['0', '6'],
        ['3', '5'],
        ['5', '4']
      ])
  })

  test('radix = 24', function () {
    // In radix 24 "23" is a single-digit number
    expect(<Counter from={0} to={to} radix={24} />)
      .toHaveDigits([
        ['8', '8'],
        ['6'],
        ['1', 'b'],
        ['2', '6']
      ])
  })

  test('radix = 2', function () {
    expect(<Counter from={0} to={to} radix={2} />)
      .toHaveDigits([
        '11'.split(''),
        '00110'.split(''),
        '100011'.split(''),
        '110110'.split('')
      ])
  })

  describe('limits max period by default', function () {
    test('days', function () {
      expect(<Counter from={0} to={to} minPeriod='days' />)
        .toHaveDigits([['9', '9']])
    })

    test('days and direction is "up"', function () {
      expect(<Counter from={0} to={to} minPeriod='days' direction='up' />)
        .toHaveDigits([['0', '0']])
    })

    test('hours', function () {
      expect(<Counter from={0} to={to} minPeriod='hours' maxPeriod='hours' />)
        .toHaveDigits([['9', '9']])
    })

    test('hours and direction is "up"', function () {
      expect(<Counter from={0} to={to} minPeriod='hours' maxPeriod='hours' direction='up' />)
        .toHaveDigits([['0', '0']])
    })
  })
})

describe('normalization', function () {
  describe('digits = 0', function () {
    it('removes limit from maxPeriod', function () {
      expect(<Counter from={0} to={to} digits={0} />)
        .toHaveDigits([
          ['2', '0', '0'],
          ['0', '6'],
          ['3', '5'],
          ['5', '4']
        ])
    })

    it('removes limit from maxPeriod when it is set to minutes', function () {
      // 7200 seconds = 2 hours = 120 minutes
      expect(<Counter seconds={7200} digits={0} maxPeriod='minutes' />)
        .toHaveDigits([
          ['1', '2', '0'],
          ['0', '0']
        ])
    })

    it('preserves a constant number of digits per segment', function () {
      jest.useFakeTimers()
      const component = mount(<Counter seconds={100} digits={0} maxPeriod='seconds' />)
      const segments = component.find(CounterSegment)
      expect(segments.at(0).props().digits).toEqual(['1', '0', '0'])
      jest.runTimersToTime(2 * 1000)
      expect(segments.at(0).props().digits).toEqual(['0', '9', '8'])
    })
  })
})

describe('with numeric argument', function () {
  it('removes limit from max period when digits = 0', function () {
    expect(<Counter from={0} to={to} digits={0} />)
      .toHaveDigits([
        ['2', '0', '0'],
        ['0', '6'],
        ['3', '5'],
        ['5', '4']
      ])
  })

  it('zero-pads numbers when digits = 4', function () {
    expect(<Counter from={0} to={to} digits={4} />)
      .toHaveDigits([
        ['0', '2', '0', '0'],
        ['0', '0', '0', '6'],
        ['0', '0', '3', '5'],
        ['0', '0', '5', '4']
      ])
  })

  it('limits segment sizes', function () {
    expect(<Counter from={0} to={to} digits={1} />)
      .toHaveDigits([
        ['9'],
        ['6'],
        ['9'],
        ['9']
      ])
  })

  it('displays 7 for octal when digits = 1', function () {
    expect(<Counter from={0} to={to} digits={1} radix={8} />)
      .toHaveDigits([
        ['7'],
        ['6'],
        ['7'],
        ['7']
      ])
  })
})

describe('with map argument', function () {
  it('allows to set up periods differently', function () {
    const digits = {
      days: 0,
      hours: 3,
      minutes: 2,
      seconds: 5
    }
    expect(<Counter from={0} to={to} digits={digits} />)
      .toHaveDigits([
        ['2', '0', '0'],
        ['0', '0', '6'],
        ['3', '5'],
        ['0', '0', '0', '5', '4']
      ])
  })

  it('works without specifying all periods', function () {
    const digits = {
      hours: 1,
      minutes: 3
    }
    expect(<Counter from={0} to={to} digits={digits} />)
      .toHaveDigits([
        ['9', '9'],
        ['6'],
        ['0', '3', '5'],
        ['5', '4']
      ])
  })
})
