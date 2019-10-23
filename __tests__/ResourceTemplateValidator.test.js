// Copyright 2019 Stanford University see LICENSE for license

import { getFixtureResourceTemplate, resourceTemplateIds } from './fixtureLoaderHelper'
import validateResourceTemplate from 'ResourceTemplateValidator'
import _ from 'lodash'
import * as sinopiaServer from 'sinopiaServer'

jest.mock('sinopiaServer')


sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)
sinopiaServer.foundResourceTemplate.mockImplementation(templateId => resourceTemplateIds.includes(templateId))

describe('validateResourceTemplate', () => {
  it('returns [] for valid', async () => {
    const template = await getFixtureResourceTemplate('resourceTemplate:bf2:Title')
    expect(await validateResourceTemplate(template.response.body)).toEqual([])
  })

  it('returns reason for repeated property URIs', async () => {
    const template = await getFixtureResourceTemplate('rt:repeated:propertyURI:propertyLabel')
    expect(await validateResourceTemplate(template.response.body)).toEqual(['Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.'])
  })

  it('returns reason for literal with default URI', async () => {
    const templateResponse = await getFixtureResourceTemplate('resourceTemplate:bf2:Title')
    const template = _.cloneDeep(templateResponse.response.body)
    template.propertyTemplates[0].valueConstraint.defaults.push({ defaultURI: 'http://example.org/title#AClockworkOrange' })
    expect(await validateResourceTemplate(template)).toEqual(['Literal property templates (http://id.loc.gov/ontologies/bibframe/mainTitle) cannot have default URIs.'])
  })

  it('allows blank default URIs', async () => {
    const templateResponse = await getFixtureResourceTemplate('resourceTemplate:bf2:Title')
    const template = _.cloneDeep(templateResponse.response.body)
    template.propertyTemplates[0].valueConstraint.defaults.push({ defaultURI: '' })
    expect(await validateResourceTemplate(template)).toEqual([])
  })

  it('returns reason for property with refs and defaults', async () => {
    const template = await getFixtureResourceTemplate('rt:resource:DefaultsAndRefs')
    expect(await validateResourceTemplate(template.response.body)).toEqual(['Property templates (http://examples.org/bogusOntologies/invalid) cannot have both defaults and valueTemplateRefs.'])
  })

  it('returns reason for misconfigured resource template', async () => {
    const templateResponse = await getFixtureResourceTemplate('Sinopia:RT:Fixture:LookupWithValueTemplateRefs')
    expect(await validateResourceTemplate(templateResponse.response.body)).toEqual(['The following property templates have unknown types or lookups: http://examples.org/bogusOntologies/lookup1'])
  })

  it('returns reason for missing resource templates', async () => {
    const templateResponse = await getFixtureResourceTemplate('test:RT:bf2:notFoundValueTemplateRefs')
    const reasons = await validateResourceTemplate(templateResponse.response.body)
    expect(reasons[0]).toMatch(/The following referenced resource templates are not available in Sinopia: lc:RT:bf2:Identifiers:Barcode,/)
  })

  it('returns reason for non-unique property template refs', async () => {
    const templateResponse = await getFixtureResourceTemplate('test:RT:bf2:RareMat:Instance')
    const reasons = await validateResourceTemplate(templateResponse.response.body)
    expect(reasons[0]).toEqual('The following resource templates references for http://id.loc.gov/ontologies/bibframe/genreForm have the same resource URI (http://id.loc.gov/ontologies/bibframe/GenreForm), but must be unique: ld4p:RT:bf2:Form, ld4p:RT:bf2:RareMat:RBMS')
  })
})
