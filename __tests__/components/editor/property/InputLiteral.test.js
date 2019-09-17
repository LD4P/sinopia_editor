import React from 'react'
import { createStore } from 'redux'
import { fireEvent, waitForElement, wait } from '@testing-library/react'
import InputLiteral from 'components/editor/property/InputLiteral'
import appReducer from 'reducers/index'
import { showGroupChooser } from 'actions/index'
import { renderWithRedux, assertRDF } from 'testUtils'

// Testing principles:
// * Test what the user sees / interacts with. User = [cataloger, developer plugging in componet]
// * Don't test implementation details. Implementation details ⊃ [component state, redux state]

// Note: Testing language should be done in InputLang.
// Note: Defaults are handled when constructing the state, not by the InputLiteral component.

const createInitialState = (options = {}) => {
  const state = {
    selectorReducer: {
      resource: {
        'resourceTemplate:bf2:WorkTitle': {
          'http://id.loc.gov/ontologies/bibframe/mainTitle': {
            items: {},
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
          'resourceTemplate:bf2:WorkTitle': {
            id: 'resourceTemplate:bf2:WorkTitle',
            resourceLabel: 'Work Title',
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Title',
            propertyTemplates: [
              {
                propertyURI: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
                propertyLabel: 'Preferred Title for Work',
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
        },
      },
      editor: {
        resourceValidationErrors: {},
        rdfPreview: {
          show: true,
        },
      },
    },
  }

  if (options.hasInitialValue) {
    const items = {
      Uv8UAARr8: {
        content: 'foo',
        lang: 'en',
      },
    }
    state.selectorReducer.resource['resourceTemplate:bf2:WorkTitle']['http://id.loc.gov/ontologies/bibframe/mainTitle'].items = items
  }
  if (options.mandatory) {
    state.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:WorkTitle'].propertyTemplates[0].mandatory = 'true'
  }
  if (options.repeatable) {
    state.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:WorkTitle'].propertyTemplates[0].repeatable = 'true'
  }
  return state
}

const reduxPath = [
  'resource',
  'resourceTemplate:bf2:WorkTitle',
  'http://id.loc.gov/ontologies/bibframe/mainTitle',
]

test('renders when no value', () => {
  const store = createStore(appReducer, createInitialState())
  const { container, getByPlaceholderText, queryByText } = renderWithRedux(
    <InputLiteral reduxPath={reduxPath} />, store,
  )
  // The input box is present.
  expect(getByPlaceholderText('Preferred Title for Work')).toBeInTheDocument
  // Not required.
  expect(queryByText('Required')).not.toBeInTheDocument
  expect(getByPlaceholderText('Preferred Title for Work')).not.toHaveAttribute('required')
  // No existing values are present. This sort of a query isn't recommended but since testing for absence, seems OK.
  expect(container.querySelector('.rbt-token')).not.toBeInTheDocument
})

test('renders existing value', () => {
  const store = createStore(appReducer, createInitialState({ hasInitialValue: true }))
  const { getByText, getByPlaceholderText } = renderWithRedux(
    <InputLiteral reduxPath={reduxPath} />, store,
  )
  // The input box is present.
  expect(getByPlaceholderText('Preferred Title for Work')).toBeInTheDocument
  // The title is displayed
  expect(getByText('foo')).toBeInTheDocument
  // The language is displayed
  expect(getByText('Language: English')).toBeInTheDocument
})

test('entering non-repeatable value', async () => {
  const store = createStore(appReducer, createInitialState())
  const { getByPlaceholderText, getByText } = renderWithRedux(
    <InputLiteral reduxPath={reduxPath} />, store,
  )

  // Add a value
  fireEvent.change(getByPlaceholderText('Preferred Title for Work'), { target: { value: 'foo' } })
  fireEvent.keyPress(getByPlaceholderText('Preferred Title for Work'), { key: 'Enter', code: 13, charCode: 13 })

  // Verify the value
  await waitForElement(() => getByText('Edit'))
  expect(getByText('foo')).toBeInTheDocument
  expect(getByText('×')).toBeInTheDocument
  expect(getByText('Language: English')).toBeInTheDocument

  // Input is disabled
  expect(getByPlaceholderText('Preferred Title for Work')).toBeDisabled
})

test('entering value and changing focus', async () => {
  const store = createStore(appReducer, createInitialState())
  const { getByPlaceholderText, getByText } = renderWithRedux(
    <InputLiteral reduxPath={reduxPath} />, store,
  )

  // Add a value
  fireEvent.change(getByPlaceholderText('Preferred Title for Work'), { target: { value: 'foo' } })
  fireEvent.blur(getByPlaceholderText('Preferred Title for Work'))

  // Verify the value
  await waitForElement(() => getByText('Edit'))
  expect(getByText('foo')).toBeInTheDocument
  expect(getByText('×')).toBeInTheDocument
  expect(getByText('Language: English')).toBeInTheDocument
})

test('entering non-Roman value', async () => {
  const store = createStore(appReducer, createInitialState())
  const { getByPlaceholderText, getByText } = renderWithRedux(
    <InputLiteral reduxPath={reduxPath} />, store,
  )
  const artOfWar = '战争的艺术' // Chinese characters for Sun Tzu's Art of War

  // Add a value
  fireEvent.change(getByPlaceholderText('Preferred Title for Work'), { target: { value: artOfWar } })
  fireEvent.keyPress(getByPlaceholderText('Preferred Title for Work'), { key: 'Enter', code: 13, charCode: 13 })

  // Verify the value
  await waitForElement(() => getByText('Edit'))
  expect(getByText(artOfWar)).toBeInTheDocument
  expect(getByText('×')).toBeInTheDocument
  expect(getByText('Language: English')).toBeInTheDocument
})


test('entering repeatable values', async () => {
  const store = createStore(appReducer, createInitialState({ repeatable: true }))
  const { getByPlaceholderText, getByText, getAllByText } = renderWithRedux(
    <InputLiteral reduxPath={reduxPath} />, store,
  )

  // Add values
  fireEvent.change(getByPlaceholderText('Preferred Title for Work'), { target: { value: 'foo' } })
  fireEvent.keyPress(getByPlaceholderText('Preferred Title for Work'), { key: 'Enter', code: 13, charCode: 13 })

  fireEvent.change(getByPlaceholderText('Preferred Title for Work'), { target: { value: 'bar' } })
  fireEvent.keyPress(getByPlaceholderText('Preferred Title for Work'), { key: 'Enter', code: 13, charCode: 13 })


  // Verify the value
  await waitForElement(() => getByText('bar'))
  expect(getByText('foo')).toBeInTheDocument
  expect(getAllByText('×')).toHaveLength(2)
  expect(getAllByText('Language: English')).toHaveLength(2)

  // Input is not disabled
  expect(getByPlaceholderText('Preferred Title for Work')).not.toBeDisabled
})

test('deleting a value', async () => {
  const store = createStore(appReducer, createInitialState({ hasInitialValue: true }))
  const { getByText, queryByText } = renderWithRedux(
    <InputLiteral reduxPath={reduxPath} />, store,
  )
  expect(getByText('foo')).toBeInTheDocument

  // Delete the value
  fireEvent.click(getByText('×'))

  // Verify the value is removed
  // Could not get waitForElementToBeRemoved to work here.
  // await waitForElementToBeRemoved(() => queryByText('foo'))
  await wait(() => expect(queryByText('foo')).not.toBeInTheDocument())
})

test('editing a value', async () => {
  const store = createStore(appReducer, createInitialState({ hasInitialValue: true }))
  const { getByText, queryByText, getByDisplayValue } = renderWithRedux(
    <InputLiteral reduxPath={reduxPath} />, store,
  )
  expect(getByText('foo')).toBeInTheDocument

  // Edit the value
  fireEvent.click(getByText('Edit'))

  await wait(() => expect(queryByText('Edit')).not.toBeInTheDocument())

  const input = getByDisplayValue('foo')
  expect(input).toBeInTheDocument

  fireEvent.change(input, { target: { value: 'bar' } })
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

  // Verify the value
  await waitForElement(() => getByText('Edit'))
  expect(getByText('bar')).toBeInTheDocument
  expect(queryByText('foo')).not.toBeInTheDocument
  expect(getByText('×')).toBeInTheDocument
  expect(getByText('Language: English')).toBeInTheDocument
})

test('validation when mandatory', async () => {
  const store = createStore(appReducer, createInitialState({ mandatory: true }))
  const { getByText, queryByText, getByPlaceholderText } = renderWithRedux(
    <InputLiteral reduxPath={reduxPath} />, store,
  )

  expect(getByPlaceholderText('Preferred Title for Work')).toHaveAttribute('required')
  expect(queryByText('Required')).not.toBeInTheDocument

  // Trigger validation
  store.dispatch(showGroupChooser(true))

  await waitForElement(() => getByText('Required'))
})

// Testing the RDF is in the spirit of testing what the user expects from interacting with this component.
test('produces expected triples for a single value', async () => {
  const store = createStore(appReducer, createInitialState())
  const { getByPlaceholderText, getByText } = renderWithRedux(
    <InputLiteral reduxPath={reduxPath} />, store,
  )

  // Add a value
  fireEvent.change(getByPlaceholderText('Preferred Title for Work'), { target: { value: 'foo' } })
  fireEvent.keyPress(getByPlaceholderText('Preferred Title for Work'), { key: 'Enter', code: 13, charCode: 13 })

  // Verify the value
  await waitForElement(() => getByText('Edit'))

  // Render an RDFModal
  assertRDF(store, [
    '<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@en .',
    '<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:WorkTitle" .',
    '<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .',
  ])
})

test('produces expected triples for repeated values', async () => {
  const store = createStore(appReducer, createInitialState({ repeatable: true }))
  const { getByPlaceholderText, getByText } = renderWithRedux(
    <InputLiteral reduxPath={reduxPath} />, store,
  )

  // Add a value
  fireEvent.change(getByPlaceholderText('Preferred Title for Work'), { target: { value: 'foo' } })
  fireEvent.keyPress(getByPlaceholderText('Preferred Title for Work'), { key: 'Enter', code: 13, charCode: 13 })

  fireEvent.change(getByPlaceholderText('Preferred Title for Work'), { target: { value: 'bar' } })
  fireEvent.keyPress(getByPlaceholderText('Preferred Title for Work'), { key: 'Enter', code: 13, charCode: 13 })

  // Verify the value
  await waitForElement(() => getByText('bar'))

  // Render an RDFModal
  assertRDF(store, [
    '<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@en .',
    '<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "bar"@en .',
    '<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:WorkTitle" .',
    '<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .',
  ])
})
