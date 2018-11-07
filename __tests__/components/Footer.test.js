import React from 'react'
import { shallow } from 'enzyme'
import Footer from '../../src/components/Footer'

describe('<Footer />', () => {
  const wrapper = shallow(<Footer />)
  it ('renders the creative common license image', () => {
    expect(wrapper.find("img[alt='Creative Commons License'][src^='https://i.creativecommons.org']")).toBeDefined()
  })
  it ('contains the ld4p link', () => {
    expect(wrapper.find('a[href="http://www.ld4p.org"]')).toBeDefined()
  })
})

