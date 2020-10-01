import {
  loadUserData, addTemplateHistory, addResourceHistory, addSearchHistory,
} from 'actionCreators/user'
import * as sinopiaApi from 'sinopiaApi'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { createState } from 'stateUtils'
import * as sinopiaSearch from 'sinopiaSearch'


const mockStore = configureMockStore([thunk])

describe('loadUserData()', () => {
  it('fetches from Sinopia API and dispatches', async () => {
    sinopiaApi.fetchUser = jest.fn().mockResolvedValue({ data: { history: { template: [{ id: 'abc123', payload: 'template1' }] } } })
    sinopiaSearch.getTemplateSearchResultsByIds = jest.fn().mockResolvedValue({ results: [{ id: 'template1' }] })
    const store = mockStore(createState())

    await store.dispatch(loadUserData('ekostova'))

    expect(store.getActions()).toEqual([
      {
        type: 'ADD_TEMPLATE_HISTORY_BY_RESULT',
        payload: { id: 'template1' },
      },
    ])
    expect(sinopiaApi.fetchUser).toHaveBeenCalledWith('ekostova')
    expect(sinopiaSearch.getTemplateSearchResultsByIds).toHaveBeenCalledWith(['template1'])
  })
})

describe('addTemplateHistory()', () => {
  it('sends to API', async () => {
    sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()
    const store = mockStore(createState())

    await store.dispatch(addTemplateHistory('template1'))

    expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith('Foo McBar', 'template', '5860e2660bd44eab2be5190cd2cafb8b', 'template1')
  })
})

describe('addResourceHistory()', () => {
  it('sends to API', async () => {
    sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()
    const store = mockStore(createState())

    await store.dispatch(addResourceHistory('https://api.development.sinopia.io/resource/3f90a592-5070-4244-a2d9-47f503329e39'))

    expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith('Foo McBar', 'resource', 'b7d41ce2cdf71bd8dd3198b93d5bb7bd', 'https://api.development.sinopia.io/resource/3f90a592-5070-4244-a2d9-47f503329e39')
  })
})

describe('addSearchHistory()', () => {
  it('sends to API', async () => {
    sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()
    const store = mockStore(createState())

    await store.dispatch(addSearchHistory('sinopia', 'ants'))

    expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith('Foo McBar', 'search', 'dd5b5cc7ca199ba76faf047ffb52575d', '{"authorityUri":"sinopia","query":"ants"}')
  })
})
