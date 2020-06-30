// Copyright 2019 Stanford University see LICENSE for license

import { addTemplateHistory } from 'reducers/templates'
import { createState } from 'stateUtils'

describe('addTemplateHistory', () => {
  it('adds items uniquely', () => {
    let state = addTemplateHistory(createState().selectorReducer, { payload: 'template1' })
    state = addTemplateHistory(state, { payload: 'template2' })
    state = addTemplateHistory(state, { payload: 'template1' })

    expect(state.historicalTemplates).toEqual(['template1', 'template2'])
  })

  it('limits to 7', () => {
    const state = createState()
    state.selectorReducer.historicalTemplates = ['template1', 'template2', 'template3',
      'template4', 'template5', 'template6', 'template7']

    const newState = addTemplateHistory(state.selectorReducer, { payload: 'template8' })

    expect(newState.historicalTemplates).toEqual(['template2', 'template3',
      'template4', 'template5', 'template6', 'template7', 'template8'])
  })
})
