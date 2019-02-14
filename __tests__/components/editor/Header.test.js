// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import Header from '../../../src/components/editor/Header'

describe('<Header />', () => {
  const wrapper = shallow(<Header />)

  it ('displays the Sinopia text', () => {
    expect(wrapper.find("h1.editor-logo").text()).toBe("LINKED DATA EDITOR")
  })

  //Nav tabs tests
  
  //Expect to find three tabs
  it ('displays the header tabs', () => {
      expect(wrapper.find("ul.editor-navtabs NavLink").length).toBe(3);
  })

  //Expect to find BROWSE URL
  it ('uses the browse URL', () => {
        expect(wrapper.find("ul.editor-navtabs NavLink[to='/browse']").length).toBe(1);
   })

   //Expect to find EDITOR URL
     it ('uses the editor URL', () => {
        expect(wrapper.find("ul.editor-navtabs NavLink[to='/editor']").length).toBe(1);
   })
   //Expect to find Import Resource Template URL
     it ('uses the Import Resource Template URL', () => {
        expect(wrapper.find("ul.editor-navtabs NavLink[to='/import']").length).toBe(1);
   })
})