// Copyright 2020 Stanford University see LICENSE for license

import {
  addProperty, addSubject, addValue, clearResource,
  clearValues, hideProperty, removeProperty, removeSubject,
  removeValue, replaceValues, saveResourceFinished, setBaseURL, setCurrentResource,
  setLastSaveChecksum, setUnusedRDF, showProperty,
} from 'reducers/resources'

import { createState } from 'stateUtils'
import { createReducer } from 'reducers/index'

const reducers = {
  ADD_PROPERTY: addProperty,
  ADD_SUBJECT: addSubject,
  ADD_VALUE: addValue,
  CLEAR_VALUES: clearValues,
  CLEAR_RESOURCE: clearResource,
  HIDE_PROPERTY: hideProperty,
  REPLACE_VALUES: replaceValues,
  REMOVE_PROPERTY: removeProperty,
  REMOVE_SUBJECT: removeSubject,
  REMOVE_VALUE: removeValue,
  SAVE_RESOURCE_FINISHED: saveResourceFinished,
  SET_BASE_URL: setBaseURL,
  SET_CURRENT_RESOURCE: setCurrentResource,
  SET_LAST_SAVE_CHECKSUM: setLastSaveChecksum,
  SET_UNUSED_RDF: setUnusedRDF,
  SHOW_PROPERTY: showProperty,
}

const reducer = createReducer(reducers)

describe('addProperty()', () => {
  it('adds a property key to a subject propertyTemplateKeys', () => {
    const oldState = createState({ hasResourceWithLiteral: true })

    const action = {
      type: 'ADD_PROPERTY',
      payload: {
        key: 'vmq88890',
        subjectKey: 't9zVwg2zO',
        propertyTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
        valueKeys: [],
        show: true,
        errors: [],
      },
    }
    const newState = reducer(oldState.selectorReducer, action)
    expect(newState.entities.properties.vmq88890).toStrictEqual({
      key: 'vmq88890',
      subjectKey: 't9zVwg2zO',
      propertyTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      valueKeys: [],
      show: true,
      errors: [],
    })
    expect(newState.entities.subjects.t9zVwg2zO.propertyKeys).toContain('vmq88890')
  })
})

describe('addSubject()', () => {
  it('adds a subject', () => {
    const oldState = {
      entities: {
        subjects: {},
      },
    }

    const action = {
      type: 'ADD_SUBJECT',
      payload: {
        key: '45689df',
        properties: {},
        subjectTemplate: {
          key: 'resourceTemplate:bf2:Identifiers:Barcode',
          id: 'resourceTemplate:bf2:Identifiers:Barcode',
          class: 'http://id.loc.gov/ontologies/bibframe/Barcode',
          label: 'Barcode',
        },
        uri: null,
        subjectTemplateKey: 'resourceTemplate:bf2:Identifiers:Barcode',
      },
    }

    const newState = reducer(oldState, action)
    expect(newState).toStrictEqual({
      entities: {
        subjects: {
          '45689df': {
            key: '45689df',
            uri: null,
            subjectTemplateKey: 'resourceTemplate:bf2:Identifiers:Barcode',
          },
        },
      },
    })
  })
})

