import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
import {
  renderWithReduxAndRouter, createReduxStore, setupModal, createBlankState,
} from 'testUtils'
import App from 'components/App'
import Config from 'Config'

jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

describe('Loading multiple resources', () => {
  setupModal()

  const store = createReduxStore(createBlankState({ authenticated: true }))
  const {
    getByText, queryByText, findByText, queryAllByText,
  } = renderWithReduxAndRouter(
    (<App />), store,
  )

  it('Opens multiple resources', async () => {
    fireEvent.click(getByText('Linked Data Editor'))

    // Open a resource
    fireEvent.click(await findByText('Abbreviated Title'))

    expect(await findByText('Abbreviated Title', { selector: 'h1 em' })).toBeInTheDocument()

    // Open another resource
    fireEvent.click(getByText('Resource Templates'))
    fireEvent.click(await findByText('Addresses'))

    expect(await findByText('Addresses', { selector: 'h1 em' })).toBeInTheDocument()

    // Nav pills
    expect(getByText('Addresses', { selector: 'button' })).toBeInTheDocument()
    expect(getByText('Abbreviated Title', { selector: 'button' })).toBeInTheDocument()

    // Close
    fireEvent.click(queryAllByText('Close')[0])
    expect(await findByText('Abbreviated Title', { selector: 'h1 em' })).toBeInTheDocument()
    await wait(() => expect(queryByText('Abbreviated Title', { selector: 'button' })).not.toBeInTheDocument())

    // Close again
    fireEvent.click(queryAllByText('Close')[0])

    // Back to Resource Template page
    expect(await findByText('_Monograph Instance (BIBFRAME)')).toBeInTheDocument()
  })
})
