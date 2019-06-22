// Copyright 2018, 2019 Stanford University see LICENSE for license

import React from 'react'
import 'jsdom-global/register'
import { shallow } from 'enzyme'
import shortid from 'shortid'
import { ResourceTemplateForm } from 'components/editor/ResourceTemplateForm'

describe('<ResourceTemplateForm /> functional testing', () => {
  const basicRt = { resourceURI: 'http://schema.org/name' }
  const basicWrapper = shallow(<ResourceTemplateForm propertyTemplates={[]}
                                                     rtId={'resource:schema:Name'}
                                                     resourceTemplate={ basicRt } />)

  shortid.generate = jest.fn().mockReturnValue('abcd45')

  describe('resourceTemplateFields expectations and outputs', () => {
    it('empty array, null, or undefined resource templates', () => {
      expect(basicWrapper.instance().resourceTemplateFields([])).toEqual([])
      expect(basicWrapper.instance().resourceTemplateFields(null)).toEqual([])
      expect(basicWrapper.instance().resourceTemplateFields()).toEqual([])
    })

    it('resourceTemplateFields returns an array with one <PropertyResourceTemplate /> and has expected Redux state', () => {
      basicWrapper.instance().setState({
        nestedResourceTemplates: [
          {
            id: 'resourceTemplate:bf2:Note',
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
            resourceLabel: 'Note',
            propertyTemplates: [
              {
                propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
                propertyLabel: 'Note',
                mandatory: 'false',
                repeatable: 'false',
                type: 'literal',
                resourceTemplates: [],
                valueConstraint: {
                  valueTemplateRefs: [],
                },
              },
            ],
          },
        ],
      })
      const result = basicWrapper.instance().resourceTemplateFields(
        ['resourceTemplate:bf2:Note'],
        {
          propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
          repeatable: 'true',
        },
      )

      expect(result[0].props.reduxPath).toEqual([
        'resource',
        'resource:schema:Name',
        'http://www.w3.org/2000/01/rdf-schema#label',
        'abcd45',
        'resourceTemplate:bf2:Note'])
    })
  })
})

const mockResponse = (status, statusText, response) => new Response(response, {
  status,
  statusText,
  headers: {
    'Content-type': 'application/json',
  },
}).body

const responseBody = [{
  response: {
    body: {
      id: 'resourceTemplate:bf2:Note',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
      resourceLabel: 'Note',
      propertyTemplates: [
        {
          propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
          propertyLabel: 'Note',
          mandatory: 'false',
          repeatable: 'false',
          type: 'literal',
          resourceTemplates: [],
          valueConstraint: {
            valueTemplateRefs: [],
            useValuesFrom: [],
            valueDataType: {},
            editable: 'true',
            repeatable: 'false',
            defaults: [],
          },
        },
      ],
    },
  },
}]

