import React from 'react'
import AnimatedCounterDigit from './AnimatedCounterDigit'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

it('matches snapshot', function () {
  const component = shallow(
    <AnimatedCounterDigit
      digit='0'
      height={18}
      radix={10}
      digitMap={{}}
      digitWrapper={(digit) => <div>{digit}</div>}
      maxValue={9}
      easingFunction='ease-in'
      easingDuration={300}
    />
  )
  const tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})

it('limits the value to maxValue', function () {
  const component = shallow(
    <AnimatedCounterDigit
      digit='0'
      height={18}
      radix={10}
      digitMap={{}}
      digitWrapper={(digit) => digit}
      maxValue={5}
      easingFunction='ease-in'
      easingDuration={300}
    />
  )
  expect(component.find('.rollex-digit-lane-label').length).toBe(7)
})
