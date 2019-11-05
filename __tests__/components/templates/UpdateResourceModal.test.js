// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { renderWithRedux, createReduxStore, setupModal } from 'testUtils'
import { fireEvent } from '@testing-library/react'
import UpdateResourceModal from 'components/templates/UpdateResourceModal'

describe('<UpdateResourceModal />', () => {
  setupModal()

  describe('with conflict message', () => {
    const resourceTemplate = {
      propertyTemplates: [
        {
          mandatory: 'true',
          repeatable: 'false',
          type: 'literal',
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/classificationPortion',
          propertyLabel: 'LC Classification Number 2',
        },
      ],
      id: 'sinopia:resourceTemplate:bf2:LCC',
      resourceLabel: 'Library of Congress Classification 2',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/ClassificationLcc',
      date: '2019-04-19',
      author: 'NDMSO',
      schema: 'https://ld4p.github.io/sinopia/schemas/0.1.0/resource-template.json',
    }

    const messages = [{
      req: {
        method: 'POST',
        url: 'http://localhost:8080/repository/ld4p',
        _data: resourceTemplate,
      },
      statusText: 'Conflict',
      statusCode: 409,
      status: 409,
    }]

    const createInitialState = () => {
      return {
        selectorReducer: {
          editor: {
            modal: {
              name: 'UpdateResourceModal',
              messages: messages,
            },
          },
        },
      }
    }
    
    it('does not render based on state', () => {
      const store = createReduxStore({ selectorReducer: { editor: { modal: { name: undefined, messages: messages } } } })
      const { getByTestId } = renderWithRedux(
        <UpdateResourceModal update={jest.fn()} messages={messages} />,
        store,
      )

      expect(getByTestId('update-resource-modal').classList.contains('show')).toBe(false)
    })
    it('renders', () => {
      const store = createReduxStore(createInitialState())
      const { getByTestId, getByText } = renderWithRedux(
        <UpdateResourceModal update={jest.fn()} messages={messages} />,
        store,
      )

      expect(getByTestId('update-resource-modal').classList.contains('show')).toBe(true)
      expect(getByText('Do you want to overwrite these resource templates?')).toBeInTheDocument()
      expect(getByText('sinopia:resourceTemplate:bf2:LCC', { selector: 'li' })).toBeInTheDocument()
    })

    it('cancels when cancel is clicked', () => {
      const store = createReduxStore(createInitialState())
      const { getByTestId, getByText } = renderWithRedux(
        <UpdateResourceModal update={jest.fn()} messages={messages} />,
        store,
      )

      expect(getByTestId('update-resource-modal').classList.contains('show')).toBe(true)
      fireEvent.click(getByText('Cancel'))
      expect(getByTestId('update-resource-modal').classList.contains('show')).toBe(false)
    })

    it('updates when overwrite is clicked', () => {
      const mockUpdate = jest.fn()
      const store = createReduxStore(createInitialState())
      const { getByTestId, getByText } = renderWithRedux(
        <UpdateResourceModal update={mockUpdate} messages={messages} />,
        store,
      )

      expect(getByTestId('update-resource-modal').classList.contains('show')).toBe(true)
      fireEvent.click(getByText('Overwrite'))
      expect(mockUpdate).toHaveBeenCalledWith([resourceTemplate], 'ld4p')
      expect(getByTestId('update-resource-modal').classList.contains('show')).toBe(false)
    })
  })
})
