// Copyright 2018 Stanford University see LICENSE for license

import lookups from '../../src/reducers/lookups'

describe('changing the reducer state', () => {
  const itemOne = { id: 'http://uri1', uri: 'http://uri1', label: 'selection1' }
  const itemTwo = { id: 'http://uri2', uri: 'http://uri2', label: 'selection2' }
  const itemThree = { id: 'http://uri3', uri: 'http://uri3', label: 'selection3' }

  it('should handle initial state', () => {
    expect(
      lookups(undefined, {}),
    ).toEqual({ formData: [] })
  })

  it('should handle CHANGE_SELECTIONS', () => {
    expect(
      lookups({ formData: [] }, {
        type: 'CHANGE_SELECTIONS',
        payload: { id: 'Run the tests', items: [itemOne] },
      }),
    ).toEqual({
      formData: [{
        id: 'Run the tests', items: [itemOne],
      }],
    })

    expect(
      lookups({
        formData: [{
          id: 'Run the tests', items: [itemOne],
        }],
      }, {
        type: 'CHANGE_SELECTIONS',
        payload: { id: 'add this!', items: [itemTwo] },
      }),
    ).toEqual({
      formData: [
        { id: 'Run the tests', items: [itemOne] },
        { id: 'add this!', items: [itemTwo] },
      ],
    })
  })

  it('handles the change when there are more than one items selected from a lookup', () => {
    expect(
      lookups({
        formData: [
          { id: 'Run the tests', items: [itemOne] },
          { id: 'add this!', items: [itemTwo] },
        ],
      }, {
        type: 'CHANGE_SELECTIONS',
        payload: { id: 'add this!', items: [itemTwo, itemThree] },
      }),
    ).toEqual({
      formData: [
        { id: 'Run the tests', items: [itemOne] },
        { id: 'add this!', items: [itemTwo, itemThree] },
      ],
    })
  })

  it('handles removing selections', () => {
    expect(
      lookups({
        formData: [
          { id: 'Run the tests', items: [itemOne] },
          { id: 'remove items!', items: [itemTwo, itemThree] },
        ],
      }, {
        type: 'CHANGE_SELECTIONS',
        payload: { id: 'remove items!', items: [] },
      }),
    ).toEqual({
      formData: [
        { id: 'Run the tests', items: [itemOne] },
        { id: 'remove items!', items: [] },
      ],
    })
  })
})
