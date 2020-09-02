import {
  newResourceFromDataset, loadResource, newResource, newResourceCopy,
  expandProperty, addSiblingValueSubject, saveNewResource, saveResource,
  contractProperty,
} from 'actionCreators/resources'
import mockConsole from 'jest-mock-console'
import * as sinopiaApi from 'sinopiaApi'
import Config from 'Config'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { createState } from 'stateUtils'
import GraphBuilder from 'GraphBuilder'
import { datasetFromN3 } from 'utilities/Utilities'
import shortid from 'shortid'
import _ from 'lodash'


beforeEach(() => {
  let counter = 0
  shortid.generate = jest.fn().mockImplementation(() => `abc${counter++}`)
})

// Support mocking/restoring the `console` object
let restoreConsole = null

// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

const mockStore = configureMockStore([thunk])

// This removes circular references.
const safeAction = (action) => JSON.parse(JSON.safeStringify(action))

const uri = 'http://localhost:3000/repository/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f'
const resourceTemplateId = 'resourceTemplate:testing:uber1'

const n3 = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:b2_c14n0 .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:b2_c14n1 .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:b2_c14n2 .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property2> "Uber template1, property2"@eng .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property4> "Uber template1, property4"@eng .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property5> <ubertemplate1:property5> .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property6> <ubertemplate1:property6> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<ubertemplate1:property5> <http://www.w3.org/2000/01/rdf-schema#label> "ubertemplate1:property5" .
<ubertemplate1:property6> <http://www.w3.org/2000/01/rdf-schema#label> "ubertemplate1:property6" .
_:b2_c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template3/property1> "Uber template3, property1"@eng .
_:b2_c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template3/property2> "Uber template3, property2"@eng .
_:b2_c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber3> .
_:b2_c14n1 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "Uber template2, property1"@eng .
_:b2_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .
_:b2_c14n2 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "Uber template2, property1b"@eng .
_:b2_c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .
`

beforeAll(() => {
  // Capture and not display console output
  restoreConsole = mockConsole(['error', 'debug'])
})

afterAll(() => {
  restoreConsole()
})

describe('newResourceFromDataset', () => {
  const expectedAddResourceAction = require('../__action_fixtures__/newResourceFromDataset-ADD_SUBJECT.json')

  describe('loading a resource', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const dataset = await datasetFromN3(n3.replace(/<>/g, `<${uri}>`))
      const result = await store.dispatch(newResourceFromDataset(dataset, uri, null, 'testerrorkey'))
      expect(result).toBe(true)

      const actions = store.getActions()
      // ADD_TEMPLATES is dispatched numerous times since mock store doesn't update state.
      expect(actions).toHaveAction('ADD_TEMPLATES')

      const addSubjectAction = actions.find((action) => action.type === 'ADD_SUBJECT')
      expect(addSubjectAction).not.toBeNull()
      // safeStringify is used because it removes circular references
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)

      // URI should be set for resource.
      expect(addSubjectAction.payload.uri).toBe(uri)

      // As a bonus check, roundtrip to RDF.
      const actualRdf = new GraphBuilder(addSubjectAction.payload).graph.toCanonical()
      const expectedGraph = await datasetFromN3(n3.replace(/<>/g, `<${uri}>`))
      const expectedRdf = expectedGraph.toCanonical()
      expect(actualRdf).toMatch(expectedRdf)

      expect(actions).toHaveAction('SET_UNUSED_RDF', { resourceKey: 'abc0', rdf: null })
      expect(actions).toHaveAction('SET_CURRENT_RESOURCE', 'abc0')
      expect(actions).toHaveAction('LOAD_RESOURCE_FINISHED', 'abc0')
    })
  })

  describe('loading a legacy resource', () => {
    // Legacy resources have <> as the root resource rather than <[uri]>.
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const dataset = await datasetFromN3(n3)
      const result = await store.dispatch(newResourceFromDataset(dataset, uri, null, 'testerrorkey'))
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find((action) => action.type === 'ADD_SUBJECT')
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)
    })
  })

  describe('loading a resource with extra triples', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const extraRdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property6x> <ubertemplate1:property6> .
<x> <http://id.loc.gov/ontologies/bibframe/uber/template1/property6> <ubertemplate1:property6> .
`
      const dataset = await datasetFromN3(n3 + extraRdf)
      const result = await store.dispatch(newResourceFromDataset(dataset, uri, null, 'testerrorkey'))
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find((action) => action.type === 'ADD_SUBJECT')
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)

      expect(actions).toHaveAction('SET_UNUSED_RDF', { resourceKey: 'abc0', rdf: extraRdf })
    })
  })

  describe('loading a new resource', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const dataset = await datasetFromN3(n3.replace(/<>/g, `<${uri}>`))
      const result = await store.dispatch(newResourceFromDataset(dataset, uri, null, 'testerrorkey', true))
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find((action) => action.type === 'ADD_SUBJECT')

      // URI should not be set for resource.
      expect(addSubjectAction.payload.uri).toBeNull()

      const newExpectedAddResourceAction = _.cloneDeep(expectedAddResourceAction)
      newExpectedAddResourceAction.payload.uri = null
      expect(safeAction(addSubjectAction)).toEqual(newExpectedAddResourceAction)

      // LOAD_RESOURCE_FINISHED marks the resource as unchanged, which isn't wanted when new.
      expect(actions).not.toHaveAction('LOAD_RESOURCE_FINISHED')
    })
  })

  describe('loading a resource with provided resource template id', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      // Change the hasResourceTemplate triple.
      const fixtureRdf = n3.replace(resourceTemplateId, `${resourceTemplateId}x`)
      const dataset = await datasetFromN3(fixtureRdf)
      const result = await store.dispatch(newResourceFromDataset(dataset, uri, resourceTemplateId, 'testerrorkey'))
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find((action) => action.type === 'ADD_SUBJECT')
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)
    })
  })

  describe('loading a resource with errors', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const fixtureRdf = n3.replace(resourceTemplateId, 'rt:repeated:propertyURI:propertyLabel')
      const dataset = await datasetFromN3(fixtureRdf)
      const result = await store.dispatch(newResourceFromDataset(dataset, uri, null, 'testerrorkey'))
      expect(result).toBe(false)

      const actions = store.getActions()
      expect(actions).toHaveAction('ADD_ERROR', {
        errorKey: 'testerrorkey',
        error: 'Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.',
      })
    })
  })
})

describe('loadResource', () => {
  describe('loading a resource', () => {
    const expectedAddResourceAction = require('../__action_fixtures__/loadResource-ADD_SUBJECT.json')
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const uri = 'http://localhost:3000/repository/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f'
      const result = await store.dispatch(loadResource(uri, 'testerrorkey'))
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find((action) => action.type === 'ADD_SUBJECT')
      expect(addSubjectAction).not.toBeNull()
      // safeStringify is used because it removes circular references
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)

      expect(actions).toHaveAction('CLEAR_ERRORS')
      expect(actions).toHaveAction('ADD_TEMPLATES')
      expect(actions).toHaveAction('SET_UNUSED_RDF')
      expect(actions).toHaveAction('SET_CURRENT_RESOURCE')
      expect(actions).toHaveAction('LOAD_RESOURCE_FINISHED')
    })
  })

  describe('loading a new resource', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const uri = 'http://localhost:3000/repository/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f'
      const result = await store.dispatch(loadResource(uri, 'testerrorkey', true))
      expect(result).toBe(true)

      const actions = store.getActions()
      expect(actions).toHaveAction('CLEAR_ERRORS')
      expect(actions).toHaveAction('ADD_TEMPLATES')
      expect(actions).toHaveAction('ADD_SUBJECT')
      expect(actions).toHaveAction('SET_UNUSED_RDF')
      expect(actions).toHaveAction('SET_CURRENT_RESOURCE')
      expect(actions).not.toHaveAction('LOAD_RESOURCE_FINISHED')
    })
  })

  describe('loading an invalid resource', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const uri = 'http://localhost:3000/repository/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f-invalid'
      const result = await store.dispatch(loadResource(uri, 'testerrorkey'))
      expect(result).toBe(false)

      const actions = store.getActions()
      expect(actions).toHaveAction('CLEAR_ERRORS')
      expect(actions).toHaveAction('ADD_ERROR', {
        errorKey: 'testerrorkey',
        error: 'Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.',
      })
    })
  })

  describe('load error', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      // http://error is a special URI that will cause an error to be thrown.
      const result = await store.dispatch(loadResource('http://error', 'testerrorkey'))
      expect(result).toBe(false)

      const actions = store.getActions()
      expect(actions).toHaveAction('CLEAR_ERRORS')
      expect(actions).toHaveAction('ADD_ERROR', {
        errorKey: 'testerrorkey',
        error: 'Error retrieving http://error: Error parsing resource: Ooops',
      })
    })
  })
})

describe('newResource', () => {
  const expectedAddResourceAction = require('../__action_fixtures__/newResource-ADD_SUBJECT.json')

  describe('loading from resource template', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const result = await store.dispatch(newResource('resourceTemplate:testing:uber1', 'testerrorkey'))
      expect(result).toBe(true)

      const actions = store.getActions()
      // ADD_TEMPLATES is dispatched numerous times since mock store doesn't update state.
      expect(actions).toHaveAction('ADD_TEMPLATES')

      const addSubjectAction = actions.find((action) => action.type === 'ADD_SUBJECT')

      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)

      expect(actions).toHaveAction('SET_UNUSED_RDF', { resourceKey: 'abc0', rdf: null })
      expect(actions).toHaveAction('SET_CURRENT_RESOURCE', 'abc0')
      expect(actions).toHaveAction('LOAD_RESOURCE_FINISHED', 'abc0')
      expect(actions).toHaveAction('ADD_TEMPLATE_HISTORY', 'resourceTemplate:testing:uber1')
    })
  })

  describe('loading from invalid resource template', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const result = await store.dispatch(newResource('rt:repeated:propertyURI:propertyLabel', 'testerrorkey'))
      expect(result).toBe(false)

      const actions = store.getActions()
      expect(actions).toHaveAction('ADD_TEMPLATES')
      expect(actions).toHaveAction('ADD_ERROR', {
        errorKey: 'testerrorkey',
        error: 'Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.',
      })
    })
  })
})

describe('newResourceCopy', () => {
  const expectedAddResourceAction = require('../__action_fixtures__/newResourceCopy-ADD_SUBJECT.json')

  describe('loading from existing resource', () => {
    const store = mockStore(createState({ hasResourceWithLiteral: true }))

    it('dispatches actions', async () => {
      await store.dispatch(newResourceCopy('t9zVwg2zO'))

      const actions = store.getActions()

      const addSubjectAction = actions.find((action) => action.type === 'ADD_SUBJECT')

      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)

      expect(actions).toHaveAction('SET_UNUSED_RDF', { resourceKey: 'abc0', rdf: null })
      expect(actions).toHaveAction('SET_CURRENT_RESOURCE', 'abc0')
    })
  })
})

describe('expandProperty', () => {
  describe('expand a nested resource', () => {
    const expectedAddValueAction = require('../__action_fixtures__/expandProperty-ADD_VALUE.json')
    const store = mockStore(createState({ hasResourceWithContractedNestedResource: true }))

    it('dispatches actions', async () => {
      await store.dispatch(expandProperty('v1o90QO1Qx', 'testerrorkey'))

      const actions = store.getActions()

      const addValueAction = actions.find((action) => action.type === 'ADD_VALUE')
      expect(safeAction(addValueAction)).toEqual(expectedAddValueAction)

      expect(actions).toHaveAction('ADD_TEMPLATES')
      expect(actions).toHaveAction('SHOW_PROPERTY', 'v1o90QO1Qx')
    })
  })

  describe('expand a literal', () => {
    const expectedAddPropertyAction = require('../__action_fixtures__/expandProperty-ADD_PROPERTY.json')
    const store = mockStore(createState({ hasResourceWithContractedLiteral: true }))

    it('dispatches actions', async () => {
      await store.dispatch(expandProperty('JQEtq-vmq8', 'testerrorkey'))

      const actions = store.getActions()

      const addPropertyAction = actions.find((action) => action.type === 'ADD_PROPERTY')
      expect(safeAction(addPropertyAction)).toEqual(expectedAddPropertyAction)

      expect(actions).toHaveAction('SHOW_PROPERTY', 'JQEtq-vmq8')
    })
  })
})

describe('addSiblingValueSubject', () => {
  const expectedAddValueAction = require('../__action_fixtures__/addSiblingValueSubject-ADD_VALUE.json')
  const store = mockStore(createState({ hasResourceWithNestedResource: true }))

  it('dispatches actions', async () => {
    await store.dispatch(addSiblingValueSubject('VDOeQCnFA8', 'testerrorkey'))

    const actions = store.getActions()

    const addValueAction = actions.find((action) => action.type === 'ADD_VALUE')
    expect(safeAction(addValueAction)).toEqual(expectedAddValueAction)
  })
})


describe('saveNewResource', () => {
  const uri = 'http://localhost:3000/repository/abcdeghij23455'


  it('saves a new resource', async () => {
    const store = mockStore(createState({ hasResourceWithLiteral: true }))
    sinopiaApi.postResource = jest.fn().mockResolvedValue(uri)

    await store.dispatch(saveNewResource('t9zVwg2zO', 'stanford', 'testerror'))

    const actions = store.getActions()

    expect(actions).toHaveAction('SET_BASE_URL')
    expect(actions).toHaveAction('SAVE_RESOURCE_FINISHED')

    const saveResourceFinishedAction = actions.find((action) => action.type === 'SAVE_RESOURCE_FINISHED')
    expect(safeAction(saveResourceFinishedAction)).toEqual({
      type: 'SAVE_RESOURCE_FINISHED',
      payload: 't9zVwg2zO',
    })
  })

  it('error when saving a new resource', async () => {
    const store = mockStore(createState({ hasResourceWithLiteral: true }))
    sinopiaApi.postResource.mockRejectedValue(new Error('Messed-up'))

    await store.dispatch(saveNewResource('t9zVwg2zO', 'stanford', 'testerror'))

    const actions = store.getActions()


    expect(actions).toHaveAction('ADD_ERROR', {
      errorKey: 'testerror',
      error: 'Error saving: Messed-up',
    })
  })
})

describe('saveResource', () => {
  it('saves an existing resource', async () => {
    sinopiaApi.putResource = jest.fn().mockResolvedValue('t9zVwg2zO')
    const store = mockStore(createState({ hasResourceWithLiteral: true }))

    await store.dispatch(saveResource('t9zVwg2zO', 'testerror'))
    const actions = store.getActions()
    expect(actions).toHaveAction('SAVE_RESOURCE_FINISHED')
  })

  it('error when trying to save existing resource', async () => {
    sinopiaApi.putResource = jest.fn().mockRejectedValue(new Error('Messed-up'))
    const store = mockStore(createState({ hasResourceWithLiteral: true }))
    await store.dispatch(saveResource('t9zVwg2zO', 'testerror'))
    const actions = store.getActions()
    expect(actions).toHaveAction('ADD_ERROR', {
      errorKey: 'testerror',
      error: 'Error saving: Messed-up',
    })
  })
})

describe('contractProperty', () => {
  const store = mockStore(createState({ hasResourceWithLiteral: true }))

  it('removes a property values from state', async () => {
    await store.dispatch(contractProperty('JQEtq-vmq8'))
    const actions = store.getActions()
    expect(actions).toHaveAction('REMOVE_PROPERTY')
  })
})
