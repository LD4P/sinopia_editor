import { validateTemplates } from 'actionCreators/templateValidationHelpers'
import Config from 'Config'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { createState } from 'stateUtils'

// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

const mockStore = configureMockStore([thunk])

describe('validateTemplates()', () => {
  describe('a valid template', () => {
    const subjectTemplate = {
      key: 'resourceTemplate:bf2:Title',
      id: 'resourceTemplate:bf2:Title',
      class: 'http://id.loc.gov/ontologies/bibframe/Title',
      label: 'Instance Title',
      author: undefined,
      remark: 'Title information relating to a resource: work title, preferred title, instance title, transcribed title, translated title, variant form of title, etc.',
      date: undefined,
      propertyTemplateKeys: [
        'resourceTemplate:bf2:Title > http://id.loc.gov/ontologies/bibframe/mainTitle',
        'resourceTemplate:bf2:Title > http://id.loc.gov/ontologies/bibframe/subtitle',
        'resourceTemplate:bf2:Title > http://id.loc.gov/ontologies/bibframe/partNumber',
        'resourceTemplate:bf2:Title > http://id.loc.gov/ontologies/bibframe/partName',
        'resourceTemplate:bf2:Title > http://id.loc.gov/ontologies/bibframe/note',
      ],
      propertyTemplates: [
        {
          key: 'resourceTemplate:bf2:Title > http://id.loc.gov/ontologies/bibframe/mainTitle',
          subjectTemplateKey: 'resourceTemplate:bf2:Title',
          label: 'Title Proper (RDA 2.3.2) (BIBFRAME: Main title)',
          uri: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
          required: false,
          repeatable: true,
          defaults: [],
          remark: null,
          remarkUrl: null,
          type: 'literal',
          component: 'InputLiteral',
          valueSubjectTemplateKeys: [],
          authorities: [],
        },
        {
          key: 'resourceTemplate:bf2:Title > http://id.loc.gov/ontologies/bibframe/subtitle',
          subjectTemplateKey: 'resourceTemplate:bf2:Title',
          label: 'Other Title Information (RDA 2.3.4) (BIBFRAME: Subtitle)',
          uri: 'http://id.loc.gov/ontologies/bibframe/subtitle',
          required: false,
          repeatable: true,
          defaults: [],
          remark: null,
          remarkUrl: null,
          type: 'literal',
          component: 'InputLiteral',
          valueSubjectTemplateKeys: [],
          authorities: [],
        },
        {
          key: 'resourceTemplate:bf2:Title > http://id.loc.gov/ontologies/bibframe/partNumber',
          subjectTemplateKey: 'resourceTemplate:bf2:Title',
          label: 'Part number',
          uri: 'http://id.loc.gov/ontologies/bibframe/partNumber',
          required: false,
          repeatable: true,
          defaults: [],
          remark: undefined,
          remarkUrl: null,
          type: 'literal',
          component: 'InputLiteral',
          valueSubjectTemplateKeys: [],
          authorities: [],
        },
        {
          key: 'resourceTemplate:bf2:Title > http://id.loc.gov/ontologies/bibframe/partName',
          subjectTemplateKey: 'resourceTemplate:bf2:Title',
          label: 'Part name',
          uri: 'http://id.loc.gov/ontologies/bibframe/partName',
          required: false,
          repeatable: true,
          defaults: [],
          remark: undefined,
          remarkUrl: null,
          type: 'literal',
          component: 'InputLiteral',
          valueSubjectTemplateKeys: [],
          authorities: [],
        },
        {
          key: 'resourceTemplate:bf2:Title > http://id.loc.gov/ontologies/bibframe/note',
          subjectTemplateKey: 'resourceTemplate:bf2:Title',
          label: 'Note on title',
          uri: 'http://id.loc.gov/ontologies/bibframe/note',
          required: false,
          repeatable: true,
          defaults: [],
          remark: null,
          remarkUrl: null,
          type: 'resource',
          component: 'NestedResource',
          valueSubjectTemplateKeys: ['resourceTemplate:bf2:Title:Note'],
          authorities: [],
        },
      ],
    }

    it('returns no errors', async () => {
      const store = mockStore(createState())

      expect(await store.dispatch(validateTemplates(subjectTemplate, {}, 'testerrorkey'))).toBe(true)
      expect(store.getActions()).toHaveAction('ADD_TEMPLATES')
      expect(store.getActions()).not.toHaveAction('ADD_ERROR')
    })
  })

  describe('template with bad subject template', () => {
    const subjectTemplate = {
      key: undefined,
      id: undefined,
      class: undefined,
      label: undefined,
      author: 'LD4P',
      remark: undefined,
      date: '2019-08-19',
      propertyTemplateKeys: [],
      propertyTemplates: [],
    }

    it('returns error', async () => {
      const store = mockStore(createState())

      expect(await store.dispatch(validateTemplates(subjectTemplate, {}, 'testerrorkey'))).toBe(false)
      const payload1 = {
        errorKey: 'testerrorkey',
        error: 'Resource template id is missing from resource template.',
      }
      expect(store.getActions()).toHaveAction('ADD_ERROR', payload1)
      const payload2 = {
        errorKey: 'testerrorkey',
        error: 'Resource template class is missing from resource template.',
      }
      expect(store.getActions()).toHaveAction('ADD_ERROR', payload2)
      const payload3 = {
        errorKey: 'testerrorkey',
        error: 'Resource template label is missing from resource template.',
      }
      expect(store.getActions()).toHaveAction('ADD_ERROR', payload3)
    })
  })

  describe('template with property template missing propertyURI', () => {
    const subjectTemplate = {
      key: 'ld4p:RT:bf2:Title:AbbrTitle',
      id: 'ld4p:RT:bf2:Title:AbbrTitle',
      class: 'http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle',
      label: 'Abbreviated Title',
      author: undefined,
      remark: undefined,
      date: undefined,
      propertyTemplateKeys: ['ld4p:RT:bf2:Title:AbbrTitle > undefined'],
      propertyTemplates: [
        {
          key: 'ld4p:RT:bf2:Title:AbbrTitle > undefined',
          subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
          label: undefined,
          uri: undefined,
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
    it('returns error', async () => {
      const store = mockStore(createState())

      expect(await store.dispatch(validateTemplates(subjectTemplate, {}, 'testerrorkey'))).toBe(false)
      const payload = {
        errorKey: 'testerrorkey',
        error: 'Property template URI is required.',
      }
      expect(store.getActions()).toHaveAction('ADD_ERROR', payload)
    })
  })

  describe('template with bad property template', () => {
    const subjectTemplate = {
      key: 'ld4p:RT:bf2:Title:AbbrTitle',
      id: 'ld4p:RT:bf2:Title:AbbrTitle',
      class: 'http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle',
      label: 'Abbreviated Title',
      author: undefined,
      remark: undefined,
      date: undefined,
      propertyTemplateKeys: [
        'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      ],
      propertyTemplates: [
        {
          key: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
          subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
          label: undefined,
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
    it('returns error', async () => {
      const store = mockStore(createState())

      expect(await store.dispatch(validateTemplates(subjectTemplate, {}, 'testerrorkey'))).toBe(false)
      const payload1 = {
        errorKey: 'testerrorkey',
        error: 'Property template label is required for http://id.loc.gov/ontologies/bibframe/mainTitle.',
      }
      expect(store.getActions()).toHaveAction('ADD_ERROR', payload1)
      const payload2 = {
        errorKey: 'testerrorkey',
        error: 'Cannot determine type for http://id.loc.gov/ontologies/bibframe/mainTitle. Must be resource, lookup, or literal.',
      }
      expect(store.getActions()).toHaveAction('ADD_ERROR', payload2)
      const payload3 = {
        errorKey: 'testerrorkey',
        error: 'Cannot determine component for http://id.loc.gov/ontologies/bibframe/mainTitle.',
      }
      expect(store.getActions()).toHaveAction('ADD_ERROR', payload3)
    })
  })

  describe('template with missing authority configs', () => {
    const subjectTemplate = {
      key: 'test:resource:SinopiaLookup',
      id: 'test:resource:SinopiaLookup',
      class: 'http://id.loc.gov/ontologies/bibframe/Instance',
      label: 'Testing sinopia lookup',
      author: undefined,
      remark: undefined,
      date: undefined,
      propertyTemplateKeys: [
        'test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf',
      ],
      propertyTemplates: [
        {
          key: 'test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf',
          subjectTemplateKey: 'test:resource:SinopiaLookup',
          label: 'Instance of (lookup)',
          uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
          required: true,
          repeatable: false,
          defaults: [],
          remark: undefined,
          remarkUrl: null,
          type: 'uri',
          component: null,
          valueSubjectTemplateKeys: null,
          authorities: [{ uri: 'xurn:ld4p:sinopia:bibframe:instance' }],
        },
      ],
    }

    it('returns error', async () => {
      const store = mockStore(createState())

      expect(await store.dispatch(validateTemplates(subjectTemplate, {}, 'testerrorkey'))).toBe(false)
      const payload = {
        errorKey: 'testerrorkey',
        error: 'Misconfigured authority xurn:ld4p:sinopia:bibframe:instance for http://id.loc.gov/ontologies/bibframe/instanceOf.',
      }
      expect(store.getActions()).toHaveAction('ADD_ERROR', payload)
    })
  })

  describe('template with repeated properties', () => {
    const subjectTemplate = {
      key: 'rt:repeated:propertyURI:propertyLabel',
      id: 'rt:repeated:propertyURI:propertyLabel',
      class: 'http://id.loc.gov/ontologies/bibframe/Work',
      label: 'repeated propertyURI with differing propertyLabel',
      author: 'michelle',
      remark: undefined,
      date: undefined,
      propertyTemplateKeys: [
        'rt:repeated:propertyURI:propertyLabel > http://id.loc.gov/ontologies/bibframe/geographicCoverage',
        'rt:repeated:propertyURI:propertyLabel > http://id.loc.gov/ontologies/bibframe/geographicCoverage',
      ],
      propertyTemplates: [
        {
          key: 'rt:repeated:propertyURI:propertyLabel > http://id.loc.gov/ontologies/bibframe/geographicCoverage',
          subjectTemplateKey: 'rt:repeated:propertyURI:propertyLabel',
          label: 'Geographic Coverage 1',
          uri: 'http://id.loc.gov/ontologies/bibframe/geographicCoverage',
          required: false,
          repeatable: true,
          defaults: [],
          remark: 'tooltip 1',
          remarkUrl: null,
          type: 'literal',
          component: 'InputLiteral',
          valueSubjectTemplateKeys: [],
          authorities: [],
        },
        {
          key: 'rt:repeated:propertyURI:propertyLabel > http://id.loc.gov/ontologies/bibframe/geographicCoverage',
          subjectTemplateKey: 'rt:repeated:propertyURI:propertyLabel',
          label: 'Geographic Coverage 2',
          uri: 'http://id.loc.gov/ontologies/bibframe/geographicCoverage',
          required: false,
          repeatable: true,
          defaults: [],
          remark: 'tooltip 2',
          remarkUrl: null,
          type: 'literal',
          component: 'InputLiteral',
          valueSubjectTemplateKeys: [],
          authorities: [],
        },
      ],
    }

    it('returns error', async () => {
      const store = mockStore(createState())

      expect(await store.dispatch(validateTemplates(subjectTemplate, {}, 'testerrorkey'))).toBe(false)
      const payload = {
        errorKey: 'testerrorkey',
        error: 'Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.',
      }
      expect(store.getActions()).toHaveAction('ADD_ERROR', payload)
    })
  })

  describe('template with missing resource templates', () => {
    const subjectTemplate = {
      key: 'test:RT:bf2:notFoundValueTemplateRefs',
      id: 'test:RT:bf2:notFoundValueTemplateRefs',
      class: 'http://id.loc.gov/ontologies/bibframe/Identifier',
      label: 'Not found value template refs',
      author: 'Justin Littman',
      remark: undefined,
      date: '2019-08-19',
      propertyTemplateKeys: [
        'test:RT:bf2:notFoundValueTemplateRefs > http://id.loc.gov/ontologies/bibframe/Barcode',
        'test:RT:bf2:notFoundValueTemplateRefs > http://id.loc.gov/ontologies/bibframe/CopyrightRegistration',
      ],
      propertyTemplates: [
        {
          key: 'test:RT:bf2:notFoundValueTemplateRefs > http://id.loc.gov/ontologies/bibframe/Barcode',
          subjectTemplateKey: 'test:RT:bf2:notFoundValueTemplateRefs',
          label: 'Barcode',
          uri: 'http://id.loc.gov/ontologies/bibframe/Barcode',
          required: false,
          repeatable: true,
          defaults: [],
          remark: undefined,
          remarkUrl: null,
          type: 'resource',
          component: 'NestedResource',
          valueSubjectTemplateKeys: ['lc:RT:bf2:Identifiers:Barcode'],
          authorities: [],
        },
        {
          key: 'test:RT:bf2:notFoundValueTemplateRefs > http://id.loc.gov/ontologies/bibframe/CopyrightRegistration',
          subjectTemplateKey: 'test:RT:bf2:notFoundValueTemplateRefs',
          label: 'Copyright Registration Number',
          uri: 'http://id.loc.gov/ontologies/bibframe/CopyrightRegistration',
          required: false,
          repeatable: true,
          defaults: [],
          remark: undefined,
          remarkUrl: null,
          type: 'resource',
          component: 'NestedResource',
          valueSubjectTemplateKeys: ['lc:RT:bf2:Identifiers:Copyright'],
          authorities: [],
        },
      ],
    }

    it('returns error', async () => {
      const store = mockStore(createState())

      expect(await store.dispatch(validateTemplates(subjectTemplate, {}, 'testerrorkey'))).toBe(false)
      const payload = {
        errorKey: 'testerrorkey',
        error: 'The following referenced resource templates are not available in Sinopia: lc:RT:bf2:Identifiers:Barcode, lc:RT:bf2:Identifiers:Copyright',
      }
      expect(store.getActions()).toHaveAction('ADD_ERROR', payload)
    })
  })

  describe('template with non-unique property template refs', () => {
    const subjectTemplate = {
      key: 'test:RT:bf2:RareMat:Instance',
      id: 'test:RT:bf2:RareMat:Instance',
      class: 'http://id.loc.gov/ontologies/bibframe/Instance',
      label: 'Value template refs with non-unique resource URIs',
      author: 'LD4P',
      remark: 'based on LC template ld4p:RT:bf2:RareMat:Instance',
      date: '2019-08-19',
      propertyTemplateKeys: [
        'test:RT:bf2:RareMat:Instance > http://id.loc.gov/ontologies/bibframe/genreForm',
      ],
      propertyTemplates: [
        {
          key: 'test:RT:bf2:RareMat:Instance > http://id.loc.gov/ontologies/bibframe/genreForm',
          subjectTemplateKey: 'test:RT:bf2:RareMat:Instance',
          label: 'Form of Instance',
          uri: 'http://id.loc.gov/ontologies/bibframe/genreForm',
          required: false,
          repeatable: true,
          defaults: [],
          remark: undefined,
          remarkUrl: null,
          type: 'resource',
          component: 'NestedResource',
          valueSubjectTemplateKeys: ['ld4p:RT:bf2:Form', 'ld4p:RT:bf2:RareMat:RBMS'],
          authorities: [],
        },
      ],
    }

    it('returns error', async () => {
      const store = mockStore(createState())

      expect(await store.dispatch(validateTemplates(subjectTemplate, {}, 'testerrorkey'))).toBe(false)
      const payload = {
        errorKey: 'testerrorkey',
        error: 'The following resource templates references for http://id.loc.gov/ontologies/bibframe/genreForm have the same class (http://id.loc.gov/ontologies/bibframe/GenreForm), but must be unique: ld4p:RT:bf2:Form, ld4p:RT:bf2:RareMat:RBMS',
      }
      expect(store.getActions()).toHaveAction('ADD_ERROR', payload)
    })
  })
})
