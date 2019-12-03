// Copyright 2019 Stanford University see LICENSE for license

import {
  findResourceURI, isExpanded, itemsForProperty,
  getDisplayResourceValidations, getResourceTemplate, getPropertyTemplate,
  resourceHasChangesSinceLastSave, findResource, rootResourceTemplateId,
  hasResource,
} from 'selectors/resourceSelectors'
import { getFixtureResourceTemplate } from '../fixtureLoaderHelper'
import { createBlankState } from 'testUtils'

describe('findResourceURI', () => {
  const resource = {
    'profile:bf2:Work': {
      resourceURI: 'http://platform:8080/repository/stanford/1f14d358-a0c9-4e66-b7e8-7c6ae5475036',
    },
  }

  it('returns the uri', () => {
    const state = createBlankState()
    state.selectorReducer.entities.resources.abc123 = resource

    expect(findResourceURI(state, 'abc123')).toEqual('http://platform:8080/repository/stanford/1f14d358-a0c9-4e66-b7e8-7c6ae5475036')
  })

  it('returns the uri for current resource', () => {
    const state = createBlankState()
    state.selectorReducer.editor.currentResource = 'abc123'
    state.selectorReducer.entities.resources.abc123 = resource

    expect(findResourceURI(state)).toEqual('http://platform:8080/repository/stanford/1f14d358-a0c9-4e66-b7e8-7c6ae5475036')
  })

  it('returns undefined if resource not found', () => {
    const state = createBlankState()
    expect(findResourceURI(state, 'abc123')).toEqual(undefined)
  })
})

describe('getDisplayResourceValidations()', () => {
  it('returns value when present', () => {
    const state = createBlankState()
    state.selectorReducer.editor.resourceValidation.show.abc123 = true
    expect(getDisplayResourceValidations(state, 'abc123')).toBeTruthy()
  })
})

describe('itemsForProperty()', () => {
  const state = createBlankState()
  state.selectorReducer.resource = {
    'resourceTemplate:bf2:Monograph:Instance': {
      'http://id.loc.gov/ontologies/bibframe/issuance': {
        items: {
          abFEHPzpKR: {
            label: 'single unit',
            uri: 'http://id.loc.gov/vocabulary/issuance/mono',
          },
        },
      },
    },
  }
  const reduxPath = [
    'resource', 'resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/issuance',
  ]

  it('returns value when present', () => {
    expect(itemsForProperty(state, reduxPath)).toEqual([{
      label: 'single unit',
      uri: 'http://id.loc.gov/vocabulary/issuance/mono',
    }])
  })
})

describe('isExpanded()', () => {
  const reduxPath = ['resource', 'resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/instanceOf', 'aJOz_pLh3m7', 'resourceTemplate:bf2:Monograph:Work', 'http://id.loc.gov/ontologies/bibframe/title']

  it('returns false when missing', () => {
    expect(isExpanded(createBlankState(), reduxPath)).toBeFalsy()
  })

  it('returns value when present', () => {
    const state = createBlankState()
    state.selectorReducer.editor.expanded = {
      resource: {
        'resourceTemplate:bf2:Monograph:Instance': {
          'http://id.loc.gov/ontologies/bibframe/instanceOf': {
            aJOz_pLh3m7: {
              'resourceTemplate:bf2:Monograph:Work': {
                'http://id.loc.gov/ontologies/bibframe/title': {
                  expanded: true,
                },
              },
            },
          },
        },
      },
    }
    expect(isExpanded(state, reduxPath)).toBeTruthy()
  })
})

describe('getResourceTemplate()', () => {
  it('returns undefined when missing', () => {
    expect(getResourceTemplate(createBlankState(), 'resourceTemplate:bf2:Monograph:Work')).toBeFalsy()
  })

  it('returns resource template when present', () => {
    const state = createBlankState()
    state.selectorReducer.entities.resourceTemplates = {
      'resourceTemplate:bf2:Monograph:Work': {
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
      },
    }

    expect(getResourceTemplate(state, 'resourceTemplate:bf2:Monograph:Work')).toEqual({
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
    })
  })
})

