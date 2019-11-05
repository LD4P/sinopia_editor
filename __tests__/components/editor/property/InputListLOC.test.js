import React from 'react'
import { fireEvent, waitForElement, wait } from '@testing-library/react'
import InputListLOC from 'components/editor/property/InputListLOC'
import { showValidationErrors, validateResource } from 'actions/index'
/* eslint import/no-unresolved: 'off' */
import {
  renderWithRedux, assertRDF, createReduxStore, setupModal,
} from 'testUtils'

const createInitialState = (options = {}) => {
  const state = {
    selectorReducer: {
      resource: {
        'test:bf2:soundCharacteristics': {
          'http://id.loc.gov/ontologies/bibframe/soundCharacteristics': {
            items: {},
          },
        },
      },
      entities: {
        resourceTemplates: {
          'test:bf2:soundCharacteristics': {
            id: 'test:bf2:soundCharacteristics',
            propertyTemplates: [{
              propertyLabel: 'Sound characteristics',
              propertyURI: 'http://id.loc.gov/ontologies/bibframe/soundCharacteristics',
              repeatable: 'false',
              type: 'lookup',
              valueConstraint: {
                useValuesFrom: ['https://id.loc.gov/vocabulary/mrectype',
                  'https://id.loc.gov/vocabulary/mrecmedium',
                ],
                valueDataType: {},
              },
              mandatory: 'false',
            }],
            resourceLabel: 'Multiple LOC lookups',
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/soundCharacteristics',
          },
        },
        lookups: {},
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
      },
    },
  }

  if (options.hasInitialURIValue) {
    const items = {
      '60-nvkRUN': {
        uri: 'http://id.loc.gov/vocabulary/mgroove/coarse',
        label: 'http://id.loc.gov/vocabulary/mgroove/coarse',
      },
    }
    state.selectorReducer.resource['test:bf2:soundCharacteristics']['http://id.loc.gov/ontologies/bibframe/soundCharacteristics'].items = items
  }

  if (options.hasInitialURIValues) {
    const items = {
      '60-nvkRUN': {
        uri: 'http://id.loc.gov/vocabulary/mgroove/coarse',
        label: 'http://id.loc.gov/vocabulary/mgroove/coarse',
      },
      IXkooAk68oE: {
        uri: 'http://id.loc.gov/vocabulary/mgroove/lateral',
        label: 'http://id.loc.gov/vocabulary/mgroove/lateral',
      },
    }
    state.selectorReducer.resource['test:bf2:soundCharacteristics']['http://id.loc.gov/ontologies/bibframe/soundCharacteristics'].items = items
  }

  if (options.hasInitialLiteralValue) {
    const items = {
      '60-nvkRUN': {
        content: 'foo',
        label: 'foo',
      },
    }
    state.selectorReducer.resource['test:bf2:soundCharacteristics']['http://id.loc.gov/ontologies/bibframe/soundCharacteristics'].items = items
  }

  if (options.mandatory) {
    state.selectorReducer.entities.resourceTemplates['test:bf2:soundCharacteristics'].propertyTemplates[0].mandatory = 'true'
  }
  if (options.repeatable) {
    state.selectorReducer.entities.resourceTemplates['test:bf2:soundCharacteristics'].propertyTemplates[0].repeatable = 'true'
  }
  return state
}

const mrectype = [{
  '@id': 'http://id.loc.gov/vocabulary/mrectype/analog',
  '@type': ['http://www.loc.gov/mads/rdf/v1#Authority'],
  'http://www.loc.gov/mads/rdf/v1#authoritativeLabel': [{
    '@value': 'analog',
  }],
}, {
  '@id': 'http://id.loc.gov/vocabulary/mrectype/digital',
  '@type': ['http://www.loc.gov/mads/rdf/v1#Authority'],
  'http://www.loc.gov/mads/rdf/v1#authoritativeLabel': [{
    '@value': 'digital',
  }],
}]

const mrecmedium = [{
  '@id': 'http://id.loc.gov/vocabulary/mrecmedium/opt',
  '@type': ['http://www.loc.gov/mads/rdf/v1#Authority'],
  'http://www.loc.gov/mads/rdf/v1#authoritativeLabel': [{
    '@value': 'optical',
  }],
}, {
  '@id': 'http://id.loc.gov/vocabulary/mrecmedium/magopt',
  '@type': ['http://www.loc.gov/mads/rdf/v1#Authority'],
  'http://www.loc.gov/mads/rdf/v1#authoritativeLabel': [{
    '@value': 'magneto-optical',
  }],
}]

