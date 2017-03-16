import React from 'react'
import { shallow } from 'enzyme'
import Counter from '../../../../src/components/Counter'
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
        '111111'.split(''),
        '00110'.split(''),
        '100011'.split(''),
        '110110'.split('')
      ])
  })

  describe('takes maximum value possible when minPeriod = maxPeriod', function () {
    test('days', function () {
      expect(<Counter from={0} to={to} minPeriod='days' />)
        .toHaveDigits([['2', '0', '0']])
    })

    test('days and direction is "up"', function () {
      expect(<Counter from={0} to={to} minPeriod='days' direction='up' />)
        .toHaveDigits([['0', '0', '0']])
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

describe('min/max normalization', function () {
  test('maxDigits = minDigits if minDigits > maxDigits, minDigits is set, maxDigits isnt', () => {
    expect(<Counter from={0} to={to} minDigits={4} />)
      .toHaveDigits([
        ['0', '2', '0', '0'],
        ['0', '0', '0', '6'],
        ['0', '0', '3', '5'],
        ['0', '0', '5', '4']
      ])
  })

  test('minDigits = maxDigits if minDigits > maxDigits, maxDigits is set, minDigits isnt', () => {
    expect(<Counter from={0} to={to} maxDigits={1} />)
      .toHaveDigits([
        ['9'],
        ['6'],
        ['9'],
        ['9']
      ])
  })

  it('raises error when both options are provided and impossible to normalize', function () {
    expect(
      () => shallow(<Counter from={0} to={to} minDigits={3} maxDigits={1} />)
    ).toThrowError('conflict: minDigits (3) > maxDigits (1)')
  })

  it('does not change minDigits and maxDigits when they are provided and max > min', function () {
    expect(<Counter from={0} to={to} minDigits={1} maxDigits={3} />)
      .toHaveDigits([
        ['2', '0', '0'],
        ['6'],
        ['3', '5'],
        ['5', '4']
      ])
  })
})

describe('with numeric argument', function () {
  it('removes limit from max period when maxDigits = 0', function () {
    expect(<Counter from={0} to={to} maxDigits={0} />)
      .toHaveDigits([
        ['2', '0', '0'],
        ['0', '6'],
        ['3', '5'],
        ['5', '4']
      ])
  })

  it('zero-pads numbers when minDigits = 4', function () {
    expect(<Counter from={0} to={to} minDigits={4} />)
      .toHaveDigits([
        ['0', '2', '0', '0'],
        ['0', '0', '0', '6'],
        ['0', '0', '3', '5'],
        ['0', '0', '5', '4']
      ])
  })

  it('allows to lower maxDigits without lowering minDigits', function () {
    expect(<Counter from={0} to={to} maxDigits={1} />)
      .toHaveDigits([
        ['9'],
        ['6'],
        ['9'],
        ['9']
      ])
  })

  it('displays 9 for decimal when minDigits and maxDigits are low', function () {
    expect(<Counter from={0} to={to} minDigits={1} maxDigits={1} />)
      .toHaveDigits([
        ['9'],
        ['6'],
        ['9'],
        ['9']
      ])
  })

  it('displays 7 for octal when minDigits and maxDigits are low', function () {
    expect(<Counter from={0} to={to} minDigits={1} maxDigits={1} radix={8} />)
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
    const minDigits = {
      days: 1,
      hours: 3,
      minutes: 2,
      seconds: 5
    }
    const maxDigits = {
      days: 0,
      hours: 3,
      minutes: 4,
      seconds: 5
    }
    expect(<Counter from={0} to={to} minDigits={minDigits} maxDigits={maxDigits} />)
      .toHaveDigits([
        ['2', '0', '0'],
        ['0', '0', '6'],
        ['3', '5'],
        ['0', '0', '0', '5', '4']
      ])
  })

  it('works without specifying all periods', function () {
    const minDigits = {
      hours: 1,
      minutes: 3
    }
    const maxDigits = {
      seconds: 1
    }
    expect(<Counter from={0} to={to} minDigits={minDigits} maxDigits={maxDigits} />)
      .toHaveDigits([
        ['9', '9'],
        ['6'],
        ['0', '3', '5'],
        ['9']
      ])
  })
})
