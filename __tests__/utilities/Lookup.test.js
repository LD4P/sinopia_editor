import { getLookupResult } from 'utilities/Lookup'
import * as sinopiaSearch from 'sinopiaSearch'
import * as qaSearch from 'utilities/QuestioningAuthority'
import { findAuthorityConfig } from 'utilities/authorityConfig'

describe('getLookupResult()', () => {
  sinopiaSearch.getLookupResult = jest.fn().mockResolvedValue({
    totalHits: 0,
    results: [],
    error: undefined,
  })
  describe('Sinopia lookup', () => {
    it('returns result', async () => {
      const authorityConfig = findAuthorityConfig('urn:ld4p:sinopia:bibframe:work')
      const result = await getLookupResult('lebowski', authorityConfig, 10)
      expect(result).toEqual({
        totalHits: 0,
        results: [],
        error: undefined,
        authorityConfig,
      })
      expect(sinopiaSearch.getLookupResult).toHaveBeenCalledWith('lebowski', authorityConfig, { startOfRange: 10 })
    })
  })

  describe('QA lookup', () => {
    qaSearch.createLookupPromise = jest.fn().mockResolvedValue({
      ok: true,
      url: 'https://lookup.ld4l.org/authorities/search/linked_data/agrovoc_ld4l_cache?q=Corn&maxRecords=8&lang=en&context=true',
      status: 200,
      statusText: 'OK',
      body: {
        response_header: {
          start_record: 1,
          requested_records: 1,
          retrieved_records: 1,
          total_records: 1,
        },
        results: [
          {
            uri: 'http://aims.fao.org/aos/agrovoc/c_331388',
            id: 'http://aims.fao.org/aos/agrovoc/c_331388',
            label: 'corn sheller',
          },
        ],
      },
      authLabel: 'AGROVOC (QA)',
      authURI: 'urn:ld4p:qa:agrovoc',
      label: 'AGROVOC (QA)',
      id: 'urn:ld4p:qa:agrovoc',
    })
    it('returns result', async () => {
      const authorityConfig = findAuthorityConfig('urn:ld4p:qa:agrovoc')
      const result = await getLookupResult('corn', authorityConfig, 5)
      expect(result).toEqual({
        totalHits: 1,
        results: [
          {
            uri: 'http://aims.fao.org/aos/agrovoc/c_331388',
            id: 'http://aims.fao.org/aos/agrovoc/c_331388',
            label: 'corn sheller',
          },
        ],
        error: undefined,
        authorityConfig,
      })
      expect(qaSearch.createLookupPromise).toHaveBeenCalledWith('corn', authorityConfig, { startOfRange: 5 })
    })
  })
  describe('QA lookup with bad total_records', () => {
    qaSearch.createLookupPromise = jest.fn().mockResolvedValue({
      ok: true,
      url: 'https://lookup.ld4l.org/authorities/search/linked_data/agrovoc_ld4l_cache?q=Corn&maxRecords=8&lang=en&context=true',
      status: 200,
      statusText: 'OK',
      body: {
        response_header: {
          start_record: 1,
          requested_records: 1,
          retrieved_records: 1,
          total_records: 'NOT_REPORTED',
        },
        results: [
          {
            uri: 'http://aims.fao.org/aos/agrovoc/c_331388',
            id: 'http://aims.fao.org/aos/agrovoc/c_331388',
            label: 'corn sheller',
          },
        ],
      },
      authLabel: 'AGROVOC (QA)',
      authURI: 'urn:ld4p:qa:agrovoc',
      label: 'AGROVOC (QA)',
      id: 'urn:ld4p:qa:agrovoc',
    })
    it('returns result', async () => {
      const authorityConfig = findAuthorityConfig('urn:ld4p:qa:agrovoc')
      const result = await getLookupResult('corn', authorityConfig, 5)
      expect(result).toEqual({
        totalHits: 1,
        results: [
          {
            uri: 'http://aims.fao.org/aos/agrovoc/c_331388',
            id: 'http://aims.fao.org/aos/agrovoc/c_331388',
            label: 'corn sheller',
          },
        ],
        error: undefined,
        authorityConfig,
      })
      expect(qaSearch.createLookupPromise).toHaveBeenCalledWith('corn', authorityConfig, { startOfRange: 5 })
    })
  })
})
