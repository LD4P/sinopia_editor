import React from 'react'
import { shallow } from 'enzyme'
import CanvasMenu from '../../src/components/CanvasMenu'

describe('<CanvasMenu />', () => {
  const wrapper = shallow(<CanvasMenu />)
  it ('renders multiple menu-items', () => {
    expect(wrapper.find("a.menu-item")).toBeDefined()
  })

  it('renders the FontAwesome arrow icon', () =>{
    expect(wrapper.find(".arrow-icon")).toBeDefined()
  })

  it('renders the FontAwesome closes icon', () =>{
    expect(wrapper.find(".close-icon")).toBeDefined()
  })
})