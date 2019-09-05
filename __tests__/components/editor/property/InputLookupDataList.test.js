// Copyright 2019 Stanford University see LICENSE for license

import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import shortid from 'shortid'
import InputURI from 'components/editor/property/InputURI'
import InputLookupDataList, { DataListOption } from 'components/editor/property/InputLookupDataList'

const plProps = {
  id: 'lookupComponent',
  propertyTemplate: {
    mandatory: 'false',
    repeatable: 'false',
    type: 'lookup',
    resourceTemplates: [],
    valueConstraint: {
      valueTemplateRefs: [],
      useValuesFrom: [
        'lookupQaLocNames',
      ],
      valueDataType: {
        dataTypeURI: 'http://id.loc.gov/ontologies/bibframe/Agent',
      },
    },
    propertyURI: 'http://id.loc.gov/ontologies/bflc/target',
    propertyLabel: 'Name Lookup',
  },
  lookupConfig: [
    {
      label: 'LOC person [names] (QA)',
      uri: 'urn:ld4p:qa:names:person',
      authority: 'locnames_ld4l_cache',
      subauthority: 'person',
      language: 'en',
      component: 'lookup',
    },
  ],
  isLoading: false,
  options: [{
    id: '1234',
    uri: 'https://sinopia.io/example/1',
    label: 'A label',
  }],
  search: jest.fn(),
}

describe('<InputLookupDataList />', () => {
  shortid.generate = jest.fn().mockReturnValue(0)
  const wrapper = shallow(<InputLookupDataList.WrappedComponent {...plProps} />)
  const dataList = wrapper.find('datalist')

  it('uses that a datalist with an id', () => {
    expect(dataList.props().id).toBe(0)
  })

  it('has one option with an id', () => {
    const option = dataList.find(DataListOption)
    expect(option.props().id).toBe('1234')
  })

  describe('when mandatory is true', () => {
    const template = { ...plProps.propertyTemplate, mandatory: 'true' }
    const wrapper2 = shallow(<InputLookupDataList.WrappedComponent {...plProps}
                                                                   propertyTemplate={template} />)
    const inputURI2 = wrapper2.find(InputURI)

    it('passes the "required" property to the InputURI', () => {
      expect(inputURI2.find('input:required')).toBeTruthy()
    })

    it('displays RequiredSuperscript if mandatory from template is true', () => {
      expect(wrapper2.find('label > RequiredSuperscript')).toBeTruthy()
    })
  })
})
