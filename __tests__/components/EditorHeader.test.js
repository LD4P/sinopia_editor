import React from 'react'
import { shallow } from 'enzyme'
import EditorHeader from '../../src/components/EditorHeader'

describe('<EditorHeader />', () => {
  const wrapper = shallow(<EditorHeader />)
  it ('displays the Sinopia text', () => {
    expect(wrapper.find("h1.editor-logo").text()).toBe("SINOPIA")
  })
})
