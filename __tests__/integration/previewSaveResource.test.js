import React from 'react'
import { fireEvent } from '@testing-library/react'
import {
  renderWithRedux, createReduxStore, setupModal, createBlankState,
} from 'testUtils'
import App from 'components/App'
import { MemoryRouter } from 'react-router-dom'
import { modalType } from 'selectors/modalSelectors'

const createInitialState = () => {
  const state = createBlankState({ authenticated: true })
  state.selectorReducer.editor.currentResource = 'abc123'
  state.selectorReducer.entities.resources.abc123 = {
    'resourceTemplate:bf2:WorkTitle': {
      'http://id.loc.gov/ontologies/bibframe/mainTitle': {
        items: {
          Uv8UAARr8: {
            content: 'foo',
            lang: 'en',
          },
        },
      },
    },
  }
  state.selectorReducer.entities.resourceTemplates = {
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
  }
  return state
}

describe('Preview and save resource', () => {
  const store = createReduxStore(createInitialState())
  setupModal()
  const {
    findByLabelText, getAllByTitle, getByTestId, getByText, queryAllByText, queryByText,
  } = renderWithRedux(
    (<MemoryRouter><App /></MemoryRouter>), store,
  )

  it('opens the resource, previews RDF, and saves', async () => {
    // Open the resource
    fireEvent.click(getByText('Linked Data Editor'))
    fireEvent.click(getByText('Editor'))

    // Preview the RDF
    fireEvent.click(getAllByTitle('Preview RDF')[0])
    fireEvent.change(await findByLabelText(/Format/), { target: { value: 'n-triples' } })
    expect(getByText(/<> <http:\/\/id.loc.gov\/ontologies\/bibframe\/mainTitle> "foo"@en \./)).toBeInTheDocument()

    // Save
    // There are multiple of these on screen, so selecting by id.
    // There is probably a more idiomatic way of doing this.
    const save = queryAllByText('Save').find((btn) => {
      return btn.classList.contains('modal-save')
    })
    fireEvent.click(save)
    expect(queryByText('Which group do you want to save to?')).toBeInTheDocument()
    // Having trouble with finding by label text, so using test id
    fireEvent.change(getByTestId('groupSelect'), { target: { value: 'stanford' } })

    // There are multiple of these on screen, so selecting by id
    const finalSave = queryAllByText('Save').find((btn) => {
      return !btn.classList.contains('modal-save') && !btn.classList.contains('editor-save')
    })
    fireEvent.click(finalSave)

    // Confirm that the modal is closed
    expect(modalType(store.getState())).toBe(undefined)
  })
})
