// Copyright 2019 Stanford University see LICENSE for license

import { getFixtureResourceTemplate } from './fixtureLoaderHelper'
import validateResourceTemplate from 'ResourceTemplateValidator'
import _ from 'lodash'

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
    const templateResponse = await getFixtureResourceTemplate('resourceTemplate:bf2:Title')
    const template = _.cloneDeep(templateResponse.response.body)
    template.propertyTemplates[0].valueConstraint.defaults.push({ defaultURI: 'http://example.org/title#AClockworkOrange' })
    expect(validateResourceTemplate(template)).toEqual(['Literal property templates (http://id.loc.gov/ontologies/bibframe/mainTitle) cannot have default URIs.'])
  })

  it('allows blank default URIs', async () => {
    const templateResponse = await getFixtureResourceTemplate('resourceTemplate:bf2:Title')
    const template = _.cloneDeep(templateResponse.response.body)
    template.propertyTemplates[0].valueConstraint.defaults.push({ defaultURI: '' })
    expect(validateResourceTemplate(template)).toEqual([])
  })


  it('returns reason for property with refs and defaults', async () => {
    const template = await getFixtureResourceTemplate('rt:resource:DefaultsAndRefs')
    expect(validateResourceTemplate(template.response.body)).toEqual(['Property templates (http://examples.org/bogusOntologies/invalid) cannot have both defaults and valueTemplateRefs.'])
  })
})
