import React from 'react'
import { fireEvent } from '@testing-library/react'
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
    getByText, findByText, findByPlaceholderText, getAllByTestId,
  } = renderWithReduxAndRouter(
    (<App />), store,
  )

  it('Opens multiple resources, adds content and trys to close', async () => {
    fireEvent.click(getByText('Linked Data Editor'))

    // Open a resource
    fireEvent.click(await findByText('Abbreviated Title'))

    expect(await findByText('Abbreviated Title', { selector: 'h3' })).toBeInTheDocument()

    // Adds the property
    fireEvent.click(await getByText(/\+ Add/, { selector: 'button.btn-add' }))
    expect(await findByPlaceholderText('Abbreviated Title')).toBeInTheDocument()

    // Adds content to resource
    fireEvent.change(await findByPlaceholderText('Abbreviated Title'), { target: { value: 'acdq' } })

    // Opens a second resource template
    fireEvent.click(getByText('Resource Templates'))
    fireEvent.click(await findByText('Addresses'))

    // Tests active resource tab
    expect(await findByText('Addresses', { selector: 'button' })).toBeInTheDocument()
    expect(await findByText('Addresses', { selector: 'h3' })).toBeInTheDocument()

    // Confirm first tab exists
    expect(await findByText('Abbreviated Title', { selector: 'button' })).toBeInTheDocument()

    // Clicking on the first tab close button
    const closeButton = await findByText('x', { selector: 'button' })
    fireEvent.click(closeButton)

    expect(getAllByTestId('close-resource-modal', { selector: 'div.show' })[0]).toBeInTheDocument()
  })
})