const lookups = {
  'https://id.loc.gov/vocabulary/mrectype.json': mrectype,
  'https://id.loc.gov/vocabulary/mrecmedium.json': mrecmedium,
}

const reduxPath = [
  'resource',
  'test:bf2:soundCharacteristics',
  'http://id.loc.gov/ontologies/bibframe/soundCharacteristics',
]

describe('InputListLOC', () => {
  setupModal()
  global.fetch = jest.fn().mockImplementation(url => Promise.resolve({ json: () => lookups[url] }))

  it('renders when no value', () => {
    const store = createReduxStore(createInitialState())
    const { container, getByPlaceholderText, queryByText } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The input box is present.
    expect(getByPlaceholderText('Sound characteristics')).toBeInTheDocument()
    // Not required.
    expect(queryByText('Required')).not.toBeInTheDocument()
    expect(getByPlaceholderText('Sound characteristics')).not.toHaveAttribute('required')
    // No existing values are present. This sort of a query isn't recommended but since testing for absence, seems OK.
    expect(container.querySelector('.rbt-token')).not.toBeInTheDocument()
  })

  it('renders existing URI value', () => {
    const store = createReduxStore(createInitialState({ hasInitialURIValue: true }))
    const { getByDisplayValue } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The URI is displayed in the input box
    expect(getByDisplayValue('http://id.loc.gov/vocabulary/mgroove/coarse')).toBeInTheDocument()
  })

  it('renders existing URI values', () => {
    const store = createReduxStore(createInitialState({ hasInitialURIValues: true, repeatable: true }))
    const { getByText } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The URIs are displayed in the input box
    expect(getByText('http://id.loc.gov/vocabulary/mgroove/lateral', 'div.rbt-token > a')).toBeInTheDocument()
    expect(getByText('http://id.loc.gov/vocabulary/mgroove/coarse', 'div.rbt-token > a')).toBeInTheDocument()
  })


  it('renders existing literal value', () => {
    const store = createReduxStore(createInitialState({ hasInitialLiteralValue: true }))
    const { getByDisplayValue } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The literal is displayed in the input box
    expect(getByDisplayValue('foo')).toBeInTheDocument()
  })

  it('handles entering non-repeatable value', async () => {
    const store = createReduxStore(createInitialState())
    const {
      getByPlaceholderText, queryByText, getByText, findByText, getByDisplayValue,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The input box is present.
    expect(getByPlaceholderText('Sound characteristics')).toBeInTheDocument()

    // Click in the input box
    const input = getByPlaceholderText('Sound characteristics')
    fireEvent.click(input)

    // Dropdown headers
    expect(getByText('recording medium', '.dropdown-header')).toBeInTheDocument()
    expect(getByText('type of recording', '.dropdown-header')).toBeInTheDocument()

    // Dropdown values
    expect(await findByText('analog', '.dropdown-item')).toBeInTheDocument()
    expect(await findByText('digital', '.dropdown-item')).toBeInTheDocument()
    expect(await findByText('magneto-optical', '.dropdown-item')).toBeInTheDocument()
    expect(await findByText('optical', '.dropdown-item')).toBeInTheDocument()

    // Start typing optical
    fireEvent.change(input, { target: { value: 'opt' } })

    await wait(() => expect(queryByText('analog', '.dropdown-item')).not.toBeInTheDocument())
    await wait(() => expect(queryByText('digital', '.dropdown-item')).not.toBeInTheDocument())
    expect(getByText('magneto-optical', '.dropdown-item')).toBeInTheDocument()
    expect(getByText('optical', '.dropdown-item')).toBeInTheDocument()

    fireEvent.click(getByText('optical', '.dropdown-item'))

    expect(getByDisplayValue('optical')).toBeInTheDocument()
    // Ideally would like to test can't add repeated value. However, the user
    // can continue typing so this is a sub-optimal behavior and not really testable.
  })

  it('handles entering repeatable value', async () => {
    const store = createReduxStore(createInitialState({ repeatable: true }))
    const {
      getByPlaceholderText, getByText, findByText,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The input box is present.
    const input = getByPlaceholderText('Sound characteristics')
    expect(input).toBeInTheDocument()

    // Start typing optical and select it
    fireEvent.change(input, { target: { value: 'opt' } })

    expect(await findByText('magneto-optical', '.dropdown-item')).toBeInTheDocument()
    expect(await findByText('optical', '.dropdown-item')).toBeInTheDocument()

    fireEvent.click(getByText('optical', '.dropdown-item'))

    expect(getByText('optical', 'div.rbt-token > a')).toBeInTheDocument()

    // Start typing analog and select it
    fireEvent.change(input, { target: { value: 'ana' } })

    expect(await findByText('analog', '.dropdown-item')).toBeInTheDocument()

    fireEvent.click(getByText('analog', '.dropdown-item'))

    // Analog and optical are entered
    expect(getByText('optical', 'div.rbt-token > a')).toBeInTheDocument()
    expect(getByText('analog', 'div.rbt-token > a')).toBeInTheDocument()
  })

  it('handles entering a new literal', async () => {
    const store = createReduxStore(createInitialState())
    const {
      getByPlaceholderText, getByText, findByText, getByDisplayValue,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The input box is present.
    const input = getByPlaceholderText('Sound characteristics')
    expect(input).toBeInTheDocument()

    // Start typing a new literal
    fireEvent.change(input, { target: { value: 'foo' } })

    expect(await findByText('foo', '.dropdown-item')).toBeInTheDocument()
    expect(getByText('New Literal', '.dropdown-header')).toBeInTheDocument()

    fireEvent.click(getByText('foo', '.dropdown-item'))

    expect(getByDisplayValue('foo')).toBeInTheDocument()
  })

  it('handles entering a new URI', async () => {
    const store = createReduxStore(createInitialState())
    const {
      getByPlaceholderText, getByText, findByText, getByDisplayValue,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The input box is present.
    const input = getByPlaceholderText('Sound characteristics')
    expect(input).toBeInTheDocument()

    // Start typing a new literal
    fireEvent.change(input, { target: { value: 'http://foo' } })

    expect(await findByText('http://foo', '.dropdown-item')).toBeInTheDocument()
    expect(getByText('New URI', '.dropdown-header')).toBeInTheDocument()

    fireEvent.click(getByText('http://foo', '.dropdown-item'))

    expect(getByDisplayValue('http://foo')).toBeInTheDocument()
  })


  it('handles deleting value', () => {
    const store = createReduxStore(createInitialState({ hasInitialURIValue: true, repeatable: true }))
    const { getByText } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )

    const token = getByText('http://id.loc.gov/vocabulary/mgroove/coarse', 'div.rbt-token > a')
    expect(token).toBeInTheDocument()

    // expect(getByText('×', 'button.rbt-token-remove-button')).toBeInTheDocument()
    fireEvent.click(getByText('×', 'button.rbt-token-remove-button'))

    expect(token).not.toBeInTheDocument()
    // expect(await token).toBeInTheDocument()
    // await wait(() => expect(token).not.toBeInTheDocument())
  })

  it('produces expected triples for value', async () => {
    const store = createReduxStore(createInitialState())
    const {
      getByPlaceholderText, getByText, findByText, getByDisplayValue,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )

    // Click in the input box
    const input = getByPlaceholderText('Sound characteristics')

    // Start typing optical
    fireEvent.change(input, { target: { value: 'opt' } })

    expect(await findByText('optical', '.dropdown-item')).toBeInTheDocument()

    fireEvent.click(getByText('optical', '.dropdown-item'))

    expect(getByDisplayValue('optical')).toBeInTheDocument()

    // Render an RDFModal
    await assertRDF(store, [
      '<> <http://id.loc.gov/ontologies/bibframe/soundCharacteristics> <http://id.loc.gov/vocabulary/mrecmedium/opt> .',
      '<> <http://sinopia.io/vocabulary/hasResourceTemplate> "test:bf2:soundCharacteristics" .',
      '<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/soundCharacteristics> .',
    ])
  })

  it('produces expected triples for a literal', async () => {
    const store = createReduxStore(createInitialState())
    const {
      getByPlaceholderText, getByText, findByText, getByDisplayValue,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )

    // The input box is present.
    const input = getByPlaceholderText('Sound characteristics')

    // Start typing a new literal
    fireEvent.change(input, { target: { value: 'foo' } })

    expect(await findByText('foo', 'a.dropdown-item')).toBeInTheDocument()

    fireEvent.click(getByText('foo', '.dropdown-item'))

    expect(getByDisplayValue('foo')).toBeInTheDocument()

    // Render an RDFModal
    await assertRDF(store, [
      '<> <http://id.loc.gov/ontologies/bibframe/soundCharacteristics> "foo" .',
      '<> <http://sinopia.io/vocabulary/hasResourceTemplate> "test:bf2:soundCharacteristics" .',
      '<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/soundCharacteristics> .',
    ])
  })

  it('validates when mandatory', async () => {
    const store = createReduxStore(createInitialState({ mandatory: true }))
    const { getByText, queryByText } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )

    expect(queryByText('Required')).not.toBeInTheDocument()

    // Trigger validation
    store.dispatch(validateResource())
    store.dispatch(showValidationErrors())

    await waitForElement(() => getByText('Required'))
  })
})
