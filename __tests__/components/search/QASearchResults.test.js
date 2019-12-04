import React from 'react'
import QASearchResults from 'components/search/QASearchResults'
import {
  renderWithRedux, createReduxStore, setupModal, createBlankState,
} from 'testUtils'

describe('<QASearchResults />', () => {
  setupModal()

  it('renders results', () => {
    const state = createBlankState()
    state.selectorReducer.search.results = [
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
              'Bennett, Arnold.',
            ],
            selectable: false,
            drillable: false,
          },
          {
            property: 'Image URL',
            values: [
              'https://img.discogs.com/ilqScil5LIpcF_povstRcaEtEeg=/fit-in/600x527/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1622463-1425003720-8692.jpeg.jpg',
            ],
          },
        ],
      }]
    state.selectorReducer.search.totalResults = 2
    state.selectorReducer.search.query = 'twain'

    const store = createReduxStore(state)
    const {
      getByText, getAllByText, getAllByTitle, container,
    } = renderWithRedux(
      <QASearchResults history={{}}/>, store,
    )
    // Headers
    expect(getByText('Label')).toBeInTheDocument()
    expect(getByText('Class')).toBeInTheDocument()

    // Rows
    expect(getByText('These twain')).toBeInTheDocument()
    expect(getByText('Those twain')).toBeInTheDocument()
    expect(getByText('http://id.loc.gov/ontologies/bflc/Hub')).toBeInTheDocument()
    expect(getAllByText('http://id.loc.gov/ontologies/bibframe/Work').length).toBe(2)
    expect(getAllByText('Contributor', { selector: 'strong' }).length).toBe(2)
    expect(getByText(/Bennett, Arnold,1867-1931./)).toBeInTheDocument()
    expect(getAllByTitle('Copy').length).toBe(2)
    expect(container.querySelector('img')).toBeInTheDocument()
  })

  it('renders errors', () => {
    const state = createBlankState()
    state.selectorReducer.editor.errors.searchqaresource = ['Ooops']
    state.selectorReducer.search.results = [
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
      }]
    state.selectorReducer.search.totalResults = 1
    state.selectorReducer.search.query = 'twain'

    const store = createReduxStore(state)
    const { getByText } = renderWithRedux(
      <QASearchResults history={{}}/>, store,
    )
    expect(getByText('Ooops')).toBeInTheDocument()
  })
})
