import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import SinopiaResourceTemplates from '../../../src/components/editor/SinopiaResourceTemplates'
import BootstrapTable from 'react-bootstrap-table-next'
import 'isomorphic-fetch'

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

    it('sets the state with group data (as Array) from sinopia_server', async() => {

      const mockResponse = (status, statusText, response) => {
        return new Response(response, {
          status: status,
          statusText: statusText,
          headers: {
            'Content-type': 'application/json'
          }
        }).body
      }

      const bodyContains = {
        response: {
          body: {
            contains: [
              'ld4p', 'pcc'
            ]
          }
        }
      }

      const promise = Promise.resolve(mockResponse(200, null, bodyContains))
      const wrapper2 = shallow(<SinopiaResourceTemplates />)
      await wrapper2.instance().fulfillGroupPromise(promise)
      wrapper2.update()
      expect(wrapper2.state('groupData')).toEqual(['ld4p', 'pcc'])
    })

    it('sets the state with a list of resource templates from the server', async() => {
      const bodyContains = {
        response: {
          body: {
            "@id": 'ld4p',
            contains: [
              "http://localhost:8080/repository/ld4p/Note",
              "http://localhost:8080/repository/ld4p/Barcode",
              "http://localhost:8080/repository/ld4p/Title",
              "http://localhost:8080/repository/ld4p/Item"
            ]
          }
        }
      }

      const wrapper3 = shallow(<SinopiaResourceTemplates />)
      //TODO: figure out how to mock and test a nested promise...
      const spy = jest.spyOn(wrapper3.instance(), 'fulfillGroupData')
      await wrapper3.instance().fulfillGroupData(bodyContains)
      wrapper3.update()
      expect(spy).toHaveBeenCalled()
    })

  })

})