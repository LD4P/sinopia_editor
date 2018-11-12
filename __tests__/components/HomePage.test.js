/**
Copyright 2018 The Board of Trustees of the Leland Stanford Junior University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
import React from 'react'
import { shallow } from 'enzyme'
import HomePage from '../../src/components/HomePage'
import Header from '../../src/components/Header'
import NewsPanel from '../../src/components/NewsPanel'
import DescPanel from '../../src/components/DescPanel'

describe('<HomePage />', () =>{
  it('selectable by id "home-page"', () => {
    expect(shallow(<HomePage />).is('#home-page')).toBe(true)
  })

  it('renders four <HomePage /> components', () => {
    const wrapper = shallow(<HomePage />)
    expect(wrapper.find(Header).length).toBe(1)
    expect(wrapper.find(NewsPanel).length).toBe(1)
    expect(wrapper.find(DescPanel).length).toBe(1)
  })
})
