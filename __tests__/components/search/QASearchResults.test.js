import React from 'react'
import QASearchResults from 'components/search/QASearchResults'
// eslint-disable-next-line import/no-unresolved
import { renderWithRedux, createReduxStore, setupModal } from 'testUtils'

describe('<QASearchResults />', () => {
  setupModal()

  const state = {
    selectorReducer: {
      resource: {},
      editor: {
        resourceTemplateChoice: {
          show: false,
        },
      },
      entities: {
        resourceTemplateSummaries: {},
      },
      search: {
        results: [
          {
            uri: 'http://share-vde.org/sharevde/rdfBibframe/Work/3107365',
            id: 'http://share-vde.org/sharevde/rdfBibframe/Work/3107365',
            label: 'These twain',
            context: [
              {
                property: 'Title',
                values: [
                  'These twain',
                ],
                selectable: true,
                drillable: false,
              },
              {
                property: 'Type',
                values: [
                  'http://id.loc.gov/ontologies/bflc/Hub',
                  'http://id.loc.gov/ontologies/bibframe/Work',
                ],
                selectable: false,
                drillable: false,
              },
              {
                property: 'Contributor',
                values: [
                  'Bennett, Arnold,1867-1931.',
                ],
                selectable: false,
                drillable: false,
              },
            ],
          },
          {
            uri: 'http://share-vde.org/sharevde/rdfBibframe/Work/3107365-1',
            id: 'http://share-vde.org/sharevde/rdfBibframe/Work/3107365-1',
            label: 'Those twain',
            context: [
              {
                property: 'Title',
                values: [
                  'Those twain',
                ],
                selectable: true,
                drillable: false,
              },
              {
                property: 'Type',
                values: [
                  'http://id.loc.gov/ontologies/bibframe/Text',
                  'http://id.loc.gov/ontologies/bibframe/Work',
                ],
                selectable: false,
                drillable: false,
              },
              {
                property: 'Contributor',
                values: [
                  'Bennett, Arnold,1867-1931.',
                ],
                selectable: false,
                drillable: false,
              },
            ],
          }],
        totalResults: 2,
        query: 'twain',
      },
    },
  }

  it('renders results', () => {
    const store = createReduxStore(state)
    const { getByText, getAllByText, getAllByTitle } = renderWithRedux(
      <QASearchResults history={{}}/>, store,
    )
    // Headers
    expect(getByText('Label')).toBeInTheDocument()
    expect(getByText('Classes')).toBeInTheDocument()

    // Rows
    expect(getByText('These twain')).toBeInTheDocument()
    expect(getByText('Those twain')).toBeInTheDocument()
    expect(getByText('http://id.loc.gov/ontologies/bflc/Hub')).toBeInTheDocument()
    expect(getAllByText('http://id.loc.gov/ontologies/bibframe/Work').length).toBe(2)
    expect(getAllByTitle('Copy').length).toBe(2)
  })
})
