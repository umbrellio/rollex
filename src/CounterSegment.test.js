import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import CounterSegment from './CounterSegment'

it('matches snapshot', function () {
  const component = shallow(<CounterSegment label='days' digits={['0', '0']} />)
  const tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})

it('should render a .cntr-digit for each digit', function () {
  const component = shallow(<CounterSegment label='days' digits={['0', '1', '2']} />)
  expect(component.find('.cntr-digit').length).toEqual(3)
})
