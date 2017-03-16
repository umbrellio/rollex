import React from 'react'
import { shallow } from 'enzyme'
import Counter from '../../../src/components/Counter'

describe('CSS classes', function () {
  it('applies rollex and rollex-static classes to static counters', function () {
    const component = shallow(<Counter seconds={0} />)
    expect(component.find('.rollex').at(0).hasClass('rollex-static')).toBe(true)
  })

  it('applies rollex and rollex-animated classes to animated counters', function () {
    const component = shallow(<Counter seconds={0} easingFunction='ease-in' />)
    expect(component.find('.rollex').at(0).hasClass('rollex-animated')).toBe(true)
  })

  it('applies rollex-frozen class to frozen counters', function () {
    const staticComponent = shallow(<Counter seconds={0} frozen />)
    expect(staticComponent.find('.rollex').at(0).hasClass('rollex-frozen')).toBe(true)
    const animatedComponent = shallow(<Counter seconds={0} easingFunction='ease-in' frozen />)
    expect(animatedComponent.find('.rollex').at(0).hasClass('rollex-frozen')).toBe(true)
  })
})
