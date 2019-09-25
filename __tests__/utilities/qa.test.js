// Copyright 2019 Stanford University see LICENSE for license

import getSearchResults from 'utilities/qa'

describe('getSearchResults()', () => {
  const template = {
    valueConstraint: {
      useValuesFrom: [
        'urn:ld4p:qa:agrovoc',
      ],
    },
  }

  it('returns an array of values from a search', () => {
    expect.assertions(1)

    return getSearchResults('Corn', template).then((result) => {
      expect(result[0].body.length).toEqual(8)
    })
  })

  it('returns a single value using a bad authority source', () => {
    const badAuthorityURItemplate = {
      valueConstraint: {
        useValuesFrom: [
          'urn:ld4p:qa:names:organization',
        ],
      },
    }
    return getSearchResults('Austin, Jane', badAuthorityURItemplate).catch((result) => {
      expect(result[0].statusCode).toEqual(400)
    })
  })
})
