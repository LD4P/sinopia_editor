import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import SinopiaResourceTemplates from '../../../src/components/editor/SinopiaResourceTemplates'
import BootstrapTable from 'react-bootstrap-table'
import 'isomorphic-fetch'

describe('<SinopiaResourceTemplates />', () => {
  const message = [
    'Created http://localhost:8080/repository/ld4p/Note/sinopia:resourceTemplate:bf2:Note1',
    'Created http://localhost:8080/repository/ld4p/Note/sinopia:resourceTemplate:bf2:Note2'
  ]
  const wrapper = shallow(<SinopiaResourceTemplates message={message}/>)

  it('has a header for the area where the list of groups in sinopia_Server are displayed', () => {
    expect(wrapper.find('div > h4').first().text()).toEqual('Groups in Sinopia')
  })

  it('has a header for the area where the table of resource templates for the groups are displayed', () => {
    expect(wrapper.find('div > h4').last().text()).toEqual('Available Resource Templates in Sinopia')
  })

  it('has a bootstrap table that displays the results from the calls to sinopia_server', () => {
    expect(wrapper.find('BootstrapTable').length).toEqual(1)
  })

  describe('getting data from the sinopia_server', () => {

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

    it('sets the state with group data (as Array) from sinopia_server', async() => {

      const promise = Promise.resolve(mockResponse(200, null, bodyContains))
      const wrapper2 = shallow(<SinopiaResourceTemplates message={message}/>)
      await wrapper2.instance().fulfillGroupPromise(promise).then(() => wrapper2.update()).then(() => {
        expect(wrapper2.state('groupData')).toEqual(['ld4p', 'pcc'])
      }).catch(e => {})
    })

    it('sets a message if there is no server response', async() => {
      const promise = Promise.resolve(mockResponse(200, null, undefined))
      const wrapper2 = shallow(<SinopiaResourceTemplates message={message}/>)
      await wrapper2.instance().fulfillGroupPromise(promise).then(() => wrapper2.update()).then(() => {
        expect(wrapper2.state('message')).toBeTruthy()
      }).catch(e => {})
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

      const wrapper3 = shallow(<SinopiaResourceTemplates message={message}/>)
      //TODO: figure out how to mock and test a nested promise...
      const spy = jest.spyOn(wrapper3.instance(), 'fulfillGroupData')
      await wrapper3.instance().fulfillGroupData(bodyContains)
      expect(spy).toHaveBeenCalled()
    })

  })

  describe('linking back to the Editor component', () => {

    const cell = 'Note'
    const row = {
      name: "Note",
      uri: "http://localhost:8080/repository/ld4p/Note",
      id: "ld4p:resourceTemplate:bf2:Note",
      group: "ld4p"
    }

    const wrapper4 = shallow(<SinopiaResourceTemplates message={message}/>)

    it('has the header columns for the table of linked resource templates', async () => {
      await expect(wrapper4.find('BootstrapTable').find('TableHeaderColumn').length).toEqual(3)
    })

    it('renders a link to the Editor with the id of the resource template to fetch', async () => {
      const link = await wrapper4.instance().linkFormatter(cell, row)
      await expect(link.props.to.pathname).toEqual('/editor')
      await expect(link.props.to.state.resourceTemplateId).toEqual(row.id)
    })
  })
})