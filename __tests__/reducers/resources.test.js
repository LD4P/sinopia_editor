// Copyright 2020 Stanford University see LICENSE for license

import {
  addProperty, addSubject, addValue, clearResource, hideProperty, removeSubject,
  removeValue, saveResourceFinished, setBaseURL, setCurrentResource,
  setCurrentResourceIsReadOnly, setUnusedRDF, showProperty,
  loadResourceFinished, setResourceGroup, setValueOrder,
  clearResourceFromEditor, saveResourceFinishedEditor,
} from 'reducers/resources'

import { createState } from 'stateUtils'
import { createReducer } from 'reducers/index'

const reducers = {
  ADD_PROPERTY: addProperty,
  ADD_SUBJECT: addSubject,
  ADD_VALUE: addValue,
  CLEAR_RESOURCE: clearResource,
  HIDE_PROPERTY: hideProperty,
  LOAD_RESOURCE_FINISHED: loadResourceFinished,
  REMOVE_SUBJECT: removeSubject,
  REMOVE_VALUE: removeValue,
  SAVE_RESOURCE_FINISHED: saveResourceFinished,
  SET_BASE_URL: setBaseURL,
  SET_RESOURCE_GROUP: setResourceGroup,
  SET_VALUE_ORDER: setValueOrder,
  SHOW_PROPERTY: showProperty,
}

const reducer = createReducer(reducers)

const editorReducers = {
  CLEAR_RESOURCE: clearResourceFromEditor,
  SAVE_RESOURCE_FINISHED: saveResourceFinishedEditor,
  SET_CURRENT_RESOURCE: setCurrentResource,
  SET_CURRENT_RESOURCE_IS_READ_ONLY: setCurrentResourceIsReadOnly,
  SET_UNUSED_RDF: setUnusedRDF,
}

const editorReducer = createReducer(editorReducers)

