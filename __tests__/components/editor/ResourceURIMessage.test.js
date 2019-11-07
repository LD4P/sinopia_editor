import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
import ResourceURIMessage from 'components/editor/ResourceURIMessage'
import { renderWithRedux, createReduxStore, createBlankState } from 'testUtils'

describe('ResourceURIMessage', () => {
  const createInitialState = () => {
    const state = createBlankState()
    state.selectorReducer.editor.currentResource = 'abc123'
    state.selectorReducer.entities.resources.abc123 = {
      'ld4p:RT:bf2:WorkTitle': {
        resourceURI: 'http://localhost:8080/repository/cornell/f6b80d28-cc1b-44ef-8aaf-618569a981cd',
      },
    }
    return state
  }

  it('does not render when no URI', () => {
    const store = createReduxStore(createBlankState())
    const { queryByText } = renderWithRedux(
      <ResourceURIMessage />, store,
    )
    expect(queryByText(/URI for this resource/)).not.toBeInTheDocument()
  })

  it('render when URI', () => {
    const store = createReduxStore(createInitialState())
    const { getByText } = renderWithRedux(
      <ResourceURIMessage />, store,
    )
    expect(getByText('URI for this resource: <http://localhost:8080/repository/cornell/f6b80d28-cc1b-44ef-8aaf-618569a981cd>')).toBeInTheDocument()
  })

  it('copies the URI to clipboard', () => {
    const store = createReduxStore(createInitialState())
    navigator.clipboard = { writeText: jest.fn() }
    const { getByText } = renderWithRedux(
      <ResourceURIMessage />, store,
    )
    fireEvent.click(getByText('Copy URI'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:8080/repository/cornell/f6b80d28-cc1b-44ef-8aaf-618569a981cd')
    expect(getByText('Copied URI to Clipboard'))
    wait(() => {
      expect(getByText('Copy URI'))
    })
  })
})
