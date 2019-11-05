// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import InputLookupQA from 'components/editor/property/InputLookupQA'
import { fireEvent, wait, waitForElement } from '@testing-library/react'
import { showValidationErrors, validateResource } from 'actions/index'
import {
  renderWithRedux, assertRDF, createReduxStore, setupModal,
} from 'testUtils'

const createInitialState = (options = {}) => {
  const state = {
    selectorReducer: {
      entities: {
        resourceTemplates: {
          'ld4p:RT:bf2:Agent:bfPerson': {
            propertyTemplates: [
              {
                repeatable: 'false',
                mandatory: 'true',
                type: 'lookup',
                valueConstraint: {
                  useValuesFrom: [
                    'urn:ld4p:qa:names',
                  ],
                },
                propertyLabel: 'Search LCNAF',
                propertyURI: 'http://id.loc.gov/ontologies/bibframe/Person',
                editable: 'true',
              },
            ],
            id: 'ld4p:RT:bf2:Agent:bfPerson',
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Person',
            resourceLabel: 'Bibframe Person',
            author: 'LD4P',
            date: '2019-08-19',
            schema: 'https://ld4p.github.io/sinopia/schemas/0.2.0/resource-template.json',
          },
        },
        qa: {
          loading: false,
          options: [],
        },
      },
      resource: {
        'ld4p:RT:bf2:Agent:bfPerson': {
          'http://id.loc.gov/ontologies/bibframe/Person': {
            items: {},
          },
          'http://www.w3.org/2000/01/rdf-schema#label': {},
        },
      },
      editor: {
        modal: {
          name: undefined,
        },
        resourceValidation: {
          show: false,
          errors: [],
          errorsByPath: {},
        },
        errors: [],
      },
    },
  }
  if (options.hasInitialValue) {
    const items = [
      {
        id: 'foo',
        label: 'foo',
        content: 'foo',
      },
    ]
    state.selectorReducer.resource['ld4p:RT:bf2:Agent:bfPerson']['http://id.loc.gov/ontologies/bibframe/Person'].items = items
  }
  if (options.repeatable) {
    state.selectorReducer.entities.resourceTemplates['ld4p:RT:bf2:Agent:bfPerson'].propertyTemplates[0].repeatable = 'true'
  }
  return state
}

setupModal()

const reduxPath = [
  'resource',
  'ld4p:RT:bf2:Agent:bfPerson',
  'http://id.loc.gov/ontologies/bibframe/Person',
]

