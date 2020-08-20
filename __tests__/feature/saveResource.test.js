import { renderApp, createHistory } from 'testUtils'
import { fireEvent, wait, screen } from '@testing-library/react'
import * as sinopiaSearch from 'sinopiaSearch'
import * as sinopiaServer from 'sinopiaServer'
import { getFixtureResourceTemplate, rtFixturesGroups, getFixtureResource, resourceSearchResults } from 'fixtureLoaderHelper'
// import { createBlankState } from 'testUtils'

jest.mock('sinopiaSearch')
jest.mock('sinopiaServer')

describe('saving a resource', () => {
  sinopiaServer.foundResourceTemplate.mockResolvedValue(true)
  sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)
  sinopiaServer.publishRDFResource.mockImplementation(rtFixturesGroups)
  const history = createHistory(['/editor/resourceTemplate:bf2:Title:Note'])

  describe('when creating a new resource', () => {
    it('opens the resource template', async () => {
      renderApp(null, history)

      // const state = createBlankState()
      await screen.findByRole('heading', { name: 'Title note' })

      const addBtn = screen.getByRole('button', { name: 'Add Note Text' })
      const saveBtn = screen.getAllByRole('button', { name: 'Save' })[0] // there are multiple save buttons, grab the first

      expect(saveBtn).toBeDisabled()

      fireEvent.click(addBtn)
      const input = screen.getByPlaceholderText('Note Text')
      fireEvent.change(input, { target: { value: 'foo' } })
      fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

      // There is foo text. Perhaps check css.
      await wait(() => expect(screen.getByText('foo')).toHaveClass('rbt-token'))
      // There is remove button
      expect(screen.getByRole('button', { name: 'Remove foo' })).toHaveTextContent('×')
      // There is edit button.
      const editBtn = screen.getByRole('button', { name: 'Edit foo' })
      expect(editBtn).toHaveTextContent('Edit')
      // There is language button.
      expect(screen.getByRole('button', { name: 'Change language for foo' })).toHaveTextContent('Language: English')
      // Input is Empty
      expect(input).toHaveValue('')

      expect(saveBtn).not.toBeDisabled()
      fireEvent.click(saveBtn)

      // const groupSelect = screen.getByRole('combobox') // I think we only have one select
      // fireEvent.change(groupSelect, { target: { value: 'Stanford University' } })
      // fireEvent.click(screen.getByText('Stanford University'))
      // await selectEvent.select(getByLabelText('Which group do you want to associate this record to?'), ['Stanford University'])
      // fireEvent.click(groupSelect)
      // screen.debug(groupSelect)
      // fireEvent.select(groupSelect, { value: 'stanford' })
      // fireEvent.click(screen.getByText("Stanford University"));
      const modalSave = screen.getByRole('button', { name: 'Save Group' })
      fireEvent.click(modalSave)
      // screen.debug()
    })
  })
})
