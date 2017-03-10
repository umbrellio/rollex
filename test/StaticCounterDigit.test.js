import React from 'react'
import StaticCounterDigit from '../src/StaticCounterDigit'
import { shallow } from 'enzyme'

it('decorates the digit', function () {
  const componentWithWrapper = shallow(
    <StaticCounterDigit
      digit='0'
      height={18}
      radix={10}
      digitMap={{}}
      digitWrapper={(digit) => <div>{digit}</div>}
    />
  )
  expect(componentWithWrapper.html()).toBe('<div class="rollex-digit"><div>0</div></div>')

  const componentWithWrapperAndMap = shallow(
    <StaticCounterDigit
      digit='0'
      height={18}
      radix={10}
      digitMap={{ 0: 'o' }}
      digitWrapper={(digit) => <div>{digit}</div>}
    />
  )
  expect(componentWithWrapperAndMap.html()).toBe('<div class="rollex-digit"><div>o</div></div>')
})