describe('getPropertyTemplate()', () => {
  it('returns undefined when missing', () => {
    expect(getPropertyTemplate(createBlankState(), 'resourceTemplate:bf2:Monograph:Work', 'http://id.loc.gov/ontologies/bibframe/title')).toBeFalsy()
  })

  it('returns property template when present', () => {
    const state = createBlankState()
    state.selectorReducer.entities.resourceTemplates = {
      'resourceTemplate:bf2:Monograph:Work': {
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
        propertyTemplates: [{
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/title',
        }],
      },
    }

    expect(getPropertyTemplate(state, 'resourceTemplate:bf2:Monograph:Work', 'http://id.loc.gov/ontologies/bibframe/title')).toEqual({
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/title',
    })
  })
})

describe('resourceHasChangesSinceLastSave', () => {
  let template
  beforeEach(async () => {
    const templateResponse = await getFixtureResourceTemplate('resourceTemplate:bf2:Note')
    template = templateResponse.response.body
  })
  const resource = {
    'resourceTemplate:bf2:Note': {
      'http://www.w3.org/2000/01/rdf-schema#label': {
        items: [
          {
            content: 'foo',
            id: 'VBtih30me',
            lang: 'eng',
          },
        ],
      },
    },
  }
  describe('when not previously saved', () => {
    it('returns changed', () => {
      expect(resourceHasChangesSinceLastSave(createBlankState())).toBe(true)
    })
  })
  describe('when resource has changed', () => {
    it('returns changed', () => {
      const state = createBlankState()
      state.selectorReducer.resource = resource
      state.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:Note'] = template
      state.selectorReducer.editor.lastSaveChecksum = 'abc123'
      expect(resourceHasChangesSinceLastSave(state)).toBe(true)
    })
  })
  describe('when resource has not changed', () => {
    it('returns not changed', () => {
      const state = createBlankState()
      state.selectorReducer.entities.resources.abc123 = resource
      state.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:Note'] = template
      // See resourceHasChangesSinceLastSave() for checksum
      state.selectorReducer.editor.lastSaveChecksum.abc123 = '75021e66490d12ff17d7e3a6c5e94d26'
      expect(resourceHasChangesSinceLastSave(state, 'abc123')).toBe(false)
    })
  })
})

describe('findResource', () => {
  const resource = {
    'profile:bf2:Work': {},
  }
  it('returns the resource', () => {
    const state = createBlankState()
    state.selectorReducer.entities.resources.abc123 = resource

    expect(findResource(state, 'abc123')).toEqual(resource)
  })
  it('returns undefined when not found', () => {
    const state = createBlankState()

    expect(findResource(state, 'xabc123')).toEqual(undefined)
  })
  it('returns the current resource', () => {
    const state = createBlankState()
    state.selectorReducer.editor.currentResource = 'abc123'
    state.selectorReducer.entities.resources.abc123 = resource

    expect(findResource(state)).toEqual(resource)
  })
})

describe('rootResourceTemplateId', () => {
  const resource = {
    'profile:bf2:Work': {},
  }
  it('returns the resource template id', () => {
    const state = createBlankState()
    state.selectorReducer.entities.resources.abc123 = resource

    expect(rootResourceTemplateId(state, 'abc123')).toEqual('profile:bf2:Work')
  })
  it('returns undefined when not found', () => {
    const state = createBlankState()
    expect(rootResourceTemplateId(state, 'xabc123')).toEqual(undefined)
  })
  it('returns the resource template id for current resource', () => {
    const state = createBlankState()
    state.selectorReducer.editor.currentResource = 'abc123'
    state.selectorReducer.entities.resources.abc123 = resource

    expect(rootResourceTemplateId(state)).toEqual('profile:bf2:Work')
  })
})

describe('hasResource', () => {
  it('returns false when no current resource', () => {
    const state = createBlankState()

    expect(hasResource(state)).toEqual(false)
  })
  it('returns true when current resource', () => {
    const state = createBlankState()
    state.selectorReducer.editor.currentResource = 'abc123'
    state.selectorReducer.entities.resources.abc123 = {}

    expect(hasResource(state)).toEqual(true)
  })
})
