// Copyright 2019 Stanford University see LICENSE for license

import { fetchExports } from 'actionCreators/exports'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const mockStore = configureMockStore([thunk])

describe('export', () => {
  describe('when successful', () => {
    const mockSuccessResponse = `<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Name>sinopia-exports-development</Name><Prefix></Prefix><Marker></Marker><MaxKeys>1000</MaxKeys><IsTruncated>false</IsTruncated><Contents><Key>alberta_2019-10-28T16:44:08.978Z.zip</Key><LastModified>2019-10-28T16:44:16.000Z</LastModified><ETag>&quot;10aeda5a8ec4114eb416078dc702b8bc&quot;</ETag><Size>489</Size><StorageClass>STANDARD</StorageClass></Contents><Contents><Key>boulder_2019-10-28T16:44:10.116Z.zip</Key><LastModified>2019-10-28T16:44:16.000Z</LastModified><ETag>&quot;4ced7ffee89e1161adb55a1c3dadd42f&quot;</ETag><Size>489</Size><StorageClass>STANDARD</StorageClass></Contents></ListBucketResult>`
    const mockTextPromise = Promise.resolve(mockSuccessResponse)
    const mockFetchPromise = Promise.resolve({
      text: () => mockTextPromise,
    })

    beforeEach(() => global.fetch = jest.fn().mockImplementation(() => mockFetchPromise))

    it('dispatches actions', async () => {
      const store = mockStore({ selectorReducer: { entities: { exports: [] } } })
      await store.dispatch(fetchExports('testerrorkey'))
      expect(store.getActions()).toEqual([
        { type: 'CLEAR_ERRORS', payload: 'testerrorkey' },
        {
          type: 'EXPORTS_RECEIVED',
          payload: [
            'alberta_2019-10-28T16:44:08.978Z.zip',
            'boulder_2019-10-28T16:44:10.116Z.zip',
          ],
        },
      ])
    })
  })

  describe('when error', () => {
    const mockFetchPromise = Promise.reject(new Error('S3 fail'))

    beforeEach(() => global.fetch = jest.fn().mockImplementation(() => mockFetchPromise))

    it('dispatches actions', async () => {
      const store = mockStore({ selectorReducer: { entities: { exports: [] } } })
      await store.dispatch(fetchExports('testerrorkey'))
      expect(store.getActions()).toEqual([
        { type: 'CLEAR_ERRORS', payload: 'testerrorkey' },
        {
          type: 'ADD_ERROR',
          payload: {
            error: 'Error retrieving list of exports: S3 fail',
            errorKey: 'testerrorkey',
          },
        },
      ])
    })
  })
})
