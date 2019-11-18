import React from 'react'
import {
  fireEvent, getByText as getByTextContainer,
} from '@testing-library/react'
import PropertyTemplateOutline from 'components/editor/property/PropertyTemplateOutline'
import {
  renderWithRedux, createReduxStore, createBlankState,
} from 'testUtils'

const createInitialState = () => {
  const state = createBlankState()
  state.selectorReducer.editor.currentResource = 'abc123'
  state.selectorReducer.entities.resources.abc123 = {
    'resourceTemplate:bf2:Monograph:Work': {
      'http://id.loc.gov/ontologies/bibframe/title': {},
      'http://id.loc.gov/ontologies/bibframe/temporalCoverage': {},
    },
  }
  state.selectorReducer.entities.resourceTemplates = {
    'resourceTemplate:bf2:Monograph:Work': {
      id: 'resourceTemplate:bf2:Monograph:Work',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
      resourceLabel: 'BIBFRAME Work',
      propertyTemplates: [
        {
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/title',
          propertyLabel: 'Title Information',
          mandatory: 'false',
          repeatable: 'true',
          type: 'resource',
          resourceTemplates: [],
          valueConstraint: {
            valueTemplateRefs: [
              'resourceTemplate:bf2:WorkTitle',
            ],
            useValuesFrom: [],
            valueDataType: {},
            defaults: [],
          },
        },
        {
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/temporalCoverage',
          propertyLabel: '(Time) Coverage of the Content (RDA 7.3)',
          remark: 'http://access.rdatoolkit.org/7.3.html',
          mandatory: 'false',
          repeatable: 'true',
          type: 'literal',
          resourceTemplates: [],
          valueConstraint: {
            valueTemplateRefs: [],
            useValuesFrom: [],
            valueDataType: {},
            defaults: [],
          },
        },
      ],
    },
    'resourceTemplate:bf2:WorkTitle': {
      id: 'resourceTemplate:bf2:WorkTitle',
      resourceLabel: 'Work Title',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Title',
      propertyTemplates: [
        {
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
          propertyLabel: 'Preferred Title for Work (RDA 6.2.2, RDA 6.14.2) (BIBFRAME: Main title)',
          remark: 'http://access.rdatoolkit.org/rdachp6_rda6-2036.html',
          mandatory: 'false',
          repeatable: 'true',
          type: 'literal',
          resourceTemplates: [],
          valueConstraint: {
            valueTemplateRefs: [],
            useValuesFrom: [],
            valueDataType: {},
            defaults: [],
          },
        },
      ],
    },
  }
  return state
}

const titleReduxPath = [
  'entities', 'resources', 'abc123', 'resourceTemplate:bf2:Monograph:Work', 'http://id.loc.gov/ontologies/bibframe/title',
]

const temporalCoverageReduxPath = [
  'entities', 'resources', 'abc123', 'resourceTemplate:bf2:Monograph:Work', 'http://id.loc.gov/ontologies/bibframe/temporalCoverage',
]

describe('<PropertyTemplateOutline />', () => {
  describe('Property with value template ref', () => {
    it('renders and can be expanded', async () => {
      const store = createReduxStore(createInitialState())
      const { getByText, findByText, container } = renderWithRedux(
        <PropertyTemplateOutline reduxPath={titleReduxPath} />, store,
      )
      const addButton = getByText(/\+ Add/, { selector: 'button.btn-add' })
      expect(addButton).toBeInTheDocument()
      expect(getByTextContainer(addButton, 'Title Information')).toBeInTheDocument()

      fireEvent.click(addButton)

      expect(await findByText('Work Title', { selector: 'h5' })).toBeInTheDocument()
      expect(getByText('Add another Work Title', { selector: 'button.btn-add-another' })).toBeInTheDocument()

      expect(getByText('Remove', { selector: 'button.btn-remove' })).toBeInTheDocument()
      expect(container.querySelector('button.btn-toggle')).toBeInTheDocument()
    })
  })

  describe('Property without value template ref', () => {
    it('renders and can be expanded', async () => {
      const store = createReduxStore(createInitialState())
      const { getByText, findByPlaceholderText, container } = renderWithRedux(
        <PropertyTemplateOutline reduxPath={temporalCoverageReduxPath} />, store,
      )
      const addButton = getByText(/\+ Add/, { selector: 'button.btn-add' })
      expect(addButton).toBeInTheDocument()
      expect(getByTextContainer(addButton, '(Time) Coverage of the Content (RDA 7.3)')).toBeInTheDocument()

      fireEvent.click(addButton)

      expect(await findByPlaceholderText('(Time) Coverage of the Content (RDA 7.3)')).toBeInTheDocument()

      expect(getByText('Remove', { selector: 'button.btn-remove' })).toBeInTheDocument()
      expect(container.querySelector('button.btn-toggle')).toBeInTheDocument()
    })
  })
})
