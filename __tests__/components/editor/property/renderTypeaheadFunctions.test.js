// Copyright 2019 Stanford University see LICENSE for licenseimport React from 'react'

import { shallow } from 'enzyme'
import { renderMenuFunc, renderTokenFunc } from 'components/editor/property/renderTypeaheadFunctions'
import { findAuthorityConfigs } from 'utilities/authorityConfig'

describe('Rendering Typeahead Menu', () => {
  describe('Lookup', () => {
    const p2Props = {
      id: 'lookupComponent',
    }

    const multipleResults = [
      { authLabel: 'GETTY_ULAN person (QA)', authURI: 'urn:ld4p:qa:gettyulan:person' },
      { uri: 'http://id.loc.gov/authorities/names/n860600181234', label: 'Names, Someone' },
      { authLabel: 'LOC all subjects (QA)', authURI: 'urn:ld4p:qa:subjects' },
      { uri: 'http://id.loc.gov/authorities/subjects/sh00001861123', label: 'A Specific Place' },
    ]

    const validNewURIResults = [{
      customOption: true,
      label: 'http://id.loc.gov/authorities/subjects/123456789',
    }]

    it('shows menu headers for both lookups and new valid URI value with the correct headers when matches are found', () => {
      const lookupConfigs = findAuthorityConfigs(['urn:ld4p:qa:gettyulan:person', 'urn:ld4p:qa:subjects'])
      const menuWrapper = shallow(renderMenuFunc(multipleResults.concat(validNewURIResults), p2Props, lookupConfigs))
      const menuChildrenNumber = menuWrapper.children().length

      // One top level menu component
      expect(menuWrapper.find('ul').length).toEqual(1)
      // Five children, with three headings and three items
      expect(menuChildrenNumber).toEqual(6)
      expect(menuWrapper.childAt(0).html()).toEqual('<li class="dropdown-header">GETTY_ULAN person (QA)</li>')
      expect(menuWrapper.childAt(1).childAt(0).text()).toEqual('Names, Someone')
      expect(menuWrapper.childAt(2).html()).toEqual('<li class="dropdown-header">LOC all subjects (QA)</li>')
      expect(menuWrapper.childAt(3).childAt(0).text()).toEqual('A Specific Place')
      expect(menuWrapper.childAt(4).html()).toEqual('<li class="dropdown-header">New URI</li>')
      expect(menuWrapper.childAt(5).childAt(0).text()).toEqual('http://id.loc.gov/authorities/subjects/123456789')
    })

    it('sets the correct for customOptions', () => {
      const lookupConfigs = findAuthorityConfigs(['urn:ld4p:qa:agrovoc'])
      const customOptions = [
        {
          customOption: true,
          label: 'http://schema.org/Food',
        },
        {
          customOption: true,
          label: 'A piece of corn-on-the-cob',
        },
      ]
      const menuWrapper = shallow(renderMenuFunc(customOptions, p2Props, lookupConfigs))
      expect(menuWrapper.childAt(1).childAt(0).text()).toEqual('New URI')
      expect(menuWrapper.childAt(2).childAt(0).text()).toEqual('http://schema.org/Food')
      expect(menuWrapper.childAt(3).childAt(0).text()).toEqual('New Literal')
      expect(menuWrapper.childAt(4).childAt(0).text()).toEqual('A piece of corn-on-the-cob')
    })
  })

  describe('Rendering Tokens', () => {
    it('links the tokens when there is a URI', () => {
      const option = {
        uri: 'http://sinopia.example/abcdefg',
        id: 'sinopia:uri',
        label: 'example with uri',
      }

      const tokenWrapper = shallow(renderTokenFunc(option, { labelKey: 'label' }, 0))
      expect(tokenWrapper.exists('a[href="http://sinopia.example/abcdefg"]')).toEqual(true)
    })

    it('does not link the tokens when there is no URI', () => {
      const option = {
        id: 'no1',
        label: 'example no uri',
      }

      const tokenWrapper = shallow(renderTokenFunc(option, { labelKey: 'label' }, 0))
      expect(tokenWrapper.exists('a')).toEqual(false)
    })
  })
})
