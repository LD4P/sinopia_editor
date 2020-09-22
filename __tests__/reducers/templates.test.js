// Copyright 2019 Stanford University see LICENSE for license

import { addTemplateHistory, addTemplates } from 'reducers/templates'
import { createState } from 'stateUtils'
import Config from 'Config'

describe('addTemplateHistory', () => {
  it('adds items uniquely', () => {
    let state = addTemplateHistory(createState().editor, { payload: 'template1' })
    state = addTemplateHistory(state, { payload: 'template2' })
    state = addTemplateHistory(state, { payload: 'template1' })

    expect(state.historicalTemplates).toEqual(['template1', 'template2'])
  })

  it('limits to 7', () => {
    const state = createState()
    state.editor.historicalTemplates = ['template1', 'template2', 'template3',
      'template4', 'template5', 'template6', 'template7']

    const newState = addTemplateHistory(state.editor, { payload: 'template8' })

    expect(newState.historicalTemplates).toEqual(['template2', 'template3',
      'template4', 'template5', 'template6', 'template7', 'template8'])
  })

  it('does not add root resource template to history', () => {
    let state = addTemplateHistory(createState().editor, { payload: 'template1' })
    state = addTemplateHistory(state, { payload: Config.rootResourceTemplateId })
    state = addTemplateHistory(state, { payload: 'template2' })

    expect(state.historicalTemplates).toEqual(['template1', 'template2'])
  })
})

describe('addTemplates', () => {
  const subjectTemplate = {
    key: 'ld4p:RT:bf2:Title:AbbrTitle',
    id: 'ld4p:RT:bf2:Title:AbbrTitle',
    class: 'http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle',
    label: 'Abbreviated Title',
    propertyTemplateKeys: ['ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle'],
    propertyTemplates: [
      {
        key: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
        subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
        label: 'Abbreviated Title',
        uri: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
        required: false,
        repeatable: false,
        defaults: [],
        remark: undefined,
        remarkUrl: null,
        type: null,
        component: null,
        valueSubjectTemplateKeys: null,
        authorities: [],
      },
    ],
  }
  it('adds subject template and property templates', () => {
    const state = createState()

    const newState = addTemplates(state.selectorReducer, { payload: subjectTemplate })

    const newSubjectTemplate = newState.entities.subjectTemplates['ld4p:RT:bf2:Title:AbbrTitle']
    expect(newSubjectTemplate).toBeSubjectTemplate('ld4p:RT:bf2:Title:AbbrTitle')
    expect(newSubjectTemplate.propertyTemplates).toBeUndefined()

    expect(newState.entities.propertyTemplates['ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle']).toBePropertyTemplate('ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle')
  })
})
