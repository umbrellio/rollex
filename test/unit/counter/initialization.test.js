import React from 'react'
import { shallow } from 'enzyme'
import Counter from '../../../src/components/Counter'

it('throws an error when options are provided incorrectly', function () {
  const originalError = console.error
  console.error = () => {} // disable React PropTypes warnings

  expect(
    () => shallow(<Counter />)
  ).toThrowError('provide either "seconds" or "to"')
  expect(
    () => shallow(<Counter from={0} to={1} seconds={2} />)
  ).toThrowError('cannot use "to" and "from" with "seconds"')
  expect(
    () => shallow(<Counter from={0} />)
  ).toThrowError('provide either "seconds" or "to"')
  expect(
    () => shallow(<Counter from={0} seconds={2} />)
  ).toThrowError('cannot use "to" and "from" with "seconds"')
  expect(
    () => shallow(<Counter seconds={2} syncTime />)
  ).toThrowError('"syncTime" must be used with "to"')
  expect(
    () => shallow(<Counter to={0} seconds={2} />)
  ).toThrowError('cannot use "to" and "from" with "seconds"')
  expect(
    () => shallow(<Counter from={1} to={0} />)
  ).toThrowError('"to" must be bigger than "from"')
  expect(
    () => shallow(<Counter seconds={-1} />)
  ).toThrowError('"seconds" must be greater than or equal to zero')
  expect(
    () => shallow(<Counter seconds={0} minDigits={0} />)
  ).toThrowError('"minDigits" must be positive')
  expect(
    () => shallow(<Counter seconds={0} minPeriod='sobaka' />)
  ).toThrowError('"minPeriod" must be one of: days, hours, minutes, seconds')
  expect(
    () => shallow(<Counter seconds={0} maxPeriod='sobaka' />)
  ).toThrowError('"maxPeriod" must be one of: days, hours, minutes, seconds')
  expect(
    () => shallow(<Counter seconds={0} radix={37} />)
  ).toThrowError('"radix" must be between 2 and 36')
  expect(
    () => shallow(<Counter seconds={0} digitWrapper={48} />)
  ).toThrowError('"digitWrapper" must be a function')
  expect(
    () => shallow(<Counter seconds={0} digitMap='111' />)
  ).toThrowError('"digitMap" must be an object')
  expect(
    () => shallow(<Counter to={0} direction='sobaka' />)
  ).toThrowError('"direction" must be either up or down')

  console.error = originalError
})

it('initializes when options are correct', function () {
  expect(
    () => shallow(<Counter to={0} />)
  ).not.toThrow()
  expect(
    () => shallow(<Counter from={0} to={1} />)
  ).not.toThrow()
  expect(
    () => shallow(<Counter seconds={2} />)
  ).not.toThrow()
  expect(
    () => shallow(<Counter seconds={2} minDigits={3} />)
  ).not.toThrow()
  expect(
    () => shallow(<Counter seconds={2} maxDigits={3} />)
  ).not.toThrow()
  expect(
    () => shallow(<Counter seconds={2} minPeriod='minutes' />)
  ).not.toThrow()
  expect(
    () => shallow(<Counter seconds={2} maxPeriod='hours' />)
  ).not.toThrow()
  expect(
    () => shallow(<Counter from={0} to={1} syncTime />)
  ).not.toThrow()
  expect(
    () => shallow(<Counter seconds={0} radix={12} />)
  ).not.toThrow()
  expect(
    () => shallow(<Counter seconds={0} digitWrapper={() => null} />)
  ).not.toThrow()
  expect(
    () => shallow(<Counter seconds={0} digitMap={{}} />)
  ).not.toThrow()
  expect(
    () => shallow(<Counter to={9} direction='up' />)
  ).not.toThrow()
})
