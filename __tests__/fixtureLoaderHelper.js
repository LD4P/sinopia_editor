// Copyright 2018, 2019 Stanford University see LICENSE for license

// ideally we would like to automagically load everything in the fixtures dir
//  (with a short black list), but because we want to be able to spin up the
//  web server with fixtures, we can't use fs.readdir, fs.readfile and so on.
// Using require to load the json files gets around this, but only if we have
//  the names of the files in a list already.

// note that the following fixtures are used for schemaValidation tests and don't need to be autoloaded
// 'ddc_bad_json.json',
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
  'DDC.json',
  'Item.json',
  'ItemAcqSource.json',
  'ItemChronology.json',
  'ItemEnumeration.json',
  'ItemRetention.json',
  'LCCN.json',
  'MonographInstance.json',
  'MonographWork.json',
  'Note.json',
  'OnlyEquivalent.json',
  'ParallelTitle.json',
  'RDAMainifestationMonograph.json',
  'Shelfmark.json',
  'Title.json',
  'TitleNote.json',
  'TranscribedTitle.json',
  'VarTitle.json',
  'WorkTitle.json',
  'WorkVariantTitle.json',
  'adminMetadata.json',
  'adminMetadataStatus.json',
  'defaultsAndRefs.json',
  'literalDefaultURI.json',
  'literalNoRepeatDefaultLiteralNonEnglish.json',
  'literalNoRepeatDefaultLiteralOnly.json',
  'literalNoRepeatNoDefault.json',
  'literalRepeat2DefaultsLiteralNonEnglish.json',
  'literalRepeat2DefaultsLiteralOnly.json',
  'literalRepeatDefaultLiteralNonEnglish.json',
  'literalRepeatDefaultLiteralOnly.json',
  'literalRepeatNoDefault.json',
  'propertyURIRepeated.json',
  'rdaItemMonograph.json',
]

export const resourceTemplateId2Json = loadFixtureResourceTemplates()

function loadFixtureResourceTemplates() {
  const result = []
  rtFileNames.forEach((filename) => {
    /* eslint security/detect-non-literal-require: 'off' */
    const rtjson = require(`./__fixtures__/${filename}`)
    result.push({ id: rtjson.id, json: rtjson })
  })
  return result
}

const emptyTemplate = { propertyTemplates: [{}] }

export const resourceTemplateIds = resourceTemplateId2Json.map(template => template.id)

export const getFixtureResourceTemplate = (templateId) => {
  if (!templateId) {
    emptyTemplate.error = 'ERROR: asked for resourceTemplate with null/undefined id'

    return emptyTemplate
  }

  if (!resourceTemplateIds.includes(templateId)) {
    emptyTemplate.error = `ERROR: non-fixture resourceTemplate: ${templateId}`

    return emptyTemplate
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
  const ids = resourceTemplateId2Json.map(rt => `${container}/${rt.id}`)

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

export const listFixtureResourcesInGroupContainer = group => new Promise((resolve) => {
  resolve(fixtureResourcesInGroupContainer(group))
})
