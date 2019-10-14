import React from 'react'
import ResourceTemplateChoiceModal from 'components/ResourceTemplateChoiceModal'
import { renderWithRedux, createReduxStore } from 'testUtils'
import { fireEvent, wait } from '@testing-library/react'


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
    const mockChoose = jest.fn()
    const store = createReduxStore(createState())
    const { getByText, getByTestId, queryByText } = renderWithRedux(
      <div><ResourceTemplateChoiceModal choose={mockChoose} /></div>, store,
    )

    expect(getByText('Choose resource template')).toBeInTheDocument()
    expect(getByText('Barcode')).toBeInTheDocument()
    expect(getByText('Dewey Decimal Classification')).toBeInTheDocument()

    fireEvent.blur(getByTestId('resourceTemplateSelect'), { target: { value: 'resourceTemplate:bf2:Identifiers:DDC' } })

    fireEvent.click(getByText('Save', 'Button'))
    await wait(() => expect(queryByText('Choose resource template')).not.toBeInTheDocument())

    expect(mockChoose).toBeCalledWith('resourceTemplate:bf2:Identifiers:DDC')
  })

  it('closes when click Cancel', async () => {
    const store = createReduxStore(createState())
    const { queryByText, getByText } = renderWithRedux(
      <div><ResourceTemplateChoiceModal choose={jest.fn()} /></div>, store,
    )

    expect(getByText('Choose resource template')).toBeInTheDocument()
    fireEvent.click(getByText('Cancel', 'Button'))
    await wait(() => expect(queryByText('Choose resource template')).not.toBeInTheDocument())
  })

  it('does not show', () => {
    const store = createReduxStore(createState({ noShow: true }))
    const { queryByText } = renderWithRedux(
      <div><ResourceTemplateChoiceModal choose={jest.fn()} /></div>, store,
    )

    expect(queryByText('Choose resource template')).not.toBeInTheDocument()
  })
})
