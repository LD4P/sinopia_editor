import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import SinopiaResourceTemplates from '../../../src/components/editor/SinopiaResourceTemplates'
import BootstrapTable from 'react-bootstrap-table-next'

describe('<SinopiaResourceTemplates />', () => {

  const wrapper = shallow(<SinopiaResourceTemplates />)

  it('has a header for the area where the list of groups in sinopia_Server are displayed', () => {
    expect(wrapper.find('div > h4').first().text()).toEqual('Groups in Sinopia')
  })

  it('has a header for the area where the table of resource templates for the groups are displayed', () => {
    expect(wrapper.find('div > h4').last().text()).toEqual('Available Resource Templates in Sinopia')
  })

  it('has a bootstrap table that displays the results from the calls to sinopia_server', () => {
    expect(wrapper.find(BootstrapTable).dive().length).toEqual(1)
  })

  describe('gettiong data from the sinopia_server', () => {

    it('sets the state with group data from sinopia_server', () => {
      const bodyContains = {
        response: {
          body: {
            contains: [
              "http://localhost:8080/repository/ld4p/Note",
              "http://localhost:8080/repository/ld4p/Barcode",
              "http://localhost:8080/repository/ld4p/Title",
              "http://localhost:8080/repository/ld4p/Item"
            ]
          }
        }
      }

      jest.fn(() => new Promise(resolve => resolve(JSON.stringify(bodyContains))))
      const wrapper2 = shallow(<SinopiaResourceTemplates />)

      wrapper2.instance().fulfillGroupPromise()
      wrapper2.update()
      wrapper2.setState({groupData: bodyContains.response.body.contains})
      console.warn(wrapper2.state())
      expect(wrapper2.state('groupData').length).toEqual(4)
    })

    it('sets the state with a list of resource templates from the server', () => {
      const joined = [
        {name: 'Note', uri: "http://localhost:8080/repository/ld4p/Note", id: 'resourceTemplate:bf2:Note', group: 'ld4p'},
        {name: 'Barcode', uri: "http://localhost:8080/repository/ld4p/Barcode", id: 'resourceTemplate:bf2:Barcode', group: 'ld4p'},
        {name: 'Title', uri: "http://localhost:8080/repository/ld4p/Title", id: 'resourceTemplate:bf2:Title', group: 'ld4p'},
        {name: 'Item', uri: "http://localhost:8080/repository/ld4p/Item", id: 'resourceTemplate:bf2:Item', group: 'ld4p'}
      ]
      jest.fn(() => new Promise(resolve => resolve(JSON.stringify(joined))))
      const wrapper3 = shallow(<SinopiaResourceTemplates />)
      wrapper3.instance().fulfillGroupDataPromise()
      wrapper3.update()

      wrapper3.setState({templatesForGroup: joined})
      console.warn(wrapper3.state())
      expect(wrapper3.state('templatesForGroup').length).toEqual(4)
    })

  })

})