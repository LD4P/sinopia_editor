import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
import {
  renderWithRedux, createReduxStore, setupModal, createBlankState,
} from 'testUtils'
import App from 'components/App'
import { MemoryRouter } from 'react-router-dom'

const createInitialState = () => {
  const state = createBlankState({ authenticated: true })
  state.selectorReducer.editor.currentResource = 'abc123'
  state.selectorReducer.entities.resources.abc123 = {
    'resourceTemplate:bf2:WorkTitle': {
      'http://id.loc.gov/ontologies/bibframe/mainTitle': {
        items: {
        },
      },
    },
  }
  // Note that making mandatory
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
          mandatory: 'true',
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

describe('Preview and try to save resource', () => {
  const store = createReduxStore(createInitialState())
  setupModal()
  const {
    findByLabelText, findByText, getAllByTitle, getByText, getByTestId, queryAllByText,
  } = renderWithRedux(
    (<MemoryRouter><App /></MemoryRouter>), store,
  )

  it('opens the resource, previews RDF, and displays validation', async () => {
    // Open the resource
    fireEvent.click(getByText('Linked Data Editor'))
    fireEvent.click(getByText('Editor'))

    const rdfModal = getByTestId('rdf-modal')
    expect(rdfModal.classList.contains('show')).toBe(false)
    const groupChoiceModal = getByTestId('group-choice-modal')
    expect(groupChoiceModal.classList.contains('show')).not.toBe(true)

    // Preview the RDF
    const previewBtn = getAllByTitle('Preview RDF')
    fireEvent.click(previewBtn[0])
    await wait(() => {
      expect(rdfModal.classList.contains('show')).toBe(true)
    })

    fireEvent.change(await findByLabelText(/Format/), { target: { value: 'n-triples' } })
    expect(getByText(/<> <http:\/\/sinopia.io\/vocabulary\/hasResourceTemplate> "resourceTemplate:bf2:WorkTitle" ./)).toBeInTheDocument()

    // Save
    // There are multiple of these on screen, so selecting by id.
    // There is probably a more idiomatic way of doing this.
    const saveAndPublish = queryAllByText('Save').find((btn) => {
      return btn.classList.contains('modal-save')
    })
    fireEvent.click(saveAndPublish)
    await wait(() => {
      // All modals closed
      expect(rdfModal.classList.contains('show')).not.toBe(true)
    })
    expect(groupChoiceModal.classList.contains('show')).not.toBe(true)
    expect(await findByText(/Unable to save this resource/)).toBeInTheDocument()
  })
})
