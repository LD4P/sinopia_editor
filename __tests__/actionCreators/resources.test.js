import {
  newResourceFromN3, loadResource, newResource, newResourceCopy,
  expandProperty, addSiblingValueSubject,
} from 'actionCreators/resources'
import Config from 'Config'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { createState } from 'stateUtils'
import { getFixtureResource, getFixtureResourceTemplate } from 'fixtureLoaderHelper'
import GraphBuilder from 'GraphBuilder'
import { rdfDatasetFromN3 } from 'utilities/Utilities'
import * as sinopiaServer from 'sinopiaServer'
import shortid from 'shortid'
import _ from 'lodash'

jest.mock('sinopiaServer')

beforeEach(() => {
  sinopiaServer.foundResourceTemplate.mockResolvedValue(true)
  sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)
  sinopiaServer.loadRDFResource.mockImplementation(getFixtureResource)
  let counter = 0
  shortid.generate = jest.fn().mockImplementation(() => `abc${counter++}`)
})

// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

const mockStore = configureMockStore([thunk])

// This removes circular references.
const safeAction = (action) => JSON.parse(JSON.safeStringify(action))

describe('newResourceFromN3', () => {
  const expectedAddResourceAction = require('../__action_fixtures__/newResourceFromN3-ADD_SUBJECT.json')

  describe('loading a resource', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const uri = 'https://sinopia.io/repository/cornell/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f'
      const response = await getFixtureResource(null, uri)
      const result = await store.dispatch(newResourceFromN3(response.response.text, uri, null, 'testerrorkey'))
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
      const expectedGraph = await rdfDatasetFromN3(response.response.text.replace(RegExp(`<${uri}>`, 'g'), '<>'))
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
      const uri = 'https://sinopia.io/repository/cornell/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f'
      const response = await getFixtureResource(null, uri)
      const fixtureRdf = response.response.text.replace(RegExp(`<${uri}>`, 'g'), '<>')
      const result = await store.dispatch(newResourceFromN3(fixtureRdf, uri, null, 'testerrorkey'))
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find((action) => action.type === 'ADD_SUBJECT')
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)
    })
  })
  describe('loading a resource with extra triples', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const uri = 'https://sinopia.io/repository/cornell/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f'
      const response = await getFixtureResource(null, uri)
      const extraRdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property6x> <ubertemplate1:property6> .
<x> <http://id.loc.gov/ontologies/bibframe/uber/template1/property6> <ubertemplate1:property6> .
`
      const fixtureRdf = response.response.text + extraRdf
      const result = await store.dispatch(newResourceFromN3(fixtureRdf, uri, null, 'testerrorkey'))
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
      const uri = 'https://sinopia.io/repository/cornell/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f'
      const response = await getFixtureResource(null, uri)
      const result = await store.dispatch(newResourceFromN3(response.response.text, uri, null, 'testerrorkey', true))
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
      const uri = 'https://sinopia.io/repository/cornell/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f'
      const response = await getFixtureResource(null, uri)
      const resourceTemplateId = 'resourceTemplate:testing:uber1'
      // Change the hasResourceTemplate triple.
      const fixtureRdf = response.response.text.replace(resourceTemplateId, `${resourceTemplateId}x`)
      const result = await store.dispatch(newResourceFromN3(fixtureRdf, uri, resourceTemplateId, 'testerrorkey'))
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find((action) => action.type === 'ADD_SUBJECT')
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)
    })
  })

  describe('loading a resource with errors', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const uri = 'https://sinopia.io/repository/cornell/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f-invalid'
      const response = await getFixtureResource(null, uri)
      const result = await store.dispatch(newResourceFromN3(response.response.text, uri, null, 'testerrorkey'))
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
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const uri = 'https://sinopia.io/repository/cornell/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f'
      const result = await store.dispatch(loadResource('jlit', uri, 'testerrorkey'))
      expect(result).toBe(true)

      const actions = store.getActions()
      expect(actions).toHaveAction('CLEAR_ERRORS')
      expect(actions).toHaveAction('ADD_TEMPLATES')
      expect(actions).toHaveAction('ADD_SUBJECT')
      expect(actions).toHaveAction('SET_UNUSED_RDF')
      expect(actions).toHaveAction('SET_CURRENT_RESOURCE')
      expect(actions).toHaveAction('LOAD_RESOURCE_FINISHED')
    })
  })

  describe('loading a new resource', () => {
    const store = mockStore(createState())

    it('dispatches actions', async () => {
      const uri = 'https://sinopia.io/repository/cornell/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f'
      const result = await store.dispatch(loadResource('jlit', uri, 'testerrorkey', true))
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
      const uri = 'https://sinopia.io/repository/cornell/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f-invalid'
      const result = await store.dispatch(loadResource('jlit', uri, 'testerrorkey'))
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
      sinopiaServer.loadRDFResource.mockRejectedValue(new Error('Ooops'))
      const uri = 'https://sinopia.io/repository/cornell/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f'
      const result = await store.dispatch(loadResource('jlit', uri, 'testerrorkey'))
      expect(result).toBe(false)

      const actions = store.getActions()
      expect(actions).toHaveAction('CLEAR_ERRORS')
      expect(actions).toHaveAction('ADD_ERROR', {
        errorKey: 'testerrorkey',
        error: 'Error retrieving resource: Error: Ooops',
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
