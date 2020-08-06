import { renderApp, createHistory } from 'testUtils'
import { fireEvent, wait, screen } from '@testing-library/react'
import * as sinopiaApi from 'sinopiaApi'
import Config from 'Config'

// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)
jest.spyOn(sinopiaApi, 'postResource').mockResolvedValue('http://localhost:3000/repository/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f')

describe('saving a resource', () => {
  describe('when creating a new resource', () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn() // required to allow scrolling in the jsdom
    const history = createHistory(['/editor/resourceTemplate:bf2:Title:Note'])

    it('opens the resource template', async () => {
      renderApp(null, history)

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

      const modalSave = screen.getByRole('button', { name: 'Save Group' })
      fireEvent.click(modalSave)
      await screen.findByText(/URI for this resource/)
    })
  })
})
