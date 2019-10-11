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
  'multiple_valuetemplaterefs.json',
  'propertyURIRepeated.json',
  'lc_RT_bf2_Agent_Role.json',
  'notFoundValueTemplateRefs.json',
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
  'ld4p_RT_bf2_AdminMetadata_BFDB.json',
  'ld4p_RT_bf2_AdminMetadata.json',
  'ld4p_RT_bf2_AdminMetadata_GenerationProcess.json',
  'ld4p_RT_bf2_AdminMetadata_Status.json',
  'ld4p_RT_bf2_Agents_Contribution.json',
  'ld4p_RT_bf2_Agents_bfContribution.json',
  'ld4p_RT_bflc_Agents_PrimaryContribution.json',
  'ld4p_RT_bflc_Agents_bfPrimaryContribution.json',
  'ld4p_RT_bf2_Agent_Person.json',
  'ld4p_RT_bf2_Agent_Family.json',
  'ld4p_RT_bf2_Agent_CorporateBody.json',
  'ld4p_RT_bf2_Agent_Conference.json',
  'ld4p_RT_bf2_Agent_Jurisdiction.json',
  'ld4p_RT_bf2_Agents_Addresses.json',
  'ld4p_RT_bf2_Agents_Addresses_Extended.json',
  'ld4p_RT_bf2_Agents_RelatedAgents.json',
  'ld4p_RT_bf2_Agents_Source.json',
  'ld4p_RT_bf2_Agents_VariantAgents.json',
  'ld4p_RT_bf2_Agent_Role.json',
  'ld4p_RT_bf2_Agent_Identifier.json',
  'ld4p_RT_bf2_Agent_Note.json',
  'ld4p_RT_bf2_Agent_Identifier_Source.json',
  'ld4p_RT_bf2_Agent_bfPerson.json',
  'ld4p_RT_bf2_DDC.json',
  'ld4p_RT_bf2_LCC.json',
  'ld4p_RT_bf2_Form.json',
  'ld4p_RT_bf2_Form_Geog.json',
  'ld4p_RT_bf2_Identifiers.json',
  'ld4p_RT_bf2_Identifiers_AudioIssue.json',
  'ld4p_RT_bf2_Identifiers_Barcode.json',
  'ld4p_RT_bf2_Identifiers_Copyright.json',
  'ld4p_RT_bf2_Identifiers_EAN.json',
  'ld4p_RT_bf2_Identifiers_Eidr.json',
  'ld4p_RT_bf2_Identifiers_Gtin14.json',
  'ld4p_RT_bf2_Identifiers_ISBN.json',
  'ld4p_RT_bf2_Identifiers_ISMN.json',
  'ld4p_RT_bf2_Identifiers_ISRC.json',
  'ld4p_RT_bf2_Identifiers_ISSN.json',
  'ld4p_RT_bf2_Identifiers_ISSNL.json',
  'ld4p_RT_bf2_Identifiers_LCCN.json',
  'ld4p_RT_bf2_Identifiers_Local.json',
  'ld4p_RT_bf2_Identifiers_Matrix.json',
  'ld4p_RT_bf2_Identifiers_Distributor.json',
  'ld4p_RT_bf2_Identifiers_MusicPlate.json',
  'ld4p_RT_bf2_Identifiers_MusicPub.json',
  'ld4p_RT_bf2_Identifiers_Other.json',
  'ld4p_RT_bf2_Identifiers_PubNumber.json',
  'ld4p_RT_bf2_Identifiers_STRN.json',
  'ld4p_RT_bf2_Identifiers_StockNumber.json',
  'ld4p_RT_bf2_Identifiers_UPC.json',
  'ld4p_RT_bf2_Identifiers_Note.json',
  'ld4p_RT_bf2_Identifiers_Source.json',
  'ld4p_RT_bf2_Identifiers_LC.json',
  'ld4p_RT_bf2_Identifiers_DDC.json',
  'ld4p_RT_bf2_Identifiers_Shelfmark.json',
  'ld4p_RT_bf2_Item_Access.json',
  'ld4p_RT_bf2_Item_Use.json',
  'ld4p_RT_bf2_Item_Retention.json',
  'ld4p_RT_bf2_Item_ImmAcqSource.json',
  'ld4p_RT_bf2_Item_Enumeration.json',
  'ld4p_RT_bf2_Item_Chronology.json',
  'ld4p_RT_bf2_Language2.json',
  'ld4p_RT_bf2_Language_Note.json',
  'ld4p_RT_bf2_Monograph_Work.json',
  'ld4p_RT_bf2_Monograph_Instance.json',
  'ld4p_RT_bf2_Monograph_Item.json',
  'ld4p_RT_bf2_Monograph_RelatedInstance.json',
  'ld4p_RT_bf2_Monograph_Dissertation.json',
  'ld4p_RT_bf2_Contents.json',
  'ld4p_RT_bf2_Note.json',
  'ld4p_RT_bf2_Script.json',
  'ld4p_RT_bf2_SourceConsulted.json',
  'ld4p_RT_bf2_Summary.json',
  'ld4p_RT_bf2_SupplContent.json',
  'ld4p_RT_bf2_SysReq.json',
  'ld4p_RT_bf2_Place.json',
  'ld4p_RT_bf2_PublicationInformation.json',
  'ld4p_RT_bf2_DistributionInformation.json',
  'ld4p_RT_bf2_ManufactureInformation.json',
  'ld4p_RT_bf2_ProductionInformation.json',
  'ld4p_RT_bf2_Provision_Place.json',
  'ld4p_RT_bf2_Provision_Name.json',
  'ld4p_RT_bf2_Agents_RWO_Affiliation.json',
  'ld4p_RT_bf2_Agents_RWO_AssociatedLanguage.json',
  'ld4p_RT_bf2_Agents_RWO_PlaceofBirth.json',
  'ld4p_RT_bf2_Agents_RWO_PlaceofDeath.json',
  'ld4p_RT_bf2_Agents_RWO_Country.json',
  'ld4p_RT_bf2_Agents_RWO_PlaceOfResidence.json',
  'ld4p_RT_bf2_Agents_RWO_LocationOfConference.json',
  'ld4p_RT_bf2_Agents_RWO_OtherPlace.json',
  'ld4p_RT_bf2_Agents_RWO_Dates.json',
  'ld4p_RT_bf2_Agents_RWO_FieldofActivity.json',
  'ld4p_RT_bf2_Agents_RWO_Gender.json',
  'ld4p_RT_bf2_Agents_RWO_Occupation.json',
  'ld4p_RT_bf2_Agents_RWO_ProminentFamilyMember.json',
  'ld4p_RT_bf2_Agents_RWO_HonoraryTitle.json',
  'ld4p_RT_bf2_Agents_skosConcept.json',
  'ld4p_RT_bf2_Agents_RWO_IdentifiedbyAuthority.json',
  'ld4p_RT_bf2_RelatedWork.json',
  'ld4p_RT_bf2_RelatedExpression.json',
  'ld4p_RT_bf2_RelatedInstance.json',
  'ld4p_RT_bf2_ReferenceInstance.json',
  'ld4p_RT_bf2_Relation.json',
  'ld4p_RT_bf2_SeriesInformation.json',
  'ld4p_RT_bf2_InstanceTitle.json',
  'ld4p_RT_bflc_TranscribedTitle.json',
  'ld4p_RT_bf2_WorkTitle.json',
  'ld4p_RT_bf2_WorkVariantTitle.json',
  'ld4p_RT_bf2_Title_Note.json',
  'ld4p_RT_bf2_Title_VarTitle.json',
  'ld4p_RT_bf2_ParallelTitle.json',
  'ld4p_RT_bf2_Title_KeyTitle.json',
  'ld4p_RT_bf2_Title_AbbrTitle.json',
  'ld4p_RT_bf2_Title_CollTitle.json',
  'ld4p_RT_bf2_BflcTitle.json',
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
    console.error(emptyTemplate.error)

    return emptyTemplate
  }

  if (!resourceTemplateIds.includes(templateId)) {
    emptyTemplate.error = `ERROR: non-fixture resourceTemplate: ${templateId}`
    console.error(emptyTemplate.error)

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
