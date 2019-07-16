// Copyright 2018, 2019 Stanford University see LICENSE for license

import React from 'react'
import 'jsdom-global/register'
import { shallow } from 'enzyme'
import ResourceTemplateForm from 'components/editor/ResourceTemplateForm'

describe('<ResourceTemplateForm /> functional testing', () => {
  const resourceProperties = {
    'http://id.loc.gov/ontologies/bibframe/title': {
      abc123: {
        'myOrg:rt:myTemplate': {
          'http://example.com/foo/1': {

          },
        },
      },
    },
  }

  const basicWrapper = shallow(<ResourceTemplateForm.WrappedComponent propertyTemplates={[]}
                                                                      resourceTemplateId={'myOrg:rt:myTemplate'}
                                                                      resourceProperties={ resourceProperties }
                                                                      reduxPath={ ['resource'] }/>)

  describe('resourceTemplateFields expectations and outputs', () => {
    it('empty array, null, or undefined resource templates', () => {
      expect(basicWrapper.instance().resourceTemplateFields([])).toEqual([])
      expect(basicWrapper.instance().resourceTemplateFields(null)).toEqual([])
      expect(basicWrapper.instance().resourceTemplateFields()).toEqual([])
    })

    it('resourceTemplateFields returns an array with one <PropertyResourceTemplate /> and has expected Redux state', () => {
      const result = basicWrapper.instance().resourceTemplateFields(
        ['myOrg:rt:myTemplate'],
        {
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/title',
          repeatable: 'true',
        },
      )

      expect(result[0].props.reduxPath).toEqual([
        'resource',
        'http://id.loc.gov/ontologies/bibframe/title',
        'abc123',
        'myOrg:rt:myTemplate'])

      expect(result[0].props.index).toEqual(0)
    })
  })
})

describe('<ResourceTemplateForm /> after fetching data from sinopia server', () => {
  describe('configured component types', () => {
    it('renders a lookup component', async () => {
      const rtProps = {
        resourceTemplateId: 'myOrg:rt:myTemplate',
        propertyTemplates: [
          {
            propertyURI: 'http://example.com/fakeProperty',
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
        reduxPath: [],
        resourceProperties: {},
      }

      const wrapper = shallow(<ResourceTemplateForm.WrappedComponent {...rtProps} />)
      expect(wrapper.find('div.ResourceTemplateForm PropertyComponent').length).toEqual(1)
      const inputType = wrapper.find('PropertyComponent').dive()

      expect(inputType.find('Connect(InputLookupQA)').length).toEqual(1)
      expect(inputType.find('Connect(InputListLOC)').length).toEqual(0)
    })

    it('renders a list component', async () => {
      const rtProps = {
        resourceTemplateId: 'myOrg:rt:myTemplate',
        propertyTemplates: [
          {
            propertyLabel: 'What\'s the frequency Kenneth?',
            propertyURI: 'http://example.com/fakeProperty',
            type: 'resource',
            valueConstraint: {
              useValuesFrom: [
                'https://id.loc.gov/vocabulary/frequencies',
              ],
            },
          },
        ],
        reduxPath: [],
        resourceProperties: {},
      }

      const wrapper = shallow(<ResourceTemplateForm.WrappedComponent {...rtProps}/>)
      expect(wrapper.find('div.ResourceTemplateForm PropertyComponent').length).toEqual(1)
      const inputType = wrapper.find('PropertyComponent').dive()

      expect(inputType.find('Connect(InputListLOC)').length).toEqual(1)
      expect(inputType.find('Connect(InputLookupQA)').length).toEqual(0)
    })
  })

  it('renders InputLiteral nested component (b/c we have a property of type "literal")', async () => {
    const rtProps = {
      resourceTemplateId: 'myOrg:rt:myTemplate',
      propertyTemplates: [
        {
          propertyLabel: 'Literally',
          propertyURI: 'http://example.com/fakeProperty',
          type: 'literal',
        },
      ],
      resourceProperties: {},
      reduxPath: [],
    }

    const wrapper = shallow(<ResourceTemplateForm.WrappedComponent {...rtProps}/>)
    expect(wrapper.find('div.ResourceTemplateForm PropertyComponent').length).toEqual(1)
    const inputType = wrapper.find('PropertyComponent').dive()

    expect(inputType.find('Connect(InputLiteral)').length).toEqual(1)
    expect(inputType.find('Connect(InputListLOC)').length).toEqual(0)
  })

  const rtProps = {
    resourceTemplateId: 'myOrg:rt:myTemplate',
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

  const wrapper = shallow(<ResourceTemplateForm.WrappedComponent {...rtProps}/>)

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
