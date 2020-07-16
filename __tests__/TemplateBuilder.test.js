// Copyright 2020 Stanford University see LICENSE for license

import { buildTemplates } from 'TemplatesBuilder'

import { getFixtureResourceTemplate } from 'fixtureLoaderHelper'


describe('buildTemplates()', () => {
  it('builds subjectTemplate ', async () => {
    const uberTemplateResponse = await getFixtureResourceTemplate('resourceTemplate:testing:uber1')
    const uberTemplate = uberTemplateResponse.response.body
    const subjectTemplate = buildTemplates(uberTemplate)[0]
    expect(subjectTemplate.id).toBe('resourceTemplate:testing:uber1')
    expect(subjectTemplate.key).toBe('resourceTemplate:testing:uber1')
    expect(subjectTemplate.propertyTemplateKeys).toHaveLength(6)
  })

  it('builds propertyTemplates', async () => {
    const uberTemplateResponse = await getFixtureResourceTemplate('resourceTemplate:testing:uber1')
    const uberTemplate = uberTemplateResponse.response.body
    const propertyTemplates = buildTemplates(uberTemplate)[1]
    expect(propertyTemplates).toHaveLength(6)
    expect(propertyTemplates[0].key).toBe('resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1')
    expect(propertyTemplates[0].subjectTemplateKey).toBe('resourceTemplate:testing:uber1')
    expect(propertyTemplates[0].remark).toBe('Multiple nested, repeatable resource templates.')
    expect(propertyTemplates[0].repeatable).toBeTruthy()
    expect(propertyTemplates[0].required).toBeFalsy()
    expect(propertyTemplates[0].valueSubjectTemplateKeys).toHaveLength(2)
    expect(propertyTemplates[1].valueSubjectTemplateKeys).toBe(undefined)
  })
})
