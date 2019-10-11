import React from 'react'
import ResourceTemplateChoiceModal from 'components/ResourceTemplateChoiceModal'
// eslint-disable-next-line import/no-unresolved
import { renderWithRedux, createReduxStore, setupModal } from 'testUtils'
import { fireEvent, wait } from '@testing-library/react'

/* eslint no-undef: 'off' */
$.fn.modal = jest.fn()

describe('<ResourceTemplateChoiceModal />', () => {
  const createState = (options = {}) => {
    return {
      selectorReducer: {
        editor: {
          resourceTemplateChoice: {
            show: !options.noShow,
          },
        },
        entities: {
          resourceTemplateSummaries: {
            'resourceTemplate:bf2:Identifiers:DDC': {
              key: 'resourceTemplate:bf2:Identifiers:DDC',
              name: 'Dewey Decimal Classification',
              id: 'resourceTemplate:bf2:Identifiers:DDC',
              group: 'ld4p',
            },
            'resourceTemplate:bf2:Identifiers:Barcode': {
              key: 'resourceTemplate:bf2:Identifiers:Barcode',
              name: 'Barcode',
              id: 'resourceTemplate:bf2:Identifiers:Barcode',
              group: 'ld4p',
            },
          },
        },
      },
    }
  }

  it('saves choice', async () => {
    setupModal()

    const mockChoose = jest.fn()
    const store = createReduxStore(createState())
    const { getByText, getByTestId } = renderWithRedux(
      <div><ResourceTemplateChoiceModal choose={mockChoose} /></div>, store,
    )

    expect(getByText('Choose resource template')).toBeInTheDocument()
    expect(getByText('Barcode')).toBeInTheDocument()
    expect(getByText('Dewey Decimal Classification')).toBeInTheDocument()

    fireEvent.blur(getByTestId('resourceTemplateSelect'), { target: { value: 'resourceTemplate:bf2:Identifiers:DDC' } })

    fireEvent.click(getByText('Save', 'Button'))

    await wait(() => expect(store.getState().selectorReducer.editor.modal === undefined))

    expect(mockChoose).toBeCalledWith('resourceTemplate:bf2:Identifiers:DDC')
  })

  it('closes when click Cancel', async () => {
    setupModal()

    const store = createReduxStore(createState())

    const { getByText } = renderWithRedux(
      <div><ResourceTemplateChoiceModal choose={jest.fn()} /></div>, store,
    )

    expect(getByText('Choose resource template')).toBeInTheDocument()
    fireEvent.click(getByText('Cancel', 'Button'))
    await wait(() => expect(store.getState().selectorReducer.editor.modal === undefined))
  })
})
