// Copyright 2019 Stanford University see LICENSE for license

import { getFixtureResourceTemplate } from './fixtureLoaderHelper'
import validateResourceTemplate from 'ResourceTemplateValidator'

describe('validateResourceTemplate', () => {
  it('returns null for valid', async () => {
    const template = await getFixtureResourceTemplate('resourceTemplate:bf2:Title')
    expect(validateResourceTemplate(template.response.body)).toEqual(null)
  })

  it('returns reason for repeated property URIs', async () => {
    const template = await getFixtureResourceTemplate('rt:repeated:propertyURI:propertyLabel')
    expect(validateResourceTemplate(template.response.body)).toEqual('Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.')
  })
})
