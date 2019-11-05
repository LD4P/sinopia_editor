import React from 'react'
import ResourceTemplateChoiceModal from 'components/ResourceTemplateChoiceModal'
// eslint-disable-next-line import/no-unresolved
import { renderWithRedux, createReduxStore, setupModal } from 'testUtils'
import { fireEvent, wait } from '@testing-library/react'
import * as sinopiaSearch from 'sinopiaSearch'
import { modalType } from 'selectors/modalSelectors'

jest.mock('sinopiaSearch')

/* eslint no-undef: 'off' */
$.fn.modal = jest.fn()

sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
  totalHits: 1,
  results: [{
    id: 'resourceTemplate:bf2:Monograph:Work',
    resourceLabel: 'BIBFRAME Work',
    resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
  }],
  error: undefined,
})

describe('<ResourceTemplateChoiceModal />', () => {
  const createState = () => {
    return {
      selectorReducer: {
        editor: {
          modal: {
            name: undefined,
          },
        },
        entities: {},
        templateSearch: {
          results: [],
          totalResults: 0,
          error: undefined,
        },
      },
    }
  }

  it('saves choice', async () => {
    setupModal()

    const mockChoose = jest.fn()
    const store = createReduxStore(createState())
    const {
      getByText, getByPlaceholderText, findByText,
    } = renderWithRedux(
      <div><ResourceTemplateChoiceModal choose={mockChoose} /></div>, store,
    )

    expect(getByText('Choose resource template')).toBeInTheDocument()
    fireEvent.change(getByPlaceholderText(/Enter id, label/), { target: { value: 'resourceTemplate:bf2:Monograph:Work' } })

    fireEvent.click(await findByText(/BIBFRAME Work/))

    fireEvent.click(getByText('Save', 'Button'))

    await wait(() => expect(modalType(store.getState()) === undefined))

    expect(mockChoose).toBeCalledWith('resourceTemplate:bf2:Monograph:Work')
  })

  it('closes when click Cancel', async () => {
    setupModal()

    const store = createReduxStore(createState())

    const { getByText } = renderWithRedux(
      <div><ResourceTemplateChoiceModal choose={jest.fn()} /></div>, store,
    )

    expect(getByText('Choose resource template')).toBeInTheDocument()
    fireEvent.click(getByText('Cancel', 'Button'))
    await wait(() => expect(modalType(store.getState()) === undefined))
  })
})