describe('addProperty()', () => {
  describe('new property with no values', () => {
    it('updates state', () => {
      const oldState = createState({ hasResourceWithLiteral: true })

      const action = {
        type: 'ADD_PROPERTY',
        payload: {
          key: 'vmq88891',
          subject: { key: 't9zVwg2zO' },
          propertyTemplate: { key: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle' },
          values: [],
          show: true,
          errors: [],
        },
      }
      const newState = reducer(oldState.entities, action)
      expect(newState.properties.vmq88891).toStrictEqual({
        key: 'vmq88891',
        subjectKey: 't9zVwg2zO',
        rootSubjectKey: 't9zVwg2zO',
        propertyTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
        valueKeys: [],
        show: true,
        errors: [],
        rootPropertyKey: 'vmq88891',
        descUriOrLiteralValueKeys: [],
        descWithErrorPropertyKeys: [],
      })
      expect(newState.subjects.t9zVwg2zO.propertyKeys).toContain('vmq88891')
      expect(newState.subjects.t9zVwg2zO.changed).toBe(true)
    })
  })

  describe('existing property with values', () => {
    it('updates state', () => {
      const oldState = createState({ hasResourceWithLiteral: true })

      const action = {
        type: 'ADD_PROPERTY',
        payload: {
          key: 'JQEtq-vmq8',
          subject: { key: 't9zVwg2zO' },
          propertyTemplate: { key: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle' },
          values: [{
            key: 'RxGx7WMh4',
            property: { key: 'JQEtq-vmq8' },
            literal: 'bar',
            lang: 'eng',
            uri: null,
            label: null,
            valueSubject: null,
          }],
          show: true,
          errors: [],
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.properties['JQEtq-vmq8']).toStrictEqual({
        key: 'JQEtq-vmq8',
        subjectKey: 't9zVwg2zO',
        rootSubjectKey: 't9zVwg2zO',
        propertyTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
        valueKeys: ['RxGx7WMh4'],
        show: true,
        errors: [],
        rootPropertyKey: 'JQEtq-vmq8',
        descWithErrorPropertyKeys: [],
        descUriOrLiteralValueKeys: ['RxGx7WMh4'],
      })
      expect(newState.subjects.t9zVwg2zO.propertyKeys).toContain('JQEtq-vmq8')
      // Replaces values
      expect(newState.values.RxGx7WMh4).not.toBeUndefined()
      expect(newState.values.CxGx7WMh2).toBeUndefined()
      expect(newState.subjects.t9zVwg2zO.changed).toBe(true)
    })
  })

  describe('existing uri property with no values', () => {
    it('updates state', () => {
      const oldState = createState({ hasResourceWithUri: true })

      const action = {
        type: 'ADD_PROPERTY',
        payload: {
          key: 'i0SAJP-Zhd',
          subject: { key: 'wihOjn-0Z' },
          propertyTemplate: { key: 'test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf' },
          values: [],
          show: true,
          errors: [],
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.properties['i0SAJP-Zhd']).toStrictEqual({
        key: 'i0SAJP-Zhd',
        subjectKey: 'wihOjn-0Z',
        rootSubjectKey: 'wihOjn-0Z',
        propertyTemplateKey: 'test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf',
        valueKeys: [],
        show: true,
        errors: ['Required'],
        rootPropertyKey: 'i0SAJP-Zhd',
        descUriOrLiteralValueKeys: [],
        descWithErrorPropertyKeys: ['i0SAJP-Zhd'],
      })
      expect(newState.subjects['wihOjn-0Z'].propertyKeys).toContain('i0SAJP-Zhd')
      expect(newState.values['s8-qt3-uu']).toBeUndefined()
      expect(newState.subjects['wihOjn-0Z'].changed).toBe(true)
      // Removes from bfWorkRefs
      expect(newState.subjects['wihOjn-0Z'].bfWorkRefs).toHaveLength(0)
    })
  })

  describe('property with validation error', () => {
    it('adds error', () => {
      const oldState = createState({ hasResourceWithLiteral: true })
      oldState.entities.propertyTemplates['ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle'].required = true

      const action = {
        type: 'ADD_PROPERTY',
        payload: {
          key: 'vmq88891',
          subject: { key: 't9zVwg2zO' },
          propertyTemplate: { key: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle' },
          values: [],
          show: true,
          errors: [],
        },
      }
      const newState = reducer(oldState.entities, action)
      expect(newState.properties.vmq88891).toStrictEqual({
        key: 'vmq88891',
        subjectKey: 't9zVwg2zO',
        rootSubjectKey: 't9zVwg2zO',
        propertyTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
        valueKeys: [],
        show: true,
        errors: ['Required'],
        rootPropertyKey: 'vmq88891',
        descUriOrLiteralValueKeys: [],
        descWithErrorPropertyKeys: ['vmq88891'],
      })

      expect(newState.subjects.t9zVwg2zO.descWithErrorPropertyKeys).toContain('vmq88891')
    })
  })
})

describe('addSubject()', () => {
  describe('new subject with no properties and matching resource key', () => {
    it('updates state', () => {
      const oldState = createState()

      const action = {
        type: 'ADD_SUBJECT',
        payload: {
          key: '45689df',
          properties: [],
          subjectTemplate: { key: 'resourceTemplate:bf2:Identifiers:Barcode' },
          uri: null,
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.subjects).toStrictEqual({
        '45689df': {
          key: '45689df',
          propertyKeys: [],
          uri: null,
          rootSubjectKey: '45689df',
          bfAdminMetadataRefs: [],
          bfInstanceRefs: [],
          bfItemRefs: [],
          bfWorkRefs: [],
          changed: true,
          group: null,
          editGroups: [],
          subjectTemplateKey: 'resourceTemplate:bf2:Identifiers:Barcode',
          descUriOrLiteralValueKeys: [],
          descWithErrorPropertyKeys: [],
          valueSubjectOfKey: null,
          rootPropertyKey: null,
        },
      })
    })
  })

  describe('new subject with no properties and different resource key', () => {
    it('updates state', () => {
      const oldState = createState({ hasResourceWithLiteral: true })

      const action = {
        type: 'ADD_SUBJECT',
        payload: {
          key: '45689df',
          properties: [],
          subjectTemplate: { key: 'resourceTemplate:bf2:Identifiers:Barcode' },
          uri: null,
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.subjects['45689df']).toStrictEqual({
        key: '45689df',
        propertyKeys: [],
        uri: null,
        rootSubjectKey: '45689df',
        rootPropertyKey: null,
        bfAdminMetadataRefs: [],
        bfInstanceRefs: [],
        bfItemRefs: [],
        bfWorkRefs: [],
        changed: true,
        descUriOrLiteralValueKeys: [],
        descWithErrorPropertyKeys: [],
        group: null,
        editGroups: [],
        subjectTemplateKey: 'resourceTemplate:bf2:Identifiers:Barcode',
        valueSubjectOfKey: null,
      })
    })
  })


  describe('existing subject with properties', () => {
    it('updates state', () => {
      const oldState = createState({ hasResourceWithLiteral: true })

      const action = {
        type: 'ADD_SUBJECT',
        payload: {
          key: 't9zVwg2zO',
          uri: 'https://api.sinopia.io/resource/0894a8b3',
          subjectTemplate: { key: 'ld4p:RT:bf2:Title:AbbrTitle' },
          properties: [
            {
              key: 'KQEtq-vmq9',
              subject: { key: 't9zVwg2zO' },
              propertyTemplate: { key: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle' },
              valueKeys: [],
              show: true,
              errors: [],
            },
          ],
          changed: false,
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.subjects.t9zVwg2zO).toStrictEqual({
        key: 't9zVwg2zO',
        rootSubjectKey: 't9zVwg2zO',
        rootPropertyKey: null,
        valueSubjectOfKey: null,
        descUriOrLiteralValueKeys: [],
        descWithErrorPropertyKeys: [],
        uri: 'https://api.sinopia.io/resource/0894a8b3',
        subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
        propertyKeys: [
          'KQEtq-vmq9',
        ],
        changed: true,
        bfAdminMetadataRefs: [],
        bfInstanceRefs: [],
        bfItemRefs: [],
        bfWorkRefs: [],
        group: null,
        editGroups: [],
      })
      // Replaces values
      expect(newState.properties['KQEtq-vmq9']).not.toBeUndefined()
      expect(newState.properties['JQEtq-vmq8']).toBeUndefined()
    })
  })
})

describe('addValue()', () => {
  const addUriAction = {
    type: 'ADD_VALUE',
    payload: {
      value: {
        key: 'DxGx7WMh3',
        property: { key: 'i0SAJP-Zhd' },
        rootSubjectKey: 'wihOjn-0Z',
        literal: null,
        lang: null,
        uri: 'http://localhost:3000/resource/85770f92-f8cf-48ee-970a-aefc97843749',
        label: null,
        valueSubjectKey: null,
      },
    },
  }

  describe('new literal value', () => {
    it('updates state', () => {
      const oldState = createState({ hasResourceWithLiteral: true })

      const action = {
        type: 'ADD_VALUE',
        payload: {
          value: {
            key: 'DxGx7WMh3',
            property: { key: 'JQEtq-vmq8' },
            literal: 'bar',
            lang: 'eng',
            uri: null,
            label: null,
            valueSubjectKey: null,
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: 'DxGx7WMh3',
        propertyKey: 'JQEtq-vmq8',
        rootSubjectKey: 't9zVwg2zO',
        rootPropertyKey: 'JQEtq-vmq8',
        literal: 'bar',
        lang: 'eng',
        uri: null,
        label: null,
        valueSubjectKey: null,
      })
      expect(newState.properties['JQEtq-vmq8'].valueKeys).toContain('DxGx7WMh3')
      expect(newState.properties['JQEtq-vmq8'].show).toBe(true)
      expect(newState.properties['JQEtq-vmq8'].descUriOrLiteralValueKeys).toContain('DxGx7WMh3')
      expect(newState.subjects.t9zVwg2zO.descUriOrLiteralValueKeys).toContain('DxGx7WMh3')
    })
  })

  describe('new literal value with siblingValueKey', () => {
    it('updates state', () => {
      const oldState = createState({ hasResourceWithLiteral: true })
      oldState.entities.properties['JQEtq-vmq8'].valueKeys = ['abc123', 'def456']

      const action = {
        type: 'ADD_VALUE',
        payload: {
          value: {
            key: 'DxGx7WMh3',
            property: { key: 'JQEtq-vmq8' },
            literal: 'bar',
            lang: 'eng',
            uri: null,
            label: null,
            valueSubjectKey: null,
          },
          siblingValueKey: 'abc123',
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.properties['JQEtq-vmq8'].valueKeys).toEqual(['abc123', 'DxGx7WMh3', 'def456'])
    })
  })

  describe('existing nested resource value', () => {
    it('updates state', () => {
      const oldState = createState({ hasResourceWithNestedResource: true })

      const action = {
        type: 'ADD_VALUE',
        payload: {
          value: {
            key: 'VDOeQCnFA8',
            property: { key: 'v1o90QO1Qx' },
            literal: null,
            lang: null,
            uri: null,
            label: null,
            valueSubject: {
              key: 'YPb8jaPW1',
              uri: null,
              subjectTemplate: { key: 'resourceTemplate:testing:uber2' },
              properties: [],
            },
          },
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.values.VDOeQCnFA8).toStrictEqual({
        key: 'VDOeQCnFA8',
        propertyKey: 'v1o90QO1Qx',
        rootSubjectKey: 'ljAblGiBW',
        rootPropertyKey: 'v1o90QO1Qx',
        literal: null,
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: 'YPb8jaPW1',
      })
      // Replaces subjects
      expect(newState.subjects.YPb8jaPW1).not.toBeUndefined()
      expect(newState.subjects.JXPb8jaPWo).toBeUndefined()
    })
  })

  describe('new uri value that is a bf Work ref', () => {
    it('updates state', () => {
      const oldState = createState({ hasResourceWithUri: true })

      const newState = reducer(oldState.entities, addUriAction)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: 'DxGx7WMh3',
        propertyKey: 'i0SAJP-Zhd',
        rootSubjectKey: 'wihOjn-0Z',
        rootPropertyKey: 'i0SAJP-Zhd',
        literal: null,
        lang: null,
        uri: 'http://localhost:3000/resource/85770f92-f8cf-48ee-970a-aefc97843749',
        label: null,
        valueSubjectKey: null,
      })
      expect(newState.properties['i0SAJP-Zhd'].valueKeys).toContain('DxGx7WMh3')
      expect(newState.properties['i0SAJP-Zhd'].show).toBe(true)
      expect(newState.subjects['wihOjn-0Z'].bfAdminMetadataRefs).toHaveLength(0)
      expect(newState.subjects['wihOjn-0Z'].bfInstanceRefs).toHaveLength(0)
      expect(newState.subjects['wihOjn-0Z'].bfItemRefs).toHaveLength(0)
      expect(newState.subjects['wihOjn-0Z'].bfWorkRefs).toEqual(['http://localhost:3000/resource/74770f92-f8cf-48ee-970a-aefc97843738', 'http://localhost:3000/resource/85770f92-f8cf-48ee-970a-aefc97843749'])
    })
  })

  describe('new uri value that is a bf Instance ref', () => {
    it('updates state', () => {
      const oldState = createState({ hasResourceWithUri: true })
      oldState.entities.propertyTemplates['test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf'].uri = 'http://id.loc.gov/ontologies/bibframe/hasInstance'

      const newState = reducer(oldState.entities, addUriAction)

      expect(newState.subjects['wihOjn-0Z'].bfAdminMetadataRefs).toHaveLength(0)
      expect(newState.subjects['wihOjn-0Z'].bfInstanceRefs).toEqual(['http://localhost:3000/resource/85770f92-f8cf-48ee-970a-aefc97843749'])
      expect(newState.subjects['wihOjn-0Z'].bfItemRefs).toHaveLength(0)
      expect(newState.subjects['wihOjn-0Z'].bfWorkRefs).toHaveLength(1)
    })
  })

  describe('new uri value that is a bf Item ref', () => {
    it('updates state', () => {
      const oldState = createState({ hasResourceWithUri: true })
      // Ignore the key here.
      oldState.entities.propertyTemplates['test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf'].uri = 'http://id.loc.gov/ontologies/bibframe/hasItem'

      const newState = reducer(oldState.entities, addUriAction)

      expect(newState.subjects['wihOjn-0Z'].bfAdminMetadataRefs).toHaveLength(0)
      expect(newState.subjects['wihOjn-0Z'].bfInstanceRefs).toHaveLength(0)
      expect(newState.subjects['wihOjn-0Z'].bfItemRefs).toEqual(['http://localhost:3000/resource/85770f92-f8cf-48ee-970a-aefc97843749'])
      expect(newState.subjects['wihOjn-0Z'].bfWorkRefs).toHaveLength(1)
    })
  })

  describe('new uri value that is a bf Admin Metadata ref', () => {
    it('updates state', () => {
      const oldState = createState({ hasResourceWithUri: true })
      // Ignore the key here.
      oldState.entities.propertyTemplates['test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf'].uri = 'http://id.loc.gov/ontologies/bibframe/adminMetadata'

      const newState = reducer(oldState.entities, addUriAction)

      expect(newState.subjects['wihOjn-0Z'].bfAdminMetadataRefs).toEqual(['http://localhost:3000/resource/85770f92-f8cf-48ee-970a-aefc97843749'])
      expect(newState.subjects['wihOjn-0Z'].bfInstanceRefs).toHaveLength(0)
      expect(newState.subjects['wihOjn-0Z'].bfItemRefs).toHaveLength(0)
      expect(newState.subjects['wihOjn-0Z'].bfWorkRefs).toHaveLength(1)
    })
  })
})

describe('clearResource()', () => {
  it('removes resource', () => {
    const oldState = createState({ hasResourceWithLiteral: true })

    const action = {
      type: 'CLEAR_RESOURCE',
      payload: 't9zVwg2zO',
    }

    const newState = reducer(oldState.entities, action)
    expect(Object.keys(newState.subjects)).toHaveLength(0)
    expect(Object.keys(newState.properties)).toHaveLength(0)
    expect(Object.keys(newState.values)).toHaveLength(0)
  })
})

describe('clearResourceFromEditor()', () => {
  it('removes resource', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.editor.errors['resourceedit-t9zVwg2zO'] = ['An error']

    const action = {
      type: 'CLEAR_RESOURCE',
      payload: 't9zVwg2zO',
    }

    const newState = editorReducer(oldState.editor, action)
    expect(newState.errors['resourceedit-t9zVwg2zO']).toBe(undefined)
    expect(newState.currentResource).toBe(null)
    expect(newState.currentResourceIsReadOnly).toBe(undefined)
    expect(newState.resources).toStrictEqual([])
  })
})


describe('hideProperty()', () => {
  it('sets show to false for property', () => {
    const oldState = {
      properties: {
        'kqKVn-1TbC': {
          key: 'kqKVn-1TbC',
          show: true,
        },
      },
    }

    const action = {
      type: 'HIDE_PROPERTY',
      payload: 'kqKVn-1TbC',
    }

    const newState = reducer(oldState, action)
    expect(newState.properties['kqKVn-1TbC'].show).toBeFalsy()
  })
})

describe('removeSubject()', () => {
  it('removes a subject from state', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    const action = {
      type: 'REMOVE_SUBJECT',
      payload: 't9zVwg2zO',
    }

    const newState = reducer(oldState.entities, action)
    expect(newState.subjects.t9zVwg2zO).toBe(undefined)
    expect(newState.properties['JQEtq-vmq8']).toBe(undefined)
    expect(newState.values.CxGx7WMh2).toBe(undefined)
  })
})

describe('removeValue()', () => {
  describe('without an error', () => {
    it('removes a value for a property', () => {
      const oldState = createState({ hasResourceWithLiteral: true })
      const action = {
        type: 'REMOVE_VALUE',
        payload: 'CxGx7WMh2',
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.values.CxGx7WMh2).toBe(undefined)
      expect(newState.properties['JQEtq-vmq8'].valueKeys).not.toContain('CxGx7WMh2')
      expect(newState.properties['JQEtq-vmq8'].errors).toHaveLength(0)
      expect(newState.properties['JQEtq-vmq8'].descUriOrLiteralValueKeys).not.toContain('CxGx7WMh2')
      expect(newState.subjects.t9zVwg2zO.changed).toBe(true)
      expect(newState.subjects.t9zVwg2zO.descUriOrLiteralValueKeys).not.toContain('CxGx7WMh2')
    })
  })
  describe('with an error', () => {
    it('removes a value for a property and clears error', () => {
      const oldState = createState({ hasResourceWithLiteral: true, hasError: true })
      oldState.entities.propertyTemplates['ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle'].required = false
      const action = {
        type: 'REMOVE_VALUE',
        payload: 'CxGx7WMh2',
      }

      expect(oldState.entities.properties['JQEtq-vmq8'].descWithErrorPropertyKeys).toContain('JQEtq-vmq8')
      expect(oldState.entities.subjects.t9zVwg2zO.descWithErrorPropertyKeys).toContain('JQEtq-vmq8')

      const newState = reducer(oldState.entities, action)
      expect(newState.values.CxGx7WMh2).toBe(undefined)
      expect(newState.properties['JQEtq-vmq8'].valueKeys).not.toContain('CxGx7WMh2')
      expect(newState.properties['JQEtq-vmq8'].errors).toHaveLength(0)
      expect(newState.properties['JQEtq-vmq8'].descUriOrLiteralValueKeys).not.toContain('CxGx7WMh2')
      expect(newState.subjects.t9zVwg2zO.changed).toBe(true)
      expect(newState.subjects.t9zVwg2zO.descUriOrLiteralValueKeys).not.toContain('CxGx7WMh2')
      expect(newState.properties['JQEtq-vmq8'].descWithErrorPropertyKeys).not.toContain('JQEtq-vmq8')
      expect(newState.subjects.t9zVwg2zO.descWithErrorPropertyKeys).not.toContain('JQEtq-vmq8')
    })
  })
})

describe('saveResourceFinished()', () => {
  it('sets resource as changed and date of last save', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.entities.subjects.t9zVwg2zO.changed = true
    const action = {
      type: 'SAVE_RESOURCE_FINISHED',
      payload: {
        resourceKey: 't9zVwg2zO',
        timestamp: 1594667068562,
      },
    }
    const newState = reducer(oldState.entities, action)
    expect(newState.subjects.t9zVwg2zO.changed).toBe(false)

    const newState2 = editorReducer(oldState.editor, action)
    expect(newState2.lastSave.t9zVwg2zO).toBe(1594667068562)
  })
})

describe('loadResourceFinished()', () => {
  it('sets resource as not changed', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.entities.subjects.t9zVwg2zO.changed = true
    const action = {
      type: 'LOAD_RESOURCE_FINISHED',
      payload: 't9zVwg2zO',
    }
    const newState = reducer(oldState.entities, action)
    expect(newState.subjects.t9zVwg2zO.changed).toBe(false)
  })
})

describe('setBaseURL()', () => {
  it('sets base url', () => {
    const oldState = {
      subjects: {
        abcde345: {
          uri: '',
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
      subjects: {
        abcde345: {
          uri: 'https://sinopia.io/stanford/456hkl',
        },
      },
    })
  })
})

describe('setCurrentResource()', () => {
  it('sets current resource if resource is in editor resources', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.editor.currentResource = 'abc123'

    const action = {
      type: 'SET_CURRENT_RESOURCE',
      payload: 't9zVwg2zO',
    }

    const newState = editorReducer(oldState.editor, action)
    expect(newState.currentResource).toBe('t9zVwg2zO')
    expect(newState.resources).toStrictEqual(['t9zVwg2zO'])
  })

  it('sets current resource and adds to editor resources', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.editor.resources = []

    const action = {
      type: 'SET_CURRENT_RESOURCE',
      payload: 't9zVwg2zO',
    }

    const newState = editorReducer(oldState.editor, action)
    expect(newState.currentResource).toBe('t9zVwg2zO')
    expect(newState.resources).toStrictEqual(['t9zVwg2zO'])
  })
})

describe('setCurrentResourceIsReadOnly()', () => {
  it('sets current resource to read-only', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.editor.currentResourceIsReadOnly = undefined
    expect(oldState.editor.currentResourceIsReadOnly).toBeUndefined()

    const action = {
      type: 'SET_CURRENT_RESOURCE_IS_READ_ONLY',
      payload: true,
    }

    const newState = editorReducer(oldState.editor, action)
    expect(newState.currentResourceIsReadOnly).toBe(true)
  })

  it('sets current resource to not read-only', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.editor.currentResourceIsReadOnly = true
    expect(oldState.editor.currentResourceIsReadOnly).toBe(true)

    const action = {
      type: 'SET_CURRENT_RESOURCE_IS_READ_ONLY',
      payload: undefined,
    }

    const newState = editorReducer(oldState.editor, action)
    expect(newState.currentResourceIsReadOnly).toBeUndefined()
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

    const newState = editorReducer(oldState.editor, action)
    expect(newState.unusedRDF.t9zVwg2zO).toBe('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> \'abcde\' .')
  })
})

describe('showProperty()', () => {
  it('sets show to true for property', () => {
    const oldState = {
      properties: {
        'kqKVn-1TbC': {
          key: 'kqKVn-1TbC',
          subjectKey: 'BraIA_lBw',
          propertyTemplateKey: 'resourceTemplate:bf2:Identifiers:Barcode > http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
          show: false,
        },
      },
    }
    const action = {
      type: 'SHOW_PROPERTY',
      payload: 'kqKVn-1TbC',
    }
    const newState = reducer(oldState, action)
    expect(newState.properties['kqKVn-1TbC'].show).toBeTruthy()
  })
})

describe('setResourceGroup()', () => {
  it('sets group', () => {
    const oldState = {
      subjects: {
        abcde345: {},
      },
    }
    const action = {
      type: 'SET_RESOURCE_GROUP',
      payload: {
        resourceKey: 'abcde345',
        group: 'stanford',
        editGroups: ['cornell'],
      },
    }
    const newState = reducer(oldState, action)
    expect(newState).toStrictEqual({
      subjects: {
        abcde345: {
          group: 'stanford',
          editGroups: ['cornell'],
        },
      },
    })
  })
})

describe('setValueOrder()', () => {
  it('sets value order', () => {
    const oldState = createState({ hasResourceWithTwoNestedResources: true })

    expect(oldState.entities.properties.v1o90QO1Qx.valueKeys).toEqual(['VDOeQCnFA8', 'VDOeQCnFA9'])
    const subjectKey = oldState.entities.properties.v1o90QO1Qx.subjectKey
    expect(oldState.entities.subjects[subjectKey].changed).toBeFalsy
    const action = {
      type: 'SET_VALUE_ORDER',
      payload: {
        valueKey: 'VDOeQCnFA9',
        index: 1,
      },
    }

    const newState = reducer(oldState.entities, action)
    expect(newState.subjects[subjectKey].changed).toBeTruthy

    expect(newState.properties.v1o90QO1Qx.valueKeys).toEqual(['VDOeQCnFA9', 'VDOeQCnFA8'])
  })
})
