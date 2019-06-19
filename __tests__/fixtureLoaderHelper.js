// Copyright 2018, 2019 Stanford University see LICENSE for license

const onlyEquivalentRt = require('./__fixtures__/OnlyEquivalent.json')
const barcodeRt = require('./__fixtures__/Barcode.json')
const monographInstanceRt = require('./__fixtures__/MonographInstance.json')
const monographWorkRt = require('./__fixtures__/MonographWork.json')
const noteRt = require('./__fixtures__/Note.json')
const parallelTitleRt = require('./__fixtures__/ParallelTitle.json')
const titleRt = require('./__fixtures__/Title.json')
const titleNoteRt = require('./__fixtures__/TitleNote.json')
const transcribedTitleRt = require('./__fixtures__/TranscribedTitle.json')
const varTitleRt = require('./__fixtures__/VarTitle.json')
const workTitleRt = require('./__fixtures__/WorkTitle.json')
const workVariantTitleRt = require('./__fixtures__/WorkVariantTitle.json')
const lccnRt = require('./__fixtures__/LCCN.json')
const ddcRt = require('./__fixtures__/DDC.json')
const shelfMarkRt = require('./__fixtures__/Shelfmark.json')
const itemRt = require('./__fixtures__/Item.json')
const retentionRt = require('./__fixtures__/ItemRetention.json')
const itemAcqSourceRt = require('./__fixtures__/ItemAcqSource.json')
const enumerationRt = require('./__fixtures__/ItemEnumeration.json')
const chronologyRt = require('./__fixtures__/ItemChronology.json')
const adminMetaRt = require('./__fixtures__/adminMetadata.json')
const adminMetaStatusRt = require('./__fixtures__/adminMetadataStatus.json')
const rdaItemMonoRt = require('./__fixtures__/rdaItemMonograph.json')
const rdaManifestMonoRt = require('./__fixtures__/RDAMainifestationMonograph.json')

export const resourceTemplateId2Json = [
  { id: 'resourceTemplate:bf2:Monograph:Instance', json: monographInstanceRt },
  { id: 'resourceTemplate:bf2:Monograph:Work', json: monographWorkRt },
  { id: 'resourceTemplate:bf2:Identifiers:Barcode', json: barcodeRt },
  { id: 'resourceTemplate:bf2:OnlyEquivalent', json: onlyEquivalentRt },
  { id: 'resourceTemplate:bf2:Note', json: noteRt },
  { id: 'resourceTemplate:bf2:ParallelTitle', json: parallelTitleRt },
  { id: 'resourceTemplate:bf2:Title', json: titleRt },
  { id: 'resourceTemplate:bf2:Title:Note', json: titleNoteRt },
  { id: 'resourceTemplate:bflc:TranscribedTitle', json: transcribedTitleRt },
  { id: 'resourceTemplate:bf2:Title:VarTitle', json: varTitleRt },
  { id: 'resourceTemplate:bf2:WorkTitle', json: workTitleRt },
  { id: 'resourceTemplate:bf2:WorkVariantTitle', json: workVariantTitleRt },
  { id: 'resourceTemplate:bf2:Identifiers:LCCN', json: lccnRt },
  { id: 'resourceTemplate:bf2:Identifiers:DDC', json: ddcRt },
  { id: 'resourceTemplate:bf2:Identifiers:Shelfmark', json: shelfMarkRt },
  { id: 'resourceTemplate:bf2:Item', json: itemRt },
  { id: 'resourceTemplate:bf2:Item:Retention', json: retentionRt },
  { id: 'resourceTemplate:bf2:Item:ItemAcqSource', json: itemAcqSourceRt },
  { id: 'resourceTemplate:bf2:Item:Enumeration', json: enumerationRt },
  { id: 'resourceTemplate:bf2:Item:Chronology', json: chronologyRt },
  { id: 'rt:bf2:AdminMetadata', json: adminMetaRt },
  { id: 'rt:bf2:AdminMetadata:Status', json: adminMetaStatusRt },
  { id: 'rt:rda:item:monograph', json: rdaItemMonoRt },
  { id: 'rt:rda:manifestation:monograph', json: rdaManifestMonoRt },
]

const emptyTemplate = { propertyTemplates: [{}] }

export const resourceTemplateIds = resourceTemplateId2Json.map(template => template.id)

export const spoofedGetResourceTemplate = (templateId) => {
  if (!templateId) {
    emptyTemplate.error = 'ERROR: asked for resourceTemplate with null/undefined id'

    return emptyTemplate
  }

  if (!resourceTemplateIds.includes(templateId)) {
    emptyTemplate.error = `ERROR: un-spoofed resourceTemplate: ${templateId}`

    return emptyTemplate
  }

  const spoofedResponse = { response: {} }

  spoofedResponse.response.body = resourceTemplateId2Json.find((template) => {
    if (template.id === templateId) return template
  }).json

  return new Promise((resolve) => {
    resolve(spoofedResponse)
  })
}

export const spoofedResourcesInGroupContainer = (group) => {
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

export const spoofedGetGroups = () => new Promise((resolve) => {
  resolve({
    response: {
      body: {
        contains: 'http://spoof.trellis.io/ld4p',
      },
    },
  })
})

export const spoofedListResourcesInGroupContainer = group => new Promise((resolve) => {
  resolve(spoofedResourcesInGroupContainer(group))
})
