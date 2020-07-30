// Copyright 2020 Stanford University see LICENSE for license

import TemplatesBuilder from 'TemplatesBuilder'

import { getFixtureResourceTemplate } from 'fixtureLoaderHelper'


describe('TemplatesBuilder', () => {
  it('builds subject template and property templates', async () => {
    const uberTemplateResponse = await getFixtureResourceTemplate('resourceTemplate:testing:uber1')
    const uberTemplate = uberTemplateResponse.response.body

    const subjectTemplate = new TemplatesBuilder(uberTemplate).build()
    expect(subjectTemplate.id).toBe('resourceTemplate:testing:uber1')
    expect(subjectTemplate.key).toBe('resourceTemplate:testing:uber1')
    expect(subjectTemplate.class).toBe('http://id.loc.gov/ontologies/bibframe/Uber1')
    expect(subjectTemplate.label).toBe('Uber template1')
    expect(subjectTemplate.author).toBe('Justin Littman')
    expect(subjectTemplate.date).toBe('2020-07-27')
    expect(subjectTemplate.remark).toBe('Template for testing purposes.')
    expect(subjectTemplate.propertyTemplateKeys).toHaveLength(18)
    expect(subjectTemplate.propertyTemplates).toHaveLength(18)

    const propertyTemplate = subjectTemplate.propertyTemplates[0]
    expect(propertyTemplate.key).toBe('resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1')
    expect(propertyTemplate.uri).toBe('http://id.loc.gov/ontologies/bibframe/uber/template1/property1')
    expect(propertyTemplate.type).toBe('resource')
    expect(propertyTemplate.label).toBe('Uber template1, property1')
    expect(propertyTemplate.subjectTemplateKey).toBe('resourceTemplate:testing:uber1')
    expect(propertyTemplate.remark).toBe('Multiple nested, repeatable resource templates.')
    expect(propertyTemplate.repeatable).toBeTruthy()
    expect(propertyTemplate.required).toBeFalsy()
    expect(propertyTemplate.defaults).toHaveLength(0)
    expect(propertyTemplate.valueSubjectTemplateKeys).toHaveLength(2)
    expect(propertyTemplate.component).toBe('NestedResource')

    const propertyTemplate2 = subjectTemplate.propertyTemplates[1]
    expect(propertyTemplate2.valueSubjectTemplateKeys).toBeNull()

    const propertyTemplate7 = subjectTemplate.propertyTemplates[6]
    expect(propertyTemplate7.type).toBe('literal')
    expect(propertyTemplate7.defaults).toHaveLength(2)
    expect(propertyTemplate7.defaults[0]).toEqual({ literal: 'Default literal1', lang: null })
    expect(propertyTemplate7.component).toEqual('InputLiteral')

    const propertyTemplate8 = subjectTemplate.propertyTemplates[7]
    expect(propertyTemplate8.type).toBe('uri')
    expect(propertyTemplate8.defaults).toHaveLength(2)
    expect(propertyTemplate8.defaults[0]).toEqual({ uri: 'http://sinopia.io/defaultURI1', label: 'Default URI1' })
    expect(propertyTemplate8.defaults[1]).toEqual({ uri: 'http://sinopia.io/defaultURI2' })
    expect(propertyTemplate8.component).toEqual('InputURI')

    const propertyTemplate9 = subjectTemplate.propertyTemplates[8]
    expect(propertyTemplate9.remark).toBeNull()
    expect(propertyTemplate9.remarkUrl.toString()).toEqual('http://access.rdatoolkit.org/2.13.html')

    const propertyTemplate10 = subjectTemplate.propertyTemplates[9]
    expect(propertyTemplate10.type).toBe('uri')
    expect(propertyTemplate10.component).toEqual('InputListLOC')
    expect(propertyTemplate10.authorities).toHaveLength(1)
    expect(propertyTemplate10.authorities[0]).toEqual({
      authority: undefined,
      label: 'type of recording',
      nonldLookup: false,
      subauthority: undefined,
      uri: 'https://id.loc.gov/vocabulary/mrectype',
    })

    const propertyTemplate13 = subjectTemplate.propertyTemplates[12]
    expect(propertyTemplate13.type).toBe('uri')
    expect(propertyTemplate13.component).toEqual('InputLookupQA')
    expect(propertyTemplate13.authorities).toHaveLength(1)
    expect(propertyTemplate13.authorities[0]).toEqual({
      authority: 'agrovoc_ld4l_cache',
      label: 'AGROVOC (QA)',
      nonldLookup: false,
      subauthority: '',
      uri: 'urn:ld4p:qa:agrovoc',
    })

    const propertyTemplate16 = subjectTemplate.propertyTemplates[15]
    expect(propertyTemplate16.type).toBe('uri')
    expect(propertyTemplate16.component).toEqual('InputLookupSinopia')
    expect(propertyTemplate16.authorities).toHaveLength(1)
    expect(propertyTemplate16.authorities[0]).toEqual({
      authority: undefined,
      label: 'Sinopia BIBFRAME instance resources',
      nonldLookup: false,
      subauthority: undefined,
      uri: 'urn:ld4p:sinopia:bibframe:instance',
    })
  })
})
