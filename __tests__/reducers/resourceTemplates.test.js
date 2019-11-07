// Copyright 2019 Stanford University see LICENSE for license

import { addTemplateHistory } from 'reducers/resourceTemplates'
import { createBlankState } from 'testUtils'

describe('addTemplateHistory', () => {
  it('adds items uniquely', () => {
    let state = addTemplateHistory(createBlankState().selectorReducer, { payload: { id: 'template1' } })
    state = addTemplateHistory(state, { payload: { id: 'template2' } })
    state = addTemplateHistory(state, { payload: { id: 'template1' } })

    expect(state.historicalTemplates.results).toEqual([{ id: 'template1' }, { id: 'template2' }])
    expect(state.historicalTemplates.totalResults).toEqual(2)
  })

  it('limits to 7', () => {
    const state = createBlankState()
    state.selectorReducer.historicalTemplates.results = [
      { id: 'template1' },
      { id: 'template2' },
      { id: 'template3' },
      { id: 'template4' },
      { id: 'template5' },
      { id: 'template6' },
      { id: 'template7' },
    ]

    const newState = addTemplateHistory(state.selectorReducer, { payload: { id: 'template8' } })

    expect(newState.historicalTemplates.results).toEqual([
      { id: 'template2' },
      { id: 'template3' },
      { id: 'template4' },
      { id: 'template5' },
      { id: 'template6' },
      { id: 'template7' },
      { id: 'template8' },
    ])
    expect(newState.historicalTemplates.totalResults).toEqual(7)
  })
})
