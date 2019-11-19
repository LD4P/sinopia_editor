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
        ],
      }]
    state.selectorReducer.search.totalResults = 2
    state.selectorReducer.search.query = 'twain'

    const store = createReduxStore(state)
    const { getByText, getAllByText, getAllByTitle } = renderWithRedux(
      <QASearchResults history={{}}/>, store,
    )
    // Headers
    expect(getByText('Label')).toBeInTheDocument()
    expect(getByText('Classes')).toBeInTheDocument()
    expect(getByText('Context')).toBeInTheDocument()

    // Rows
    expect(getByText('These twain')).toBeInTheDocument()
    expect(getByText('Those twain')).toBeInTheDocument()
    expect(getByText('http://id.loc.gov/ontologies/bflc/Hub')).toBeInTheDocument()
    expect(getAllByText('http://id.loc.gov/ontologies/bibframe/Work').length).toBe(2)
    expect(getAllByText('Contributor', { selector: 'strong' }).length).toBe(2)
    expect(getByText(/Bennett, Arnold,1867-1931./)).toBeInTheDocument()
    expect(getAllByTitle('Copy').length).toBe(2)
  })

  it('renders non-LD results', () => {
    const state = createBlankState()
    state.selectorReducer.search.results = [{
      uri: 'https://www.discogs.com/Shania-Twain-Shania-Twain/master/132553',
      id: '132553',
      label: 'Shania Twain - Shania Twain',
      context: {
        'Image URL': [
          'https://img.discogs.com/v-Gvq7D2Sjxz9QtYt4rlcBNtkuY=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-429801-1476775497-2961.jpeg.jpg',
        ],
        Year: [
          '1993',
        ],
        'Record Labels': [
          'Mercury',
          'PolyGram Records, Inc.',
          'PolyGram Records, Inc.',
          'PolyGram Group Canada Inc.',
          'PolyGram Group Canada Inc.',
          'Cinram',
        ],
        Formats: [
          'CD',
          'Album',
        ],
        Type: [
          'master',
        ],
      },
    },
    {
      uri: 'https://www.discogs.com/Eric-Burdon-The-Animals-The-Twain-Shall-Meet/master/68819',
      id: '68819',
      label: 'Eric Burdon & The Animals - The Twain Shall Meet',
      context: {
        'Image URL': [
          'https://img.discogs.com/vlhBa2VmD5hGURyPieJWCj3IfpU=/fit-in/600x602/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-2706703-1448289765-4478.jpeg.jpg',
        ],
        Year: [
          '1968',
        ],
        'Record Labels': [
          'MGM Records',
          'MGM Records',
          'Metro-Goldwyn-Mayer, Inc.',
          'MGM Record Manufacturing Division',
          'Metro-Goldwyn-Mayer, Inc.',
        ],
        Formats: [
          'Vinyl',
          'LP',
          'Album',
          'Stereo',
        ],
        Type: [
          'master',
        ],
      },
    }]
    state.selectorReducer.search.totalResults = 2
    state.selectorReducer.search.query = 'twain'

    const store = createReduxStore(state)
    const { getByText, getAllByText, getAllByTitle } = renderWithRedux(
      <QASearchResults history={{}}/>, store,
    )
    // Headers
    expect(getByText('Label')).toBeInTheDocument()
    expect(getByText('Classes')).toBeInTheDocument()

    // Rows
    expect(getByText('Shania Twain - Shania Twain')).toBeInTheDocument()
    expect(getByText('Eric Burdon & The Animals - The Twain Shall Meet')).toBeInTheDocument()
    expect(getAllByText('master').length).toBe(2)
    expect(getAllByTitle('Copy').length).toBe(2)
  })

  it('renders errors', () => {
    const state = createBlankState()
    state.selectorReducer.editor.errors.searchqaresource = ['Ooops']
    state.selectorReducer.search.results = [{
      uri: 'https://www.discogs.com/Shania-Twain-Shania-Twain/master/132553',
      id: '132553',
      label: 'Shania Twain - Shania Twain',
      context: {
        'Image URL': [
          'https://img.discogs.com/v-Gvq7D2Sjxz9QtYt4rlcBNtkuY=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-429801-1476775497-2961.jpeg.jpg',
        ],
        Year: [
          '1993',
        ],
        'Record Labels': [
          'Mercury',
          'PolyGram Records, Inc.',
          'PolyGram Records, Inc.',
          'PolyGram Group Canada Inc.',
          'PolyGram Group Canada Inc.',
          'Cinram',
        ],
        Formats: [
          'CD',
          'Album',
        ],
        Type: [
          'master',
        ],
      },
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
