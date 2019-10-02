import { shallow } from 'enzyme'
import { renderMenuFunc, renderTokenFunc } from 'components/editor/property/renderTypeaheadFunctions'


describe('Rendering Typeahead Menu', () => {
  const validNewLiteralResults = [{
    customOption: true,
    label: 'Some non URI string',
  }]

  describe('Sinopia lookups', () => {
    const plProps = {
      id: 'sinopia-lookup',
    }

    const validNewURIResults = [{
      customOption: true,
      label: 'https://sinopia.io/repository/test/hijklmnop',
    }]

    const multipleResults = [
      { uri: 'https://sinopia.io/repository/test/abcdefg', label: 'Blue hat, green hat' },
      { customOption: true, id: 'new-id-18', label: 'blue' },
    ]

    it('shows menu headers with sinopia source label and literal value in the dropdown when provided results', () => {
      const menuWrapper = shallow(renderMenuFunc(multipleResults, plProps))
      const menuChildrenNumber = menuWrapper.children().length
      // One top level menu component

      expect(menuWrapper.find('ul').length).toEqual(1)
      // Four children, with two headings and two items
      expect(menuChildrenNumber).toEqual(4)
      expect(menuWrapper.childAt(0).html()).toEqual('<li class="dropdown-header">Sinopia Entity</li>')
      expect(menuWrapper.childAt(1).childAt(0).text()).toEqual('Blue hat, green hat')
      expect(menuWrapper.childAt(2).html()).toEqual('<li class="dropdown-header">New Literal</li>')
      expect(menuWrapper.childAt(3).childAt(0).text()).toEqual('blue')
    })

    it('shows a single new valid URI value with the correct header when no other matches are found', () => {
      const menuWrapper = shallow(renderMenuFunc(validNewURIResults, plProps))
      const menuChildrenNumber = menuWrapper.children().length
      // One top level menu component

      expect(menuWrapper.find('ul').length).toEqual(1)
      // Two children, with one headings and one custom item
      expect(menuChildrenNumber).toEqual(2)
      expect(menuWrapper.childAt(0).html()).toEqual('<li class="dropdown-header">New URI</li>')
      expect(menuWrapper.childAt(1).childAt(0).text()).toEqual('https://sinopia.io/repository/test/hijklmnop')
    })

    it('does show a single new literal value when no other matches are found', () => {
      const menuWrapper = shallow(renderMenuFunc(validNewLiteralResults, plProps))
      const menuChildrenNumber = menuWrapper.children().length
      // One top level menu component

      expect(menuWrapper.find('ul').length).toEqual(1)
      // Nothing shown because the entered URI is not valid
      expect(menuChildrenNumber).toEqual(2)
      expect(menuWrapper.childAt(0).html()).toEqual('<li class="dropdown-header">New Literal</li>')
      expect(menuWrapper.childAt(1).childAt(0).text()).toEqual('Some non URI string')
    })
  })

  describe('QA Lookup', () => {
    const p2Props = {
      id: 'lookupComponent',
    }

    const multipleResults = [
      { authLabel: 'Person', authURI: 'PersonURI' },
      { uri: 'http://id.loc.gov/authorities/names/n860600181234', label: 'Names, Someone' },
      { authLabel: 'Subject', authURI: 'SubjectURI' },
      { uri: 'http://id.loc.gov/authorities/subjects/sh00001861123', label: 'A Specific Place' },
    ]

    const validNewURIResults = [{
      customOption: true,
      label: 'http://id.loc.gov/authorities/subjects/123456789',
    }]

    it('shows menu headers for both lookups and new valid URI value with the correct headers when matches are found', () => {
      const menuWrapper = shallow(renderMenuFunc(multipleResults.concat(validNewURIResults), p2Props))
      const menuChildrenNumber = menuWrapper.children().length
      // One top level menu component

      expect(menuWrapper.find('ul').length).toEqual(1)
      // Five children, with three headings and three items
      expect(menuChildrenNumber).toEqual(6)
      expect(menuWrapper.childAt(0).html()).toEqual('<li class="dropdown-header">Person</li>')
      expect(menuWrapper.childAt(1).childAt(0).text()).toEqual('Names, Someone')
      expect(menuWrapper.childAt(2).html()).toEqual('<li class="dropdown-header">Subject</li>')
      expect(menuWrapper.childAt(3).childAt(0).text()).toEqual('A Specific Place')
      expect(menuWrapper.childAt(4).html()).toEqual('<li class="dropdown-header">New URI</li>')
      expect(menuWrapper.childAt(5).childAt(0).text()).toEqual('http://id.loc.gov/authorities/subjects/123456789')
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
