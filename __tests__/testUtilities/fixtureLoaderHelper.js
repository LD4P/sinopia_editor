import TemplatesBuilder from '../../src/TemplatesBuilder'
import { datasetFromJsonld } from '../../src/utilities/Utilities'
import _ from 'lodash'

const resourceFilenames = {
  'c7db5404-7d7d-40ac-b38e-c821d2c3ae3f': 'test.json',
  'c7db5404-7d7d-40ac-b38e-c821d2c3ae3f-invalid': 'invalid_rt.json',
}

const templateFilenames = {
  'test:resource:DiscogsLookup': 'DiscogsLookup.json',
  'test:bf2:soundCharacteristics': 'multiple_loc.json',
  'resourceTemplate:bf2:Note': 'Note.json',
  'test:resource:SinopiaLookup': 'SinopiaLookup.json',
  'resourceTemplate:bf2:Title': 'Title.json',
  'resourceTemplate:bf2:Title:Note': 'TitleNote.json',
  'test:resource:WikidataLookup': 'WikidataLookup.json',
  'resourceTemplate:bf2:WorkTitle': 'WorkTitle.json',
  'rt:repeated:propertyURI:propertyLabel': 'propertyURIRepeated.json',
  'test:RT:bf2:notFoundValueTemplateRefs': 'notFoundValueTemplateRefs.json',
  'ld4p:RT:bf2:Form': 'ld4p_RT_bf2_Form.json',
  'ld4p:RT:bf2:RareMat:RBMS': 'ld4p_RT_bf2_RareMat_RBMS.json',
  'ld4p:RT:bf2:Title:AbbrTitle': 'ld4p_RT_bf2_Title_AbbrTitle.json',
  'test:RT:bf2:RareMat:Instance': 'nonUniqueValueTemplateRefs.json',
  'resourceTemplate:testing:uber1': 'uber_template1.json',
  'resourceTemplate:testing:uber2': 'uber_template2.json',
  'resourceTemplate:testing:uber3': 'uber_template3.json',
  'resourceTemplate:testing:uber4': 'uber_template4.json',
}

export const hasFixtureResource = (uri) => !!resourceFilenames[normUri(uri)] || !!templateFilenames[normUri(uri)] || ['http://error', 'http://localhost:3000/repository/ld4p:RT:bf2:xxx'].includes(uri)

export const getFixtureResource = (uri) => {
  // A special URI for testing.
  if (uri === 'http://error') throw new Error('Ooops')
  if (uri === 'http://localhost:3000/repository/ld4p:RT:bf2:xxx') throw new Error('Error retrieving resource: Not Found')

  const id = normUri(uri)
  // For some reason, require must have __xxx__ and cannot be provided in variable.
  let resource
  if (resourceFilenames[id]) {
    /* eslint security/detect-non-literal-require: 'off' */
    resource = require(`../__resource_fixtures__/${resourceFilenames[id]}`)
  } else {
    /* eslint security/detect-non-literal-require: 'off' */
    resource = require(`../__template_fixtures__/${templateFilenames[id]}`)
  }

  return { id, uri, data: resource }
}

const normUri = (uri) => {
  return uri.substring(uri.indexOf('repository/') + 11)
}

// Cache of search results
const fixtureTemplateSearchResults = []

// These are used as fake template search results
export const getFixtureTemplateSearchResults = () => {
  if (!_.isEmpty(fixtureTemplateSearchResults)) return fixtureTemplateSearchResults

  return Promise.all(Object.keys(templateFilenames)
    .map((id) => {
      const jsonld = require(`../__template_fixtures__/${templateFilenames[id]}`)
      return datasetFromJsonld(jsonld)
        .then((dataset) => {
          const uri = `http://localhost:3000/repository/${id}`
          const template = new TemplatesBuilder(dataset, uri).build()
          const result = {
            id: template.id,
            author: template.author,
            date: template.date,
            remark: template.remark,
            resourceLabel: template.label,
            resourceURI: template.class,
            uri,
          }
          fixtureTemplateSearchResults.push(result)
          return result
        })
    }))
}

// These are used as fake resource search results
export const resourceSearchResults = (uri) => {
  return [
    {
      totalHits: 1,
      results: [
        {
          uri,
          label: uri,
          created: '2020-07-15T20:48:29.274Z',
          modified: '2020-07-15T21:04:46.012Z',
          type: [
            'http://id.loc.gov/ontologies/bibframe/Fixture',
          ],
          group: 'stanford',
        },
      ],
    },
    {
      types: [
        {
          key: 'http://id.loc.gov/ontologies/bibframe/Fixture',
          doc_count: 1,
        },
      ],
      groups: [
        {
          key: 'stanford',
          doc_count: 1,
        },
      ],
    },
  ]
}
