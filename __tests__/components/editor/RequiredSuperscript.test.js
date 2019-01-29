import React from 'react'
import { shallow } from 'enzyme'
import RequiredSuperscript from '../../../src/components/editor/RequiredSuperscript'

describe("<RequiredSuperscript />", () => {
  const wrapper = shallow(<RequiredSuperscript />)

  it('displays a HTML <sup>', () => {
    expect(wrapper.find("sup")).toBeTruthy()
  })

  it('uses FontAwesome Asterisk', () => {
    expect(wrapper.find('sup > FontAwesomeIcon[className="asterick text-danger"]')).toBeTruthy()
  })
})
