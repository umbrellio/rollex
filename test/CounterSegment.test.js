import React from 'react'
import { shallow, mount } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import CounterSegment from '../src/CounterSegment'
import AnimatedCounterDigit from '../src/AnimatedCounterDigit'
import StaticCounterDigit from '../src/StaticCounterDigit'

function digitWrapper (digit) {
  return <div>{digit}</div>
}

describe('snaphots', function () {
  var staticComponent, animatedComponent

  beforeAll(function () {
    staticComponent = shallow(
      <CounterSegment
        digits={['0', '2']}
        period='days'
        radix={10}
        easingFunction={null}
        easingDuration={300}
        digitMap={{}}
        digitWrapper={digitWrapper}
      />
    )
    animatedComponent = shallow(
      <CounterSegment
        digits={['0', '2']}
        period='days'
        radix={10}
        easingFunction={'ease-in'}
        easingDuration={300}
        digitMap={{}}
        digitWrapper={digitWrapper}
      />
    )
  })

  it('matches snapshots', function () {
    const staticTree = shallowToJson(staticComponent)
    const animatedTree = shallowToJson(animatedComponent)
    expect(staticTree).toMatchSnapshot()
    expect(animatedTree).toMatchSnapshot()
  })
})

describe('rendering', function () {
  var staticComponent, animatedComponent

  beforeAll(function () {
    staticComponent = mount(
      <CounterSegment
        digits={['0', '2']}
        period='minutes'
        radix={10}
        easingFunction={null}
        easingDuration={300}
        digitMap={{}}
        digitWrapper={digitWrapper}
      />
    )
    animatedComponent = mount(
      <CounterSegment
        digits={['0', '2']}
        period='minutes'
        radix={10}
        easingFunction={'ease-in'}
        easingDuration={300}
        digitMap={{}}
        digitWrapper={digitWrapper}
      />
    )
  })

  it('renders a CounterDigit for each digit', function () {
    expect(staticComponent.find(StaticCounterDigit).length).toBe(2)
    expect(staticComponent.find(AnimatedCounterDigit).length).toBe(0)
    expect(animatedComponent.find(AnimatedCounterDigit).length).toBe(2)
    expect(animatedComponent.find(StaticCounterDigit).length).toBe(0)
  })

  it('passes correct maxValue to digits', function () {
    const animatedDigits = animatedComponent.find(AnimatedCounterDigit)
    expect(animatedDigits.at(0).props().maxValue).toBe(5)
    expect(animatedDigits.at(1).props().maxValue).toBe(9)

    const dozenalComponent = mount(
      <CounterSegment
        digits={['0', '2']}
        period='minutes'
        radix={12}
        easingFunction={'ease-in'}
        easingDuration={300}
        digitMap={{}}
        digitWrapper={digitWrapper}
      />
    )
    const dozenalDigits = dozenalComponent.find(AnimatedCounterDigit)
    expect(dozenalDigits.at(0).props().maxValue).toBe(4)
    expect(dozenalDigits.at(1).props().maxValue).toBe(11)

    const daysComponent = mount(
      <CounterSegment
        digits={['9', '8']}
        period='days'
        radix={10}
        easingFunction={'ease-in'}
        easingDuration={399}
        digitMap={{}}
        digitWrapper={digitWrapper}
      />
    )
    const daysComponentDigits = daysComponent.find(AnimatedCounterDigit)
    expect(daysComponentDigits.at(0).props().maxValue).toBe(9)
    expect(daysComponentDigits.at(1).props().maxValue).toBe(9)
  })
})
