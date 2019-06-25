// Copyright 2018 Stanford University see LICENSE for license

import 'jsdom-global/register'
import React from 'react'
import { mount, shallow } from 'enzyme'
import SinopiaResourceTemplates from 'components/templates/SinopiaResourceTemplates'
import { getEntityTagFromGroupContainer, getResourceTemplate, listResourcesInGroupContainer } from 'sinopiaServer'

jest.mock('sinopiaServer')

describe('<SinopiaResourceTemplates />', () => {
  const messages = [
    'Created http://localhost:8080/repository/ld4p/Note/sinopia:resourceTemplate:bf2:Note1',
    'Created http://localhost:8080/repository/ld4p/Note/sinopia:resourceTemplate:bf2:Note2',
  ]

  const wrapper = mount(<SinopiaResourceTemplates messages={messages}/>)

  it('has a header for the area where the table of resource templates for the groups are displayed', () => {
    expect(wrapper.find('div > h4').last().text()).toEqual('Available Resource Templates in Sinopia')
  })

  it('has a bootstrap table that displays the results from the calls to sinopia_server', () => {
    expect(wrapper.find('BootstrapTable').length).toEqual(1)
  })

  describe('constructor()', () => {
    it('initializes this.errors to empty array', () => {
      expect(wrapper.state().errors).toEqual([])
    })

    it('initializes this.resourceTemplates to empty array', () => {
      expect(wrapper.state().resourceTemplates).toEqual([])
    })

    it('initializes this.resourceTemplatesEtag to blank string', () => {
      expect(wrapper.state().resourceTemplatesEtag).toEqual('')
    })
  })

  describe('componentDidUpdate()', () => {
    const initialUpdateKey = 1

    it('calls fetchResourceTemplatesFromGroups() and resets errors if updateKey has been incremented', async () => {
      expect.assertions(2)
      const wrapper2 = shallow(<SinopiaResourceTemplates messages={messages} updateKey={initialUpdateKey} />)
      const fetchSpy = jest.spyOn(wrapper2.instance(), 'fetchResourceTemplatesFromGroups').mockReturnValue(null)
      const setStateSpy = jest.spyOn(wrapper2.instance(), 'setState').mockReturnValue(null)

      await wrapper2.setProps({ updateKey: 2 })

      expect(fetchSpy).toHaveBeenCalledTimes(1)
      expect(setStateSpy).toHaveBeenCalledWith({ errors: [] })
    })

    it('calls fetchResourceTemplatesFromGroups() and resets errors if server has new templates', async () => {
      expect.assertions(3)
      const wrapper2 = shallow(<SinopiaResourceTemplates messages={messages} updateKey={initialUpdateKey} />)
      const fetchSpy = jest.spyOn(wrapper2.instance(), 'fetchResourceTemplatesFromGroups').mockReturnValue(null)
      const serverCheckSpy = jest.spyOn(wrapper2.instance(), 'serverHasNewTemplates').mockReturnValue(true)
      const setStateSpy = jest.spyOn(wrapper2.instance(), 'setState').mockReturnValue(null)

      await wrapper2.setProps({ updateKey: 1 })

      expect(fetchSpy).toHaveBeenCalledTimes(1)
      expect(serverCheckSpy).toHaveBeenCalledTimes(1)
      expect(setStateSpy).toHaveBeenCalledWith({ errors: [] })
    })

    it('returns early if updateKey has not changed and no new templates on server', async () => {
      expect.assertions(3)
      const wrapper2 = shallow(<SinopiaResourceTemplates messages={messages} updateKey={initialUpdateKey} />)
      const fetchSpy = jest.spyOn(wrapper2.instance(), 'fetchResourceTemplatesFromGroups').mockReturnValue(null)
      const serverCheckSpy = jest.spyOn(wrapper2.instance(), 'serverHasNewTemplates').mockReturnValue(false)
      const setStateSpy = jest.spyOn(wrapper2.instance(), 'setState').mockReturnValue(null)

      await wrapper2.setProps({ updateKey: 1 })

      expect(fetchSpy).not.toHaveBeenCalled()
      expect(serverCheckSpy).toHaveBeenCalledTimes(1)
      expect(setStateSpy).not.toHaveBeenCalled()
    })
  })

  describe('serverHasNewTemplates()', () => {
    it('returns false when etag has not changed', async () => {
      expect.assertions(1)
      getEntityTagFromGroupContainer.mockImplementation(async () => 'foobar')
      const wrapper2 = shallow(<SinopiaResourceTemplates messages={messages} updateKey={1} />)

      wrapper2.setState({ resourceTemplatesEtag: 'foobar' })

      expect(await wrapper2.instance().serverHasNewTemplates()).toEqual(false)
    })

    it('returns true and resets etag value when etag changes', async () => {
      expect.assertions(2)
      getEntityTagFromGroupContainer.mockImplementation(async () => 'bazquux')
      const wrapper2 = shallow(<SinopiaResourceTemplates messages={messages} updateKey={1} />)

      expect(await wrapper2.instance().serverHasNewTemplates()).toEqual(true)
      expect(wrapper2.state().resourceTemplatesEtag).toEqual('bazquux')
    })

    it('returns false and logs a messages when there are errors', async () => {
      expect.assertions(2)
      getEntityTagFromGroupContainer.mockImplementation(async () => {
        throw 'ack!'
      })
      const wrapper2 = shallow(<SinopiaResourceTemplates messages={messages} updateKey={1} />)
      const consoleSpy = jest.spyOn(console, 'error')

      expect(await wrapper2.instance().serverHasNewTemplates()).toEqual(false)
      expect(consoleSpy).toHaveBeenCalledWith('error fetching RT group etag: ack!')
    })
  })

  describe('fetchResourceTemplatesFromGroups()', () => {
    const containsNothing = {
      response: {
        body: {},
      },
    }

    const containsTemplate = {
      response: {
        body: {
          contains: 'imatemplate',
        },
      },
    }

    it('does not set state if groups have no resource templates', async () => {
      expect.assertions(1)
      listResourcesInGroupContainer.mockReturnValue(new Promise((resolve) => {
        resolve(containsNothing)
      }))

      const wrapper2 = shallow(<SinopiaResourceTemplates messages={messages} />)
      const setStateFromServerResponseSpy = jest.spyOn(wrapper2.instance(), 'setStateFromServerResponse').mockReturnValue(null)

      await wrapper2.instance().fetchResourceTemplatesFromGroups()

      expect(setStateFromServerResponseSpy).not.toHaveBeenCalled()
    })

    it('sets state when there is a non-zero number of templates', async () => {
      expect.assertions(1)
      listResourcesInGroupContainer.mockReturnValue(new Promise((resolve) => {
        resolve(containsTemplate)
      }))

      const wrapper2 = shallow(<SinopiaResourceTemplates messages={messages} />)
      const setStateFromServerResponseSpy = jest.spyOn(wrapper2.instance(), 'setStateFromServerResponse').mockReturnValue(null)

      await wrapper2.instance().fetchResourceTemplatesFromGroups()

      expect(setStateFromServerResponseSpy).toHaveBeenCalledTimes(1)
    })

    it('adds errors to state if anything throws', async () => {
      expect.assertions(2)
      listResourcesInGroupContainer.mockImplementation(async () => {
        throw 'uh oh!'
      })

      const wrapper2 = shallow(<SinopiaResourceTemplates messages={messages} />)
      const setStateFromServerResponseSpy = jest.spyOn(wrapper2.instance(), 'setStateFromServerResponse').mockReturnValue(null)

      /*
       * We are spying on and stubbing setState() instead of testing what winds
       * up in this.state.errors because if we don't stub setState(), it will
       * trigger componentDidUpdate() which calls
       * fetchResourceTemplatesFromGroups() again which calls setState() again,
       * ad infinitum.
       */
      const setStateSpy = jest.spyOn(wrapper2.instance(), 'setState').mockReturnValue(null)

      await wrapper2.instance().fetchResourceTemplatesFromGroups()

      expect(setStateFromServerResponseSpy).not.toHaveBeenCalled()
      expect(setStateSpy).toHaveBeenCalledWith({
        errors: ['uh oh!'],
      })
    })
  })

  describe('display', () => {
    const renderRoutes = () => mount(<SinopiaResourceTemplates messages={[]}/>)

    it('renders the table of resource templates with name, id, author, and guiding statement columns', () => {
      expect.assertions(1)

      const component = renderRoutes()
      const tableHeaderCellText = component.find('table#resource-template-list th').map(thWrapper => thWrapper.text())
      expect(tableHeaderCellText).toEqual(['Template name', 'ID', 'Author', 'Guiding statement'])
    })

    afterAll(() => {
      renderRoutes.unmount()
    })
  })

  describe('setStateFromServerResponse()', () => {
    it('calls getResourceTemplate() once when passed a string', async () => {
      expect.assertions(2)
      const getResourceTemplateSpy = jest.fn().mockReturnValue({
        response: {
          body: {
            id: 'foo',
            resourceLabel: 'bar',
          },
        },
      })

      getResourceTemplate.mockImplementation(async () => getResourceTemplateSpy())

      const wrapper2 = shallow(<SinopiaResourceTemplates messages={messages} />)
      const setStateSpy = jest.spyOn(wrapper2.instance(), 'setState').mockReturnValue(null)

      await wrapper2.instance().setStateFromServerResponse('ld4p', 'template1')

      expect(getResourceTemplateSpy.mock.calls.length).toEqual(1)
      expect(setStateSpy).toHaveBeenCalledTimes(1)
    })

    it('calls getResourceTemplate n times where n is the length of the array passed in', async () => {
      expect.assertions(2)
      const getResourceTemplateSpy = jest.fn().mockReturnValue({
        response: {
          body: {
            id: 'foo',
            resourceLabel: 'bar',
          },
        },
      })

      getResourceTemplate.mockImplementation(async () => getResourceTemplateSpy())

      const wrapper2 = shallow(<SinopiaResourceTemplates messages={messages} />)
      const setStateSpy = jest.spyOn(wrapper2.instance(), 'setState').mockReturnValue(null)

      await wrapper2.instance().setStateFromServerResponse('ld4p', ['template1', 'template2', 'template3'])

      expect(getResourceTemplateSpy.mock.calls.length).toEqual(3)
      expect(setStateSpy).toHaveBeenCalledTimes(3)
    })

    it('does not add templates to state if they already exist', async () => {
      expect.assertions(2)
      const getResourceTemplateSpy = jest.fn().mockReturnValue({
        response: {
          body: {
            id: 'foo',
            resourceLabel: 'bar',
          },
        },
      })

      getResourceTemplate.mockImplementation(async () => getResourceTemplateSpy())

      const wrapper2 = shallow(<SinopiaResourceTemplates messages={messages} />)
      const existingTemplates = [
        {
          key: 'foo',
          name: 'baz',
          uri: 'template99',
          id: 'bar',
          author: 'wright.lee.renønd',
          remark: 'very salient information',
        },
      ]

      wrapper2.setState({
        resourceTemplates: existingTemplates,
      })
      // Prevent setState() from being called for reals. See above for rationale.
      wrapper2.instance().setState = jest.fn().mockReturnValue(null)

      await wrapper2.instance().setStateFromServerResponse('ld4p', ['template3'])

      expect(getResourceTemplateSpy.mock.calls.length).toEqual(1)
      // Failure condition would be if the size of the array changed or if name were 'bar'
      expect(wrapper2.state().resourceTemplates).toEqual(existingTemplates)
    })
  })

  describe('linking back to the Editor component', () => {
    const cell = 'Note'
    const row = {
      name: 'Note',
      uri: 'http://localhost:8080/repository/ld4p/Note',
      id: 'ld4p:resourceTemplate:bf2:Note',
      author: 'wright.lee.renønd',
      remark: 'very salient information',
    }

    const wrapper4 = shallow(<SinopiaResourceTemplates messages={messages}/>)

    it('renders a link to the Editor with the id of the resource template to fetch', async () => {
      expect.assertions(2)
      const link = await wrapper4.instance().linkFormatter(cell, row)

      await expect(link.props.to.pathname).toEqual('/editor')
      await expect(link.props.to.state.resourceTemplateId).toEqual(row.id)
    })
  })
})
