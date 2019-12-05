import React from 'react'
import { fireEvent, waitForElement, wait } from '@testing-library/react'
import InputListLOC from 'components/editor/property/InputListLOC'
import { showValidationErrors, validateResource } from 'actions/index'
import {
  renderWithRedux, assertRDF, createReduxStore, setupModal, createBlankState,
} from 'testUtils'

const createInitialState = (options = {}) => {
  const state = createBlankState()
  state.selectorReducer.editor.currentResource = 'abc123'
  state.selectorReducer.entities.resources.abc123 = {
    'test:bf2:soundCharacteristics': {
      'http://id.loc.gov/ontologies/bibframe/soundCharacteristics': {
        items: {},
      },
    },
  }
  state.selectorReducer.entities.resourceTemplates = {
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
  }

  if (options.hasInitialURIValue) {
    const items = {
      '60-nvkRUN': {
        uri: 'http://id.loc.gov/vocabulary/mgroove/coarse',
        label: 'http://id.loc.gov/vocabulary/mgroove/coarse',
      },
    }
    state.selectorReducer.entities.resources.abc123['test:bf2:soundCharacteristics']['http://id.loc.gov/ontologies/bibframe/soundCharacteristics'].items = items
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
    state.selectorReducer.entities.resources.abc123['test:bf2:soundCharacteristics']['http://id.loc.gov/ontologies/bibframe/soundCharacteristics'].items = items
  }

  if (options.hasInitialLiteralValue) {
    const items = {
      '60-nvkRUN': {
        content: 'foo',
        label: 'foo',
      },
    }
    state.selectorReducer.entities.resources.abc123['test:bf2:soundCharacteristics']['http://id.loc.gov/ontologies/bibframe/soundCharacteristics'].items = items
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
  'entities',
  'resources',
  'abc123',
  'test:bf2:soundCharacteristics',
  'http://id.loc.gov/ontologies/bibframe/soundCharacteristics',
]

describe('InputListLOC', () => {
  setupModal()
  global.fetch = jest.fn().mockImplementation((url) => Promise.resolve({ json: () => lookups[url] }))

  it('renders when no value', () => {
    const store = createReduxStore(createInitialState())
    const {
      container, getByPlaceholderText, queryByText, getByLabelText,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The input box is present.
    expect(getByPlaceholderText('Sound characteristics')).toBeInTheDocument()
    // Not required.
    expect(queryByText('Required')).not.toBeInTheDocument()
    // No existing values are present. This sort of a query isn't recommended but since testing for absence, seems OK.
    expect(container.querySelector('.rbt-token')).not.toBeInTheDocument()

    // Checkboxes are present and checked
    expect(getByLabelText('recording medium').checked).toBe(true)
    expect(getByLabelText('type of recording').checked).toBe(true)
  })

  it('renders existing URI value', () => {
    const store = createReduxStore(createInitialState({ hasInitialURIValue: true }))
    const { getByText } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The URI is displayed in the input box
    expect(getByText('http://id.loc.gov/vocabulary/mgroove/coarse')).toBeInTheDocument()
  })

  it('renders existing URI values', () => {
    const store = createReduxStore(createInitialState({ hasInitialURIValues: true, repeatable: true }))
    const { getByText } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The URIs are displayed in the input box
    expect(getByText('http://id.loc.gov/vocabulary/mgroove/lateral', { selector: 'div.rbt-token > a' })).toBeInTheDocument()
    expect(getByText('http://id.loc.gov/vocabulary/mgroove/coarse', { selector: 'div.rbt-token > a' })).toBeInTheDocument()
  })

  it('renders existing literal value', () => {
    const store = createReduxStore(createInitialState({ hasInitialLiteralValue: true }))
    const { getByText } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The literal is displayed in the input box
    expect(getByText('foo')).toBeInTheDocument()
  })

  it('handles entering non-repeatable value', async () => {
    const store = createReduxStore(createInitialState())
    const {
      container, getByPlaceholderText, queryByText, getByText, findByText,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The input box is present.
    expect(getByPlaceholderText('Sound characteristics')).toBeInTheDocument()

    // Click in the input box
    const input = getByPlaceholderText('Sound characteristics')
    fireEvent.click(input)

    // Dropdown headers
    expect(getByText('recording medium', { selector: '.dropdown-header' })).toBeInTheDocument()
    expect(getByText('type of recording', { selector: '.dropdown-header' })).toBeInTheDocument()

    // Dropdown values
    expect(await findByText('analog', { selector: '.dropdown-item' })).toBeInTheDocument()
    expect(await findByText('digital', { selector: '.dropdown-item' })).toBeInTheDocument()
    expect(await findByText('magneto-optical', { selector: '.dropdown-item' })).toBeInTheDocument()
    expect(await findByText('optical', { selector: '.dropdown-item' })).toBeInTheDocument()

    // Start typing optical
    fireEvent.change(input, { target: { value: 'opt' } })

    await wait(() => expect(queryByText('analog', { selector: '.dropdown-item' })).not.toBeInTheDocument())
    await wait(() => expect(queryByText('digital', { selector: '.dropdown-item' })).not.toBeInTheDocument())
    expect(getByText('magneto-optical', { selector: '.dropdown-item' })).toBeInTheDocument()
    expect(getByText('optical', { selector: '.dropdown-item' })).toBeInTheDocument()

    fireEvent.click(getByText('optical', { selector: '.dropdown-item' }))

    expect(getByText('optical')).toBeInTheDocument()
    // Ideally would like to test can't add repeated value. However, the user
    // can continue typing so this is a sub-optimal behavior and not really testable.

    // Input is disabled for multiple values
    expect(container.querySelector('input.rbt-input-main[disabled]')).toBeInTheDocument()
  })

  it('handles entering repeatable value', async () => {
    const store = createReduxStore(createInitialState({ repeatable: true }))
    const {
      container, getByPlaceholderText, getByText, findByText,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The input box is present.
    const input = getByPlaceholderText('Sound characteristics')
    expect(input).toBeInTheDocument()

    // Start typing optical and select it
    fireEvent.change(input, { target: { value: 'opt' } })

    expect(await findByText('magneto-optical', { selector: '.dropdown-item' })).toBeInTheDocument()
    expect(await findByText('optical', { selector: '.dropdown-item' })).toBeInTheDocument()

    fireEvent.click(getByText('optical', { selector: '.dropdown-item' }))

    expect(getByText('optical', { selector: 'div.rbt-token > a' })).toBeInTheDocument()

    // Input is enabled for multiple values
    expect(container.querySelector('input.rbt-input-main[disabled]')).not.toBeInTheDocument()

    // Start typing analog and select it
    fireEvent.change(input, { target: { value: 'ana' } })

    expect(await findByText('analog', { selector: '.dropdown-item' })).toBeInTheDocument()

    fireEvent.click(getByText('analog', { selector: '.dropdown-item' }))

    // Analog and optical are entered
    expect(getByText('optical', { selector: 'div.rbt-token > a' })).toBeInTheDocument()
    expect(getByText('analog', { selector: 'div.rbt-token > a' })).toBeInTheDocument()
  })

  it('handles entering a new literal', async () => {
    const store = createReduxStore(createInitialState())
    const {
      container, getByPlaceholderText, getByText,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The input box is present.
    const input = getByPlaceholderText('Sound characteristics')
    expect(input).toBeInTheDocument()

    // Start typing a new literal
    fireEvent.change(input, { target: { value: 'foo' } })

    expect(getByText('New Literal', '.dropdown-header')).toBeInTheDocument()

    fireEvent.click(container.querySelector('.dropdown-item'))

    expect(getByText('foo')).toBeInTheDocument()
  })

  it('handles entering a new URI', async () => {
    const store = createReduxStore(createInitialState())
    const {
      container, getByPlaceholderText, getByText,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )
    // The input box is present.
    const input = getByPlaceholderText('Sound characteristics')
    expect(input).toBeInTheDocument()

    // Start typing a new literal
    fireEvent.change(input, { target: { value: 'http://foo' } })

    expect(getByText('New URI', '.dropdown-header')).toBeInTheDocument()

    fireEvent.click(container.querySelector('.dropdown-item'))

    expect(getByText('http://foo')).toBeInTheDocument()
  })

  it('handles deleting value', () => {
    const store = createReduxStore(createInitialState({ hasInitialURIValue: true, repeatable: true }))
    const { getByText } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )

    const token = getByText('http://id.loc.gov/vocabulary/mgroove/coarse', 'div.rbt-token > a')
    expect(token).toBeInTheDocument()

    fireEvent.click(getByText('×', 'button.rbt-token-remove-button'))

    expect(token).not.toBeInTheDocument()
  })

  it('allows selecting authorities', async () => {
    const store = createReduxStore(createInitialState())
    const {
      getByPlaceholderText, queryByText, getByText, findByText, getByLabelText,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )

    // Uncheck an authority
    const checkbox = getByLabelText('recording medium')
    fireEvent.click(checkbox)
    await wait(() => expect(checkbox.checked).toBe(false))

    // Click in the input box
    const input = getByPlaceholderText('Sound characteristics')
    fireEvent.click(input)

    // Dropdown headers
    expect(queryByText('recording medium', { selector: '.dropdown-header' })).not.toBeInTheDocument()
    expect(getByText('type of recording', { selector: '.dropdown-header' })).toBeInTheDocument()

    // Dropdown values
    expect(await findByText('analog', { selector: '.dropdown-item' })).toBeInTheDocument()
    expect(await findByText('digital', { selector: '.dropdown-item' })).toBeInTheDocument()
    expect(queryByText('magneto-optical', { selector: '.dropdown-item' })).not.toBeInTheDocument()
    expect(queryByText('optical', { selector: '.dropdown-item' })).not.toBeInTheDocument()
  })

  it('produces expected triples for value', async () => {
    const store = createReduxStore(createInitialState())
    const {
      getByPlaceholderText, getByText, findByText,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )

    // Click in the input box
    const input = getByPlaceholderText('Sound characteristics')

    // Start typing optical
    fireEvent.change(input, { target: { value: 'opt' } })

    expect(await findByText('optical', { selector: '.dropdown-item' })).toBeInTheDocument()

    fireEvent.click(getByText('optical', { selector: '.dropdown-item' }))

    expect(getByText('optical')).toBeInTheDocument()

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
      container, getByPlaceholderText, getByText,
    } = renderWithRedux(
      <InputListLOC reduxPath={reduxPath} />, store,
    )

    // The input box is present.
    const input = getByPlaceholderText('Sound characteristics')

    // Start typing a new literal
    fireEvent.change(input, { target: { value: 'foo' } })

    fireEvent.click(container.querySelector('.dropdown-item'))

    expect(getByText('foo')).toBeInTheDocument()

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
    store.dispatch(validateResource('abc123'))
    store.dispatch(showValidationErrors('abc123'))

    await waitForElement(() => getByText('Required'))
  })
})
