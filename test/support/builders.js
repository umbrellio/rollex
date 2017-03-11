import React from 'react'
import { shallow, mount } from 'enzyme'
import CounterSegment from '../../src/CounterSegment'
import StaticCounterDigit from '../../src/StaticCounterDigit'
import AnimatedCounterDigit from '../../src/AnimatedCounterDigit'

class AbstractBuilder {
  static shallow = function (params = {}) {
    return shallow(this.build(params))
  }

  static mount = function (params = {}) {
    return mount(this.build(params))
  }
}

export class CounterSegmentBuilder extends AbstractBuilder {
  static build = function ({
    digits = ['0', '0'],
    period = 'seconds',
    radix = 10,
    direction = 'down',
    easingFunction = null,
    easingDuration = 300,
    digitMap = {},
    digitWrapper = (digit) => <span>{digit}</span>,
    label = 'seconds'
  } = {}) {
    return React.createElement(
      CounterSegment,
      { digits, period, radix, direction, easingFunction, easingDuration, digitMap, digitWrapper, label }
    )
  }
}

export class StaticCounterDigitBuilder extends AbstractBuilder {
  static build = function ({
    digit = '0',
    height = 18,
    radix = 10,
    digitMap = {},
    digitWrapper = (digit) => <span>{digit}</span>
  } = {}) {
    return React.createElement(
      StaticCounterDigit,
      { digit, height, radix, digitMap, digitWrapper }
    )
  }
}

export class AnimatedCounterDigitBuilder extends AbstractBuilder {
  static build = function ({
    digit = '0',
    height = 18,
    radix = 10,
    direction = 'down',
    digitMap = {},
    digitWrapper = (digit) => <span>{digit}</span>,
    maxValue = 9,
    easingFunction = 'ease-in',
    easingDuration = 300
  } = {}) {
    return React.createElement(
      AnimatedCounterDigit,
      { digit, height, radix, direction, digitMap, digitWrapper, maxValue, easingFunction, easingDuration }
    )
  }
}