describe('addValue()', () => {
  const action = {
    type: 'ADD_VALUE',
    payload: {
      value: {
        key: 'wWPvilOlqH',
        propertyKey: 'kqKVn-1TbC',
        literal: '12345',
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        property: '[CIRCULAR]',
      },
    },
  }

  const expectedState = {
    entities: {
      propertyTemplates: {
        'resourceTemplate:bf2:Identifiers:Barcode > http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
          key: 'resourceTemplate:bf2:Identifiers:Barcode > http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
          subjectTemplateKey: 'resourceTemplate:bf2:Identifiers:Barcode',
          label: 'Barcode',
          uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
          required: true,
          repeatable: false,
          type: 'literal',
        },
      },
      properties: {
        'kqKVn-1TbC': {
          key: 'kqKVn-1TbC',
          errors: [],
          valueKeys: ['wWPvilOlqH'],
          propertyTemplateKey: 'resourceTemplate:bf2:Identifiers:Barcode > http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
          show: false,
        },
      },
      values: {
        wWPvilOlqH: {
          key: 'wWPvilOlqH',
          propertyKey: 'kqKVn-1TbC',
          literal: '12345',
          lang: null,
          uri: null,
          label: null,
          valueSubjectKey: null,
        },
      },
    },
  }

  it('adds a value if it value does not exist', () => {
    const oldState = {
      entities: {
        properties: {
          'kqKVn-1TbC': {
            key: 'kqKVn-1TbC',
            valueKeys: [],
            propertyTemplateKey: 'resourceTemplate:bf2:Identifiers:Barcode > http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
            show: false,
          },
        },
        propertyTemplates: {
          'resourceTemplate:bf2:Identifiers:Barcode > http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
            key: 'resourceTemplate:bf2:Identifiers:Barcode > http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
            subjectTemplateKey: 'resourceTemplate:bf2:Identifiers:Barcode',
            label: 'Barcode',
            uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
            required: true,
            repeatable: false,
            type: 'literal',
          },
        },
        values: {},
      },
    }

    const newState = reducer(oldState, action)
    expect(newState).toStrictEqual(expectedState)
  })

  it('adds a value if valueKey exists', () => {
    const oldState = {
      entities: {
        properties: {
          'kqKVn-1TbC': {
            key: 'kqKVn-1TbC',
            valueKeys: ['wWPvilOlqH'],
            propertyTemplateKey: 'resourceTemplate:bf2:Identifiers:Barcode > http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
            show: false,
          },
        },
        propertyTemplates: {
          'resourceTemplate:bf2:Identifiers:Barcode > http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
            key: 'resourceTemplate:bf2:Identifiers:Barcode > http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
            subjectTemplateKey: 'resourceTemplate:bf2:Identifiers:Barcode',
            label: 'Barcode',
            uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
            required: true,
            repeatable: false,
            type: 'literal',
          },
        },
        values: {},
      },
    }

    // oldState contains existing property
    const newState = reducer(oldState, action)
    expect(newState).toStrictEqual(expectedState)
  })
})

describe('clearResource()', () => {
  it('removes resource', () => {
    const oldState = createState({ hasResourceWithLiteral: true })

    const action = {
      type: 'CLEAR_RESOURCE',
      payload: 't9zVwg2zO',
    }

    const newState = reducer(oldState.selectorReducer, action)
    expect(newState.editor.currentResource).toBe(undefined)
    expect(Object.keys(newState.entities.subjects).length).toBe(0)
  })
})

describe('clearValues()', () => {
  it('sets property valueKeys to an empty list', () => {
    const oldState = {
      entities: {
        properties: {
          'kqKVn-1TbC': {
            key: 'kqKVn-1TbC',
            show: true,
            valueKeys: ['wWPvilOlqH'],
          },
        },
        values: {
          wWPvilOlqH: {
            key: 'wWPvilOlqH',
            propertyKey: 'kqKVn-1TbC',
            literal: '12345',
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
          },
        },
      },
    }
    const action = {
      type: 'CLEAR_VALUES',
      payload: 'kqKVn-1TbC',
    }
    const newState = reducer(oldState, action)
    expect(newState.entities.properties['kqKVn-1TbC'].valueKeys.length).toBe(0)
  })
})

describe('hideProperty()', () => {
  it('sets show to false for property', () => {
    const oldState = {
      entities: {
        properties: {
          'kqKVn-1TbC': {
            key: 'kqKVn-1TbC',
            show: true,
          },
        },
      },
    }

    const action = {
      type: 'HIDE_PROPERTY',
      payload: 'kqKVn-1TbC',
    }

    const newState = reducer(oldState, action)
    expect(newState.entities.properties['kqKVn-1TbC'].show).toBeFalsy()
  })
})

describe('removeProperty()', () => {
  it('removes a property from a subject', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    const action = {
      type: 'REMOVE_PROPERTY',
      payload: 'JQEtq-vmq8',
    }

    const newState = reducer(oldState.selectorReducer, action)
    expect(newState.entities.properties['JQEtq-vmq8']).toBe(undefined)
  })
})

describe('removeSubject()', () => {
  it('removes a subject from state', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    const action = {
      type: 'REMOVE_SUBJECT',
      payload: 't9zVwg2zO',
    }

    const newState = reducer(oldState.selectorReducer, action)
    expect(newState.entities.subjects.t9zVwg2zO).toBe(undefined)
  })
})

describe('removeValue()', () => {
  it('removes a value for a property', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    const action = {
      type: 'REMOVE_VALUE',
      payload: 'CxGx7WMh2',
    }

    const newState = reducer(oldState.selectorReducer, action)
    expect(newState.entities.values.CxGx7WMh2).toBe(undefined)
    expect(newState.entities.properties['JQEtq-vmq8'].valueKeys.CxGx7WMh2).toBe(undefined)
    expect(newState.entities.properties['JQEtq-vmq8'].errors.length).toBe(0)
  })
})

