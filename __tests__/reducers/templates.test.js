// Copyright 2019 Stanford University see LICENSE for license

import { addTemplateHistory, addTemplates, addTemplateHistoryByResult } from 'reducers/templates'
import { createState } from 'stateUtils'
import Config from 'Config'

describe('addTemplateHistory', () => {
  const template = {
    key: 'ld4p:RT:bf2:Identifiers:LCCN',
    uri: 'http://localhost:3000/resource/ld4p:RT:bf2:Identifiers:LCCN',
    id: 'ld4p:RT:bf2:Identifiers:LCCN',
    class: 'http://id.loc.gov/ontologies/bibframe/Lccn',
    label: 'LCCN',
    author: 'LD4P',
    remark: 'Library of Congress Card Number',
    date: '2019-08-19',
  }

  it('transforms to a result', () => {
    const state = createState()
    const newState = addTemplateHistory(state.editor, { payload: template })

    expect(newState.historicalTemplates).toEqual([{
      author: 'LD4P',
      date: '2019-08-19',
      id: 'ld4p:RT:bf2:Identifiers:LCCN',
      remark: 'Library of Congress Card Number',
      resourceLabel: 'LCCN',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Lccn',
      uri: 'http://localhost:3000/resource/ld4p:RT:bf2:Identifiers:LCCN',
    }])
  })

  it('adds items uniquely', () => {
    let state = addTemplateHistory(createState().editor, { payload: { key: 'template1' } })
    state = addTemplateHistory(state, { payload: { key: 'template2' } })
    state = addTemplateHistory(state, { payload: { key: 'template1' } })

    expect(state.historicalTemplates.map((template) => template.id)).toEqual(['template1', 'template2'])
  })

  it('limits to 10', () => {
    const state = createState()
    state.editor.historicalTemplates = [{ id: 'template1' }, { id: 'template2' }, { id: 'template3' },
      { id: 'template4' }, { id: 'template5' }, { id: 'template6' }, { id: 'template7' },
      { id: 'template8' }, { id: 'template9' }, { id: 'template10' },
    ]

    const newState = addTemplateHistory(state.editor, { payload: { key: 'template11' } })

    expect(newState.historicalTemplates.map((template) => template.id)).toEqual(['template11', 'template1',
      'template2', 'template3', 'template4', 'template5', 'template6', 'template7', 'template8',
      'template9'])
  })

  it('does not add root resource template to history', () => {
    const state = createState()
    const newState = addTemplateHistory(state.editor, { payload: { key: Config.rootResourceTemplateId } })

    expect(newState.historicalTemplates).toEqual([])
  })
})

describe('addTemplateHistoryByResult', () => {
  const result = {
    author: 'LD4P',
    date: '2019-08-19',
    id: 'ld4p:RT:bf2:Identifiers:LCCN',
    remark: 'Library of Congress Card Number',
    resourceLabel: 'LCCN',
    resourceURI: 'http://id.loc.gov/ontologies/bibframe/Lccn',
    uri: 'http://localhost:3000/resource/ld4p:RT:bf2:Identifiers:LCCN',
  }

  it('adds to historical templates', () => {
    const state = createState()
    const newState = addTemplateHistoryByResult(state.editor, { payload: result })

    expect(newState.historicalTemplates).toEqual([result])
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

    const newState = addTemplates(state.entities, { payload: subjectTemplate })

    const newSubjectTemplate = newState.subjectTemplates['ld4p:RT:bf2:Title:AbbrTitle']
    expect(newSubjectTemplate).toBeSubjectTemplate('ld4p:RT:bf2:Title:AbbrTitle')
    expect(newSubjectTemplate.propertyTemplates).toBeUndefined()

    expect(newState.propertyTemplates['ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle']).toBePropertyTemplate('ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle')
  })
})
