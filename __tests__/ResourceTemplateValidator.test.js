// Copyright 2019 Stanford University see LICENSE for license

import { getFixtureResourceTemplate } from './fixtureLoaderHelper'
import validateResourceTemplate from 'ResourceTemplateValidator'

describe('validateResourceTemplate', () => {
  it('returns [] for valid', async () => {
    const template = await getFixtureResourceTemplate('resourceTemplate:bf2:Title')
    expect(validateResourceTemplate(template.response.body)).toEqual([])
  })

  it('returns reason for repeated property URIs', async () => {
    const template = await getFixtureResourceTemplate('rt:repeated:propertyURI:propertyLabel')
    expect(validateResourceTemplate(template.response.body)).toEqual(['Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.'])
  })

  it('returns reason for literal with default URI', async () => {
    const template = await getFixtureResourceTemplate('rt:literal:defaultURI')
    expect(validateResourceTemplate(template.response.body)).toEqual(['Literal property templates (http://id.loc.gov/ontologies/bibframe/geographicCoverage) cannot have default URIs.'])
  })

  it('returns reason for property with refs and defaults', async () => {
    const template = await getFixtureResourceTemplate('rt:resource:DefaultsAndRefs')
    expect(validateResourceTemplate(template.response.body)).toEqual(['Property templates (http://examples.org/bogusOntologies/invalid) cannot have both defaults and valueTemplateRefs.'])
  })
})
