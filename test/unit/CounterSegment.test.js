import { shallowToJson } from 'enzyme-to-json'
import { CounterSegmentBuilder as Builder } from './support/builders'
import AnimatedCounterDigit from '../../src/components/AnimatedCounterDigit'
import StaticCounterDigit from '../../src/components/StaticCounterDigit'

describe('snaphots', function () {
  var staticComponent, animatedComponent

  beforeAll(function () {
    staticComponent = Builder.shallow({ easingFunction: null })
    animatedComponent = Builder.shallow({ easingFunction: 'ease-in' })
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
    staticComponent = Builder.mount({ easingFunction: null })
    animatedComponent = Builder.mount({ easingFunction: 'ease-in' })
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

    const dozenalComponent = Builder.mount({
      easingFunction: 'ease-in',
      radix: 12
    })
    const dozenalDigits = dozenalComponent.find(AnimatedCounterDigit)
    expect(dozenalDigits.at(0).props().maxValue).toBe(4)
    expect(dozenalDigits.at(1).props().maxValue).toBe(11)

    const daysComponent = Builder.mount({
      easingFunction: 'ease-in',
      period: 'days'
    })
    const daysComponentDigits = daysComponent.find(AnimatedCounterDigit)
    expect(daysComponentDigits.at(0).props().maxValue).toBe(9)
    expect(daysComponentDigits.at(1).props().maxValue).toBe(9)
  })
})