const rtTest = { resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work' }

describe('<ResourceTemplateForm /> after fetching data from sinopia server', () => {
  const mockAsyncCall = (index) => {
    const response = mockResponse(200, null, responseBody[index])


    return response
  }
  const promises = Promise.all([mockAsyncCall(0)])

  describe('configured component types', () => {
    it('renders a lookup component', async () => {
      const rtProps = {
        propertyTemplates: [
          {
            propertyLabel: 'Look up, look down',
            type: 'lookup',
            editable: 'do not override me!',
            repeatable: 'do not override me!',
            mandatory: 'do not override me!',
            valueConstraint: {
              useValuesFrom: [
                'urn:ld4p:qa:names:person',
              ],
            },
          },
        ],
      }

      const wrapper = shallow(<ResourceTemplateForm {...rtProps} resourceTemplate = {rtTest}/>)

      expect.assertions(3)
      const instance = await wrapper.instance()

      await instance.fulfillRTPromises(promises).then(() => wrapper.update())
      expect(wrapper.find('div.ResourceTemplateForm PropertyComponent').length).toEqual(1)
      const inputType = wrapper.find('PropertyComponent').dive()

      expect(inputType.find('Connect(InputLookupQA)').length).toEqual(1)
      expect(inputType.find('Connect(InputListLOC)').length).toEqual(0)
    })

    it('renders a list component', async () => {
      const rtProps = {
        propertyTemplates: [
          {
            propertyLabel: 'What\'s the frequency Kenneth?',
            type: 'resource',
            valueConstraint: {
              useValuesFrom: [
                'https://id.loc.gov/vocabulary/frequencies',
              ],
            },
          },
        ],
      }

      const wrapper = shallow(<ResourceTemplateForm {...rtProps} resourceTemplate = {rtTest}/>)

      expect.assertions(3)
      const instance = await wrapper.instance()

      await instance.fulfillRTPromises(promises).then(() => wrapper.update())
      expect(wrapper.find('div.ResourceTemplateForm PropertyComponent').length).toEqual(1)
      const inputType = wrapper.find('PropertyComponent').dive()

      expect(inputType.find('Connect(InputListLOC)').length).toEqual(1)
      expect(inputType.find('Connect(InputLookupQA)').length).toEqual(0)
    })
  })

  it('renders InputLiteral nested component (b/c we have a property of type "literal")', async () => {
    const rtProps = {
      propertyTemplates: [
        {
          propertyLabel: 'Literally',
          type: 'literal',
        },
      ],
    }

    const wrapper = shallow(<ResourceTemplateForm {...rtProps} resourceTemplate = {rtTest}/>)

    expect.assertions(3)
    const instance = await wrapper.instance()

    await instance.fulfillRTPromises(promises).then(() => wrapper.update())
    expect(wrapper.find('div.ResourceTemplateForm PropertyComponent').length).toEqual(1)
    const inputType = wrapper.find('PropertyComponent').dive()

    expect(inputType.find('Connect(InputLiteral)').length).toEqual(1)
    expect(inputType.find('Connect(InputListLOC)').length).toEqual(0)
  })

  const rtProps = {
    propertyTemplates: [
      {
        propertyLabel: 'Literally',
        type: 'literal',
      },
      {
        propertyLabel: 'Look up, look down',
        type: 'lookup',
        editable: 'do not override me!',
        repeatable: 'do not override me!',
        mandatory: 'do not override me!',
        valueConstraint: {
          useValuesFrom: [
            'urn:ld4p:qa:names:person',
          ],
        },
      },
      {
        propertyLabel: 'What\'s the frequency Kenneth?',
        type: 'resource',
        valueConstraint: {
          useValuesFrom: [
            'https://id.loc.gov/vocabulary/frequencies',
          ],
        },
      },
      {
        propertyLabel: 'Chain chain chains',
        type: 'resource',
        valueConstraint: {
          valueTemplateRefs: [
            'resourceTemplate:bf2:Note',
          ],
        },
        mandatory: 'true',
      },
      {
        propertyLabel: 'YAM (yet another modal)',
        type: 'resource',
        valueConstraint: {
          valueTemplateRefs: [
            'resourceTemplate:bf2:Note',
          ],
        },
      },
      {
        propertyLabel: 'Non-modal resource',
        type: 'resource',
      },
    ],
  }

  const wrapper = shallow(<ResourceTemplateForm {...rtProps} resourceTemplate = {rtTest}/>)

  it('<form> does not contain redundant form attribute', () => {
    expect(wrapper.find('form[role="form"]').length).toEqual(0)
  })

  it('sets mandatory, editable and repeatable to the default values, if they are not specified', () => {
    wrapper.instance().defaultValues()
    wrapper.instance().forceUpdate()
    expect(rtProps.propertyTemplates[0].mandatory).toBe('true')
    expect(rtProps.propertyTemplates[0].repeatable).toBe('false')
    expect(rtProps.propertyTemplates[0].editable).toBe('true')
  })

  it('does not override "mandatory", "repeatable", or "editable" that has already been specified', () => {
    wrapper.instance().defaultValues()
    wrapper.instance().forceUpdate()
    expect(rtProps.propertyTemplates[1].mandatory).toBe('do not override me!')
    expect(rtProps.propertyTemplates[1].repeatable).toBe('do not override me!')
    expect(rtProps.propertyTemplates[1].editable).toBe('do not override me!')
  })

  it('displays a PropertyRemark when a remark is present', () => {
    wrapper.instance().props.propertyTemplates[2].remark = 'https://www.youtube.com/watch?v=jWkMhCLkVOg'
    wrapper.instance().forceUpdate()
    const propertyRemark = wrapper.find('label > PropertyRemark')

    expect(propertyRemark).toBeTruthy()
  })
})

describe('when there are no findable nested resource templates', () => {
  const mockAsyncCall = () => {
    const response = mockResponse(200, null, undefined)


    return response
  }
  const promises = Promise.all([mockAsyncCall])

  const rtProps = {
    propertyTemplates: [
      {
        propertyLabel: 'Look up, look down',
        type: 'lookup',
        editable: 'do not override me!',
        repeatable: 'do not override me!',
        mandatory: 'do not override me!',
        valueConstraint: {
          useValuesFrom: [
            'urn:ld4p:qa:names:person',
          ],
        },
      },
      {
        propertyLabel: 'Chain chain chains',
        type: 'resource',
        valueConstraint: {
          valueTemplateRefs: [
            'resourceTemplate:bf2:Note',
          ],
        },
        mandatory: 'true',
      },
      {
        propertyLabel: 'YAM (yet another modal)',
        type: 'resource',
        valueConstraint: {
          valueTemplateRefs: [
            'resourceTemplate:bf2:Note',
          ],
        },
      },
    ],
  }

  const wrapper = shallow(<ResourceTemplateForm {...rtProps} resourceTemplate = {rtTest}/>)

  it('renders error alert box', async () => {
    expect.assertions(3)
    const instance = await wrapper.instance()

    await instance.fulfillRTPromises(promises).then(() => wrapper.update())

    expect(await wrapper.state('templateError')).toBeTruthy()

    const errorEl = wrapper.find('div.alert')

    expect(errorEl).toHaveLength(1)
    expect(errorEl.text()).toMatch('There are missing resource templates required by resource template: http://id.loc.gov/ontologies/bibframe/Work.Please make sure all referenced templates in property template are uploaded first.')
  })
})
