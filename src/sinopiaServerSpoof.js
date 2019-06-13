// Copyright 2018 Stanford University see LICENSE for license

const barcodeRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/Barcode.json')
const monographInstanceRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/MonographInstance.json')
const monographWorkRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/MonographWork.json')
const noteRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/Note.json')
const parallelTitleRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/ParallelTitle.json')
const titleRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/Title.json')
const titleNoteRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/TitleNote.json')
const transcribedTitleRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/TranscribedTitle.json')
const varTitleRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/VarTitle.json')
const workTitleRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/WorkTitle.json')
const workVariantTitleRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/WorkVariantTitle.json')
const lccnRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/LCCN.json')
const ddcRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/DDC.json')
const shelfMarkRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/Shelfmark.json')
const itemRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/Item.json')
const retentionRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/ItemRetention.json')
const itemAcqSourceRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/ItemAcqSource.json')
const enumerationRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/ItemEnumeration.json')
const chronologyRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/ItemChronology.json')
const adminMetaRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/adminMetadata.json')
const adminMetaStatusRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/adminMetadataStatus.json')
const rdaItemMonoRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/rdaItemMonograph.json')
const rdaManifestMonoRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/RDAMainifestationMonograph.json')
//ShareVDE example
const sharevdeRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/ShareVDEExample.json')

export const resourceTemplateId2Json = [
  { id: 'resourceTemplate:bf2:Monograph:Instance', json: monographInstanceRt },
  { id: 'resourceTemplate:bf2:Monograph:Work', json: monographWorkRt },
  { id: 'resourceTemplate:bf2:Identifiers:Barcode', json: barcodeRt },
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
  { id: 'resourceTemplate:bf2:ShareVDE:Example', json: sharevdeRt },

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