describe('InputLookupQA', () => {
  it('renders when no value', () => {
    const store = createReduxStore(createInitialState())
    const { container, getByPlaceholderText } = renderWithRedux(
      <InputLookupQA reduxPath={reduxPath} />, store,
    )
    // The input box is present.
    expect(getByPlaceholderText('Search LCNAF')).toBeInTheDocument()
    // There is no initial value present
    expect(container.querySelector('.rbt-token')).not.toBeInTheDocument()
    // The typeahead's multiple attribute is always set to 'true' in order to always allow the tokenization
    expect(container.querySelector('.rbt-input-multi')).toBeInTheDocument()
  })

  it('renders existing value', () => {
    const store = createReduxStore(createInitialState({ hasInitialValue: true }))
    const { getByText } = renderWithRedux(
      <InputLookupQA reduxPath={reduxPath} />, store,
    )

    // The subject is displayed
    expect(getByText('foo')).toBeInTheDocument()
  })

  it('handles entering non-repeatable value', async () => {
    const store = createReduxStore(createInitialState())
    const {
      container, getByPlaceholderText, getByText, getAllByText, getByTestId,
    } = renderWithRedux(
      <InputLookupQA reduxPath={reduxPath} />, store,
    )

    // Add a value
    fireEvent.change(getByPlaceholderText('Search LCNAF'), { target: { value: 'foo' } })
    expect(getAllByText('foo')).toHaveLength(2)

    await waitForElement(() => getByTestId('customOption-link'))
    fireEvent.click(container.querySelector('li[data-testid="customOption-link"] a.dropdown-item'))

    // Verify the value
    expect(getByText('×')).toBeInTheDocument()

    // Input is disabled for multiple values
    expect(container.querySelector('input.rbt-input-main[disabled]')).toBeInTheDocument()
  })

  it('handles entering non-Roman value', async () => {
    const store = createReduxStore(createInitialState())
    const {
      container, getByPlaceholderText, getByText, getAllByText,
    } = renderWithRedux(
      <InputLookupQA reduxPath={reduxPath} />, store,
    )
    const artOfWar = '战争的艺术' // Chinese characters for Sun Tzu's Art of War

    // Add a value
    fireEvent.change(getByPlaceholderText('Search LCNAF'), { target: { value: artOfWar } })
    expect(getAllByText(artOfWar)).toHaveLength(2)

    await waitForElement(() => container.querySelector('a.dropdown-item'))
    await fireEvent.click(container.querySelector('a.dropdown-item'))

    // Verify the value
    expect(getByText('×')).toBeInTheDocument()
  })

  it('handles entering repeatable values', async () => {
    const store = createReduxStore(createInitialState({ repeatable: true }))
    const {
      container, getByPlaceholderText, getByText, getAllByText, getByTestId,
    } = renderWithRedux(
      <InputLookupQA reduxPath={reduxPath} />, store,
    )

    // Add values
    fireEvent.change(getByPlaceholderText('Search LCNAF'), { target: { value: 'foo' } })
    expect(getAllByText('foo')).toHaveLength(2)

    await waitForElement(() => getByTestId('customOption-link'))
    fireEvent.click(container.querySelector('li[data-testid="customOption-link"] a.dropdown-item'))

    // Verify the value
    expect(getByText('foo')).toBeInTheDocument()

    // Input is disabled for multiple values
    expect(container.querySelector('input.rbt-input-main[disabled]')).not.toBeInTheDocument()

    fireEvent.change(container.querySelector('input.rbt-input-main'), { target: { value: 'bar' } })
    expect(getAllByText('bar')).toHaveLength(2)

    await waitForElement(() => getByTestId('customOption-link'))
    fireEvent.click(container.querySelector('li[data-testid="customOption-link"] a.dropdown-item'))

    // Verify the value
    expect(getByText('bar')).toBeInTheDocument()
    expect(getAllByText('×')).toHaveLength(2)
  })

  it('allows deleting a value', async () => {
    const store = createReduxStore(createInitialState({ hasInitialValue: true }))
    const { getByText, queryByText } = renderWithRedux(
      <InputLookupQA reduxPath={reduxPath} />, store,
    )
    expect(getByText('foo')).toBeInTheDocument()

    // Delete the value
    fireEvent.click(getByText('×'))

    // Verify the value is removed
    await wait(() => expect(queryByText('foo')).not.toBeInTheDocument())
  })

  it('validates when mandatory', async () => {
    const store = createReduxStore(createInitialState())
    const { getByText } = renderWithRedux(
      <InputLookupQA reduxPath={reduxPath} />, store,
    )

    // Trigger validation
    store.dispatch(validateResource())
    store.dispatch(showValidationErrors())

    await waitForElement(() => getByText('Required'))
  })

  // Testing the RDF is in the spirit of testing what the user expects from interacting with this component.
  it('produces expected triples for a single value', async () => {
    const store = createReduxStore(createInitialState())
    const {
      container, getByPlaceholderText, getByText, getAllByText, getByTestId,
    } = renderWithRedux(
      <InputLookupQA reduxPath={reduxPath} />, store,
    )

    // Add a value
    fireEvent.change(getByPlaceholderText('Search LCNAF'), { target: { value: 'foo' } })
    expect(getAllByText('foo')).toHaveLength(2)

    await waitForElement(() => getByTestId('customOption-link'))
    fireEvent.click(container.querySelector('li[data-testid="customOption-link"] a.dropdown-item'))

    // Verify the value
    await waitForElement(() => getByText('foo'))

    // Render an RDFModal
    await assertRDF(store, [
      '<> <http://id.loc.gov/ontologies/bibframe/Person> "foo"',
      '<> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:Agent:bfPerson" .',
      '<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Person> .',
    ])
  })

  it('produces expected triples for repeated values', async () => {
    const store = createReduxStore(createInitialState())
    const {
      container, getByPlaceholderText, getByText, getByTestId,
    } = renderWithRedux(
      <InputLookupQA reduxPath={reduxPath} />, store,
    )

    // Add a value
    fireEvent.change(getByPlaceholderText('Search LCNAF'), { target: { value: 'foo' } })
    await waitForElement(() => getByTestId('customOption-link'))
    fireEvent.click(container.querySelector('li[data-testid="customOption-link"] a.dropdown-item'))

    // Verify the value
    await waitForElement(() => getByText('foo'))

    // Add another value
    fireEvent.change(container.querySelector('input.rbt-input-main'), { target: { value: 'bar' } })
    await waitForElement(() => getByTestId('customOption-link'))
    fireEvent.click(container.querySelector('li[data-testid="customOption-link"] a.dropdown-item'))

    // Verify the value
    await waitForElement(() => getByText('bar'))

    // Render an RDFModal
    await assertRDF(store, [
      '<> <http://id.loc.gov/ontologies/bibframe/Person> "foo"',
      '<> <http://id.loc.gov/ontologies/bibframe/Person> "bar"',
      '<> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:Agent:bfPerson" .',
      '<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Person> .',
    ])
  })
})
