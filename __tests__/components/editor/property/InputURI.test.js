import React from 'react'
import { fireEvent, waitForElement, wait } from '@testing-library/react'
import InputURI from 'components/editor/property/InputURI'
import {
  renderWithRedux, assertRDF, createReduxStore, setupModal,
} from 'testUtils'
import { showValidationErrors, validateResource } from 'actions/index'

const createInitialState = (options = {}) => {
  const state = {
    selectorReducer: {
      resource: {
        'resourceTemplate:bf2:WorkURI': {
          'http://id.loc.gov/ontologies/bibframe/mainTitleURI': {
          },
        },
      },
      entities: {
        languages: {
          options: [{
            id: 'en',
            label: 'English',
          }],
        },
        resourceTemplates: {
          'resourceTemplate:bf2:WorkURI': {
            id: 'resourceTemplate:bf2:WorkURI',
            resourceLabel: 'Work URI',
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/TitleURI',
            propertyTemplates: [
              {
                propertyURI: 'http://id.loc.gov/ontologies/bibframe/mainTitleURI',
                propertyLabel: 'Preferred URI for Work',
                remark: 'http://access.rdatoolkit.org/rdachp6_rda6-2036.html',
                mandatory: 'false',
                repeatable: 'true',
                type: 'resource',
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
        },
      },
      editor: {
        resourceValidation: {
          show: false,
          errors: [],
          errorsByPath: {},
        },
        modal: {
          name: undefined,
        },
      },
    },
  }

  if (options.hasInitialValue) {
    const items = {
      Uv8UAARr8: {
        uri: 'http://foo',
      },
    }
    state.selectorReducer.resource['resourceTemplate:bf2:WorkURI']['http://id.loc.gov/ontologies/bibframe/mainTitleURI'].items = items
  }
  if (options.mandatory) {
    state.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:WorkURI'].propertyTemplates[0].mandatory = 'true'
  }
  if (options.repeatable) {
    state.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:WorkURI'].propertyTemplates[0].repeatable = 'true'
  }
  return state
}

const reduxPath = [
  'resource',
  'resourceTemplate:bf2:WorkURI',
  'http://id.loc.gov/ontologies/bibframe/mainTitleURI',
]

describe('InputURI', () => {
  setupModal()

  it('renders when no value', () => {
    const store = createReduxStore(createInitialState())
    const { container, getByPlaceholderText, queryByText } = renderWithRedux(
      <InputURI reduxPath={reduxPath} />, store,
    )
    // The input box is present.
    expect(getByPlaceholderText('Preferred URI for Work')).toBeInTheDocument()
    // Not required.
    expect(queryByText('Required')).not.toBeInTheDocument()
    expect(getByPlaceholderText('Preferred URI for Work')).not.toHaveAttribute('required')
    // No existing values are present. This sort of a query isn't recommended but since testing for absence, seems OK.
    expect(container.querySelector('.rbt-token')).not.toBeInTheDocument()
  })

  it('renders existing value', () => {
    const store = createReduxStore(createInitialState({ hasInitialValue: true }))
    const { getByText, getByPlaceholderText } = renderWithRedux(
      <InputURI reduxPath={reduxPath} />, store,
    )
    // The input box is present.
    expect(getByPlaceholderText('Preferred URI for Work')).toBeInTheDocument()
    // The URI is displayed
    expect(getByText('http://foo')).toBeInTheDocument()
  })

  it('handles entering non-repeatable value', async () => {
    const store = createReduxStore(createInitialState())
    const { getByPlaceholderText, getByText } = renderWithRedux(
      <InputURI reduxPath={reduxPath} />, store,
    )

    // Add a value
    fireEvent.change(getByPlaceholderText('Preferred URI for Work'), { target: { value: 'http://foo' } })
    fireEvent.keyPress(getByPlaceholderText('Preferred URI for Work'), { key: 'Enter', code: 13, charCode: 13 })

    // Verify the value
    await waitForElement(() => getByText('Edit'))
    expect(getByText('http://foo')).toBeInTheDocument()
    expect(getByText('×')).toBeInTheDocument()

    // Input is disabled
    expect(getByPlaceholderText('Preferred URI for Work')).toBeDisabled
  })

  it('handles entering value and changing focus', async () => {
    const store = createReduxStore(createInitialState())
    const { getByPlaceholderText, getByText } = renderWithRedux(
      <InputURI reduxPath={reduxPath} />, store,
    )

    // Add a value
    fireEvent.change(getByPlaceholderText('Preferred URI for Work'), { target: { value: 'http://foo' } })
    fireEvent.blur(getByPlaceholderText('Preferred URI for Work'))

    // Verify the value
    await waitForElement(() => getByText('Edit'))
    expect(getByText('http://foo')).toBeInTheDocument()
    expect(getByText('×')).toBeInTheDocument()
  })

  it('handles entering repeatable values', async () => {
    const store = createReduxStore(createInitialState({ repeatable: true }))
    const { getByPlaceholderText, getByText, getAllByText } = renderWithRedux(
      <InputURI reduxPath={reduxPath} />, store,
    )

    // Add values
    fireEvent.change(getByPlaceholderText('Preferred URI for Work'), { target: { value: 'http://foo' } })
    fireEvent.keyPress(getByPlaceholderText('Preferred URI for Work'), { key: 'Enter', code: 13, charCode: 13 })

    fireEvent.change(getByPlaceholderText('Preferred URI for Work'), { target: { value: 'http://bar' } })
    fireEvent.keyPress(getByPlaceholderText('Preferred URI for Work'), { key: 'Enter', code: 13, charCode: 13 })


    // Verify the value
    await waitForElement(() => getByText('http://bar'))
    expect(getByText('http://foo')).toBeInTheDocument()
    expect(getAllByText('×')).toHaveLength(2)

    // Input is not disabled
    expect(getByPlaceholderText('Preferred URI for Work')).not.toBeDisabled
  })

  it('warns when not entering a URI', async () => {
    const store = createReduxStore(createInitialState())
    const { getByPlaceholderText, getByText } = renderWithRedux(
      <InputURI reduxPath={reduxPath} />, store,
    )

    // Add a value
    fireEvent.change(getByPlaceholderText('Preferred URI for Work'), { target: { value: 'foo' } })
    fireEvent.keyPress(getByPlaceholderText('Preferred URI for Work'), { key: 'Enter', code: 13, charCode: 13 })

    // Warning
    await waitForElement(() => getByText('Not a valid URI.'))
  })


  it('allows deleting a value', async () => {
    const store = createReduxStore(createInitialState({ hasInitialValue: true }))
    const { getByText, queryByText } = renderWithRedux(
      <InputURI reduxPath={reduxPath} />, store,
    )
    expect(getByText('http://foo')).toBeInTheDocument()

    // Delete the value
    fireEvent.click(getByText('×'))

    // Verify the value is removed
    await wait(() => expect(queryByText('http://foo')).not.toBeInTheDocument())
  })

  it('allows editing a value', async () => {
    const store = createReduxStore(createInitialState({ hasInitialValue: true }))
    const { getByText, queryByText, getByDisplayValue } = renderWithRedux(
      <InputURI reduxPath={reduxPath} />, store,
    )
    expect(getByText('http://foo')).toBeInTheDocument()

    // Edit the value
    fireEvent.click(getByText('Edit'))

    await wait(() => expect(queryByText('Edit')).not.toBeInTheDocument())

    const input = getByDisplayValue('http://foo')
    expect(input).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'http://bar' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    // Verify the value
    await waitForElement(() => getByText('Edit'))
    expect(getByText('http://bar')).toBeInTheDocument()
    expect(queryByText('http://foo')).not.toBeInTheDocument()
    expect(getByText('×')).toBeInTheDocument()
  })

  it('validates when mandatory', async () => {
    const store = createReduxStore(createInitialState({ mandatory: true }))
    const { getByText, queryByText, getByPlaceholderText } = renderWithRedux(
      <InputURI reduxPath={reduxPath} />, store,
    )

    expect(getByPlaceholderText('Preferred URI for Work')).toHaveAttribute('required')
    expect(queryByText('Required')).not.toBeInTheDocument()

    // Trigger validation
    store.dispatch(validateResource())
    store.dispatch(showValidationErrors())

    await waitForElement(() => getByText('Required'))
  })

  it('produces expected triples for a single value', async () => {
    const store = createReduxStore(createInitialState())
    const { getByPlaceholderText, getByText } = renderWithRedux(
      <InputURI reduxPath={reduxPath} />, store,
    )

    // Add a value
    fireEvent.change(getByPlaceholderText('Preferred URI for Work'), { target: { value: 'http://foo' } })
    fireEvent.keyPress(getByPlaceholderText('Preferred URI for Work'), { key: 'Enter', code: 13, charCode: 13 })

    // Verify the value
    await waitForElement(() => getByText('Edit'))

    // Render an RDFModal
    await assertRDF(store, [
      '<> <http://id.loc.gov/ontologies/bibframe/mainTitleURI> <http://foo> .',
      '<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:WorkURI" .',
      '<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/TitleURI> .',
    ])
  })

  it('produces expected triples for repeated values', async () => {
    const store = createReduxStore(createInitialState({ repeatable: true }))
    const { getByPlaceholderText, getByText } = renderWithRedux(
      <InputURI reduxPath={reduxPath} />, store,
    )

    // Add a value
    fireEvent.change(getByPlaceholderText('Preferred URI for Work'), { target: { value: 'http://foo' } })
    fireEvent.keyPress(getByPlaceholderText('Preferred URI for Work'), { key: 'Enter', code: 13, charCode: 13 })

    fireEvent.change(getByPlaceholderText('Preferred URI for Work'), { target: { value: 'http://bar' } })
    fireEvent.keyPress(getByPlaceholderText('Preferred URI for Work'), { key: 'Enter', code: 13, charCode: 13 })

    // Verify the value
    await waitForElement(() => getByText('http://bar'))

    // Render an RDFModal
    await assertRDF(store, [
      '<> <http://id.loc.gov/ontologies/bibframe/mainTitleURI> <http://foo> .',
      '<> <http://id.loc.gov/ontologies/bibframe/mainTitleURI> <http://bar> .',
      '<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:WorkURI" .',
      '<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/TitleURI> .',
    ])
  })
})
