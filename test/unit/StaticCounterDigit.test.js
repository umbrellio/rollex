import React from 'react'
import { StaticCounterDigitBuilder as Builder } from './support/builders'

it('decorates the digit', function () {
  const componentWithWrapper = Builder.shallow({
    digit: '0',
    digitWrapper: (digit) => <a href='#'>{digit}</a>
  })
  expect(componentWithWrapper.html()).toBe(
    '<div class="rollex-digit"><a href="#">0</a></div>'
  )

  const componentWithWrapperAndMap = Builder.shallow({
    digit: '0',
    digitMap: {
      0: 'o'
    },
    digitWrapper: (digit) => <div>{digit}</div>
  })
  expect(componentWithWrapperAndMap.html()).toBe(
    '<div class="rollex-digit"><div>o</div></div>'
  )
})
