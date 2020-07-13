import { loadResourceTemplate } from 'actionCreators/templates'
import Config from 'Config'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { createState } from 'stateUtils'

// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

const mockStore = configureMockStore([thunk])

describe('loadResourceTemplate()', () => {
  describe('a valid template', () => {
    it('returns templates and dispatches actions when loaded', async () => {
      const store = mockStore(createState())

      const [subjectTemplate, propertyTemplates] = await store.dispatch(loadResourceTemplate('ld4p:RT:bf2:Title:AbbrTitle', 'testerrorkey'))
      expect(subjectTemplate).toBeSubjectTemplate('ld4p:RT:bf2:Title:AbbrTitle')
      expect(propertyTemplates).toHaveLength(1)
      expect(propertyTemplates[0]).toBePropertyTemplate('ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle')

      expect(store.getActions()).toEqual([
        {
          type: 'ADD_TEMPLATES',
          payload: {
            subjectTemplate: expect.toBeSubjectTemplate('ld4p:RT:bf2:Title:AbbrTitle'),
            propertyTemplates: [expect.toBePropertyTemplate('ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle')],
          },
        },
      ])
    })
  })

  describe('a template already in state', () => {
    it('returns templates', async () => {
      const store = mockStore(createState({ hasResourceWithLiteral: true }))

      const [subjectTemplate, propertyTemplates] = await store.dispatch(loadResourceTemplate('ld4p:RT:bf2:Title:AbbrTitle', 'testerrorkey'))
      expect(subjectTemplate).toBeSubjectTemplate('ld4p:RT:bf2:Title:AbbrTitle')
      expect(propertyTemplates).toHaveLength(1)
      expect(propertyTemplates[0]).toBePropertyTemplate('ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle')

      expect(store.getActions()).toHaveLength(0)
    })
  })

  describe('an invalid template', () => {
    it('dispatches errors and returns empty', async () => {
      const store = mockStore(createState({ hasResourceWithLiteral: true }))

      const [subjectTemplate, propertyTemplates] = await store.dispatch(loadResourceTemplate('rt:repeated:propertyURI:propertyLabel', 'testerrorkey'))
      expect(subjectTemplate).toBeNull()
      expect(propertyTemplates).toHaveLength(0)

      expect(store.getActions()).toEqual([
        {
          type: 'ADD_ERROR',
          payload: {
            errorKey: 'testerrorkey',
            error: 'Validation error for http://id.loc.gov/ontologies/bibframe/Work: Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.',
          },
        },
      ])
    })
  })

  describe('an error retrieving the template', () => {
    it('dispatches errors and returns empty', async () => {
      const store = mockStore(createState({ hasResourceWithLiteral: true }))

      const [subjectTemplate, propertyTemplates] = await store.dispatch(loadResourceTemplate('ld4p:RT:bf2:xxx', 'testerrorkey'))
      expect(subjectTemplate).toBeNull()
      expect(propertyTemplates).toHaveLength(0)

      expect(store.getActions()).toEqual([
        {
          type: 'ADD_ERROR',
          payload: {
            errorKey: 'testerrorkey',
            error: 'Error retrieving ld4p:RT:bf2:xxx: Error: ERROR: non-fixture resourceTemplate: ld4p:RT:bf2:xxx',
          },
        },
      ])
    })
  })
})
