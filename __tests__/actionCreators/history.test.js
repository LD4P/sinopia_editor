import { loadTemplateHistory, loadSearchHistory } from 'actionCreators/history'
import Config from 'Config'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { createState } from 'stateUtils'
import * as sinopiaSearch from 'sinopiaSearch'

// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

const mockStore = configureMockStore([thunk])

describe('loadTemplateHistory()', () => {
  sinopiaSearch.getTemplateSearchResultsByIds = jest.fn().mockResolvedValue({ results: [{ id: 'template1' }, { id: 'template2' }] })
  it('fetches from search and dispatches', async () => {
    const store = mockStore(createState())

    await store.dispatch(loadTemplateHistory(['template1', 'template2']))

    expect(store.getActions()).toEqual([
      {
        type: 'ADD_TEMPLATE_HISTORY_BY_RESULT',
        payload: { id: 'template2' },
      },
      {
        type: 'ADD_TEMPLATE_HISTORY_BY_RESULT',
        payload: { id: 'template1' },
      },
    ])

    expect(sinopiaSearch.getTemplateSearchResultsByIds).toHaveBeenCalledWith(['template1', 'template2'])
  })
})

describe('loadSearchHistory()', () => {
  it('adds label and dispatches', async () => {
    const store = mockStore(createState())

    await store.dispatch(loadSearchHistory([{
      authorityUri: 'urn:ld4p:qa:sharevde_stanford_ld4l_cache:all',
      query: 'leland',
    }]))

    expect(store.getActions()).toEqual([
      {
        type: 'ADD_SEARCH_HISTORY',
        payload: {
          authorityLabel: 'SHAREVDE STANFORD (QA)',
          authorityUri: 'urn:ld4p:qa:sharevde_stanford_ld4l_cache:all',
          query: 'leland',
        },
      },
    ])
  })
})