describe('replaceValues()', () => {
  it('does not change state if value is absent', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    const action = {
      type: 'REPLACE_VALUES',
      payload: [],
    }

    const newState = reducer(oldState.selectorReducer, action)
    expect(newState).toStrictEqual(oldState.selectorReducer)
  })

  it('changes value', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    const action = {
      type: 'REPLACE_VALUES',
      payload: [
        {
          key: 'CxGx7WMh2',
          propertyKey: 'JQEtq-vmq8',
          literal: 'foo',
          lang: 'eng',
          uri: null,
          label: null,
          valueSubjectKey: null,
        },
      ],
    }
    const newState = reducer(oldState.selectorReducer, action)
    expect(Object.keys(newState.entities.values).length).toBe(0)
  })
})

describe('saveResourceFinished()', () => {
  const realDateNow = Date.now.bind(global.Date)

  beforeAll(() => {
    const dateNowStub = jest.fn(() => 1594667068562)
    global.Date.now = dateNowStub
  })

  afterAll(() => {
    global.Date.now = realDateNow
  })

  it('updates resourceKey and checksum with resource', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    const action = {
      type: 'SAVE_RESOURCE_FINISHED',
      payload: {
        resourceKey: 't9zVwg2zO',
        checksum: '36cd058cd760233fce18540c0912f7bb',
      },
    }
    const newState = reducer(oldState.selectorReducer, action)
    expect(newState.editor.lastSave.t9zVwg2zO).toBe(1594667068562)
    expect(newState.editor.lastSaveChecksum.t9zVwg2zO).toBe('36cd058cd760233fce18540c0912f7bb')
  })
})


describe('setBaseURL()', () => {
  it('sets base url', () => {
    const oldState = {
      entities: {
        subjects: {
          abcde345: {
            uri: '',
          },
        },
      },
    }
    const action = {
      type: 'SET_BASE_URL',
      payload: {
        resourceKey: 'abcde345',
        resourceURI: 'https://sinopia.io/stanford/456hkl',
      },
    }
    const newState = reducer(oldState, action)
    expect(newState).toStrictEqual({
      entities: {
        subjects: {
          abcde345: {
            uri: 'https://sinopia.io/stanford/456hkl',
          },
        },
      },
    })
  })
})

describe('setCurrentResource()', () => {
  it('sets current resource if resource is in editor resources', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.selectorReducer.editor.resources.push('t9zVwg2zO')

    const action = {
      type: 'SET_CURRENT_RESOURCE',
      payload: 't9zVwg2zO',
    }

    const newState = reducer(oldState.selectorReducer, action)
    expect(newState.editor.currentResource).toBe('t9zVwg2zO')
    expect(newState.editor.resources).toStrictEqual(['t9zVwg2zO'])
  })

  it('sets current resource and adds to editor resources', () => {
    const oldState = createState({ hasResourceWithLiteral: true })

    const action = {
      type: 'SET_CURRENT_RESOURCE',
      payload: 't9zVwg2zO',
    }

    const newState = reducer(oldState.selectorReducer, action)
    expect(newState.editor.currentResource).toBe('t9zVwg2zO')
    expect(newState.editor.resources).toStrictEqual(['t9zVwg2zO'])
  })
})

describe('setLastSaveChecksum()', () => {
  it('sets lastSavedChecksum in state', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    const action = {
      type: 'SET_LAST_SAVE_CHECKSUM',
      payload: {
        resourceKey: 't9zVwg2zO',
        checksum: '36cd058cd760233fce18540c0912f7bb',
      },
    }
    const newState = reducer(oldState.selectorReducer, action)
    expect(newState.editor.lastSaveChecksum.t9zVwg2zO).toBe('36cd058cd760233fce18540c0912f7bb')
  })
})

describe('setUnusedRDF()', () => {
  it('sets unused RDF', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    const action = {
      type: 'SET_UNUSED_RDF',
      payload: {
        resourceKey: 't9zVwg2zO',
        rdf: '<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> \'abcde\' .',
      },
    }

    const newState = reducer(oldState.selectorReducer, action)
    expect(newState.editor.unusedRDF.t9zVwg2zO).toBe('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> \'abcde\' .')
  })
})

describe('showProperty()', () => {
  it('sets show to true for property', () => {
    const oldState = {
      entities: {
        properties: {
          'kqKVn-1TbC': {
            key: 'kqKVn-1TbC',
            subjectKey: 'BraIA_lBw',
            propertyTemplateKey: 'resourceTemplate:bf2:Identifiers:Barcode > http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
            show: false,
          },
        },
      },
    }
    const action = {
      type: 'SHOW_PROPERTY',
      payload: 'kqKVn-1TbC',
    }
    const newState = reducer(oldState, action)
    expect(newState.entities.properties['kqKVn-1TbC'].show).toBeTruthy()
  })
})
