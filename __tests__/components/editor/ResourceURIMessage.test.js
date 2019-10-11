import React from 'react'
import { fireEvent } from '@testing-library/react'
import ResourceURIMessage from 'components/editor/ResourceURIMessage'
/* eslint import/no-unresolved: 'off' */
import { renderWithRedux, createReduxStore } from 'testUtils'

describe('ResourceURIMessage', () => {
  const stateNoURI = {
    selectorReducer: {
      resource: {},
    },
  }

  const stateURI = {
    selectorReducer: {
      resource: {
        'ld4p:RT:bf2:WorkTitle': {
          resourceURI: 'http://localhost:8080/repository/cornell/f6b80d28-cc1b-44ef-8aaf-618569a981cd',
        },
      },
    },
  }

  it('does not render when no URI', () => {
    const store = createReduxStore(stateNoURI)
    const { queryByText } = renderWithRedux(
      <ResourceURIMessage />, store,
    )
    expect(queryByText(/URI for this resource/)).not.toBeInTheDocument()
  })

  it('render when URI', () => {
    const store = createReduxStore(stateURI)
    const { getByText } = renderWithRedux(
      <ResourceURIMessage />, store,
    )
    expect(getByText('URI for this resource: <http://localhost:8080/repository/cornell/f6b80d28-cc1b-44ef-8aaf-618569a981cd>')).toBeInTheDocument()
  })

  it('copies the URI to clipboard', () => {
    const store = createReduxStore(stateURI)
    navigator.clipboard = { writeText: jest.fn() }
    const { getByText } = renderWithRedux(
      <ResourceURIMessage />, store,
    )
    fireEvent.click(getByText('Copy URI'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:8080/repository/cornell/f6b80d28-cc1b-44ef-8aaf-618569a981cd')
  })
})
