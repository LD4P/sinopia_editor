// Copyright 2018, 2019 Stanford University see LICENSE for license

// ideally we would like to automagically load everything in the fixtures dir
//  (with a short black list), but because we want to be able to spin up the
//  web server with fixtures, we can't use fs.readdir, fs.readfile and so on.
// Using require to load the json files gets around this, but only if we have
//  the names of the files in a list already.

// note that the following fixtures are used for schemaValidation tests and don't need to be autoloaded
// 'edition_bad_schema',
// 'lcc_no_schema_specified',
// 'lcc_v0.0.9.json',
// 'lcc_v0.2.0.bad_id.json',
// 'lcc_v0.2.0_invalid.json',
// 'lcc_v0.2.0.json',
// 'Note(Profile).json', // detritus from "spoof" that could be removed?
// 'place_profile_no_schema_specified',
// 'place_profile_v0.0.9.json',
// 'place_profile_v0.2.0.json',

const rtFileNames = [
  'Barcode.json',
  'DiscogsLookup.json',
  'DDC.json',
  'Item.json',
  'ItemAcqSource.json',
  'ItemChronology.json',
  'ItemEnumeration.json',
  'ItemRetention.json',
  'LCCN.json',
  'multiple_loc.json',
  'MonographInstance.json',
  'MonographWork.json',
  'Note.json',
  'OnlyEquivalent.json',
  'ParallelTitle.json',
  'Shelfmark.json',
  'SinopiaLookup.json',
  'Title.json',
  'TitleNote.json',
  'TranscribedTitle.json',
  'VarTitle.json',
  'WikidataLookup.json',
  'WorkTitle.json',
  'WorkVariantTitle.json',
  'defaultsAndRefs.json',
  'literalNoRepeatDefaultLiteralNonEnglish.json',
  'literalNoRepeatDefaultLiteralOnly.json',
  'literalNoRepeatNoDefault.json',
  'literalRepeat2DefaultsLiteralNonEnglish.json',
  'literalRepeat2DefaultsLiteralOnly.json',
  'literalRepeatDefaultLiteralNonEnglish.json',
  'literalRepeatDefaultLiteralOnly.json',
  'literalRepeatNoDefault.json',
  'lookupWithValueTemplateRefs.json',
  'blankValueTemplateRefs.json',
  'multiple_valuetemplaterefs.json',
  'propertyURIRepeated.json',
  'lc_RT_bf2_Agent_Role.json',
  'notFoundValueTemplateRefs.json',
  'notFoundValueTemplateRefsURI.json',
  'genreForm.json',
  'sinopia_resourceTemplate_bf2_Item_Chronology.json',
  'sinopia_resourceTemplate_bf2_Item_Enumeration.json',
  'sinopia_resourceTemplate_bf2_Item_Access.json',
  'sinopia_resourceTemplate_bf2_Item_Retention.json',
  'sinopia_resourceTemplate_bf2_Item_Use.json',
  'sinopia_resourceTemplate_bf2_ParallelTitle.json',
  'sinopia_resourceTemplate_bf2_Title_VarTitle.json',
  'sinopia_resourceTemplate_bf2_Title.json',
  'sinopia_resourceTemplate_bflc_TranscribedTitle.json',
  'sinopia_resourceTemplate_bf2_Title_Note.json',
  'ld4p_RT_bf2_Agents_Addresses.json',
  'ld4p_RT_bf2_Form.json',
  'ld4p_RT_bf2_Identifiers_Copyright.json',
  'ld4p_RT_bf2_Identifiers_EAN.json',
  'ld4p_RT_bf2_RareMat_RBMS.json',
  'ld4p_RT_bf2_Title_AbbrTitle.json',
  'nonUniqueValueTemplateRefs.json',
  'uber_template1.json',
  'uber_template2.json',
  'uber_template3.json',
]

export const resourceTemplateId2Json = loadFixtureResourceTemplates()

function loadFixtureResourceTemplates() {
  const result = []
  rtFileNames.forEach((filename) => {
    /* eslint security/detect-non-literal-require: 'off' */
    const rtjson = require(`../__template_fixtures__/${filename}`)
    result.push({ id: rtjson.id, json: rtjson })
  })
  return result
}

export const resourceTemplateIds = resourceTemplateId2Json.map((template) => template.id)

// These are used as fake template search results
export const resourceTemplateSearchResults = resourceTemplateId2Json.map((template) => ({
  id: template.json.id,
  author: template.json.author,
  date: template.json.date,
  remark: template.json.remark,
  resourceLabel: template.json.resourceLabel,
  resourceURI: template.json.resourceURI,
})).sort((a, b) => a.resourceLabel.localeCompare(b.resourceLabel))

export const getFixtureResourceTemplate = (templateId) => {
  if (!templateId) {
    return Promise.reject(new Error('ERROR: asked for resourceTemplate with null/undefined id'))
  }

  if (!resourceTemplateIds.includes(templateId)) {
    return Promise.reject(new Error(`ERROR: non-fixture resourceTemplate: ${templateId}`))
  }

  const fixtureResponse = { response: {} }

  fixtureResponse.response.body = resourceTemplateId2Json.find((template) => {
    if (template.id === templateId) return template
  }).json

  return new Promise((resolve) => {
    resolve(fixtureResponse)
  })
}

export const fixtureResourcesInGroupContainer = (group) => {
  const container = `http://spoof.trellis.io/${group}`
  const ids = resourceTemplateId2Json.map((rt) => `${container}/${rt.id}`)

  return {
    response: {
      body: {
        '@id': container,
        contains: ids,
      },
    },
  }
}

export const rtFixturesGroups = () => new Promise((resolve) => {
  resolve({
    response: {
      body: {
        contains: 'http://spoof.trellis.io/ld4p',
      },
    },
  })
})

export const listFixtureResourcesInGroupContainer = (group) => new Promise((resolve) => {
  resolve(fixtureResourcesInGroupContainer(group))
})

const resourceFilenames = {
  'cornell/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f': 'test.n3',
  'cornell/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f-invalid': 'invalid_rt.n3',
}

export const hasFixtureResource = (uri) => !!resourceFilenames[normUri(uri)]

export const getFixtureResource = (currentUser, uri) => {
  const resourceObj = require(`../__resource_fixtures__/${resourceFilenames[normUri(uri)]}`)
  // Depends on whether webpack or jest.
  const resourceN3 = resourceObj.default || resourceObj
  return Promise.resolve({ response: { text: resourceN3.replace(/<>/g, `<${uri}>`) } })
}

const normUri = (uri) => uri.substring(uri.indexOf('repository/') + 11)

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
