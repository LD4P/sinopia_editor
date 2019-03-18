import superagent from 'superagent'
import Config from './Config'

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

export const resourceTemplateId2Json = [
  {id: 'resourceTemplate:bf2:Monograph:Instance', json: monographInstanceRt},
  {id: 'resourceTemplate:bf2:Monograph:Work', json: monographWorkRt},
  {id: 'resourceTemplate:bf2:Identifiers:Barcode', json: barcodeRt},
  {id: 'resourceTemplate:bf2:Note', json: noteRt},
  {id: 'resourceTemplate:bf2:ParallelTitle', json: parallelTitleRt},
  {id: 'resourceTemplate:bf2:Title', json: titleRt},
  {id: 'resourceTemplate:bf2:Title:Note', json: titleNoteRt},
  {id: 'resourceTemplate:bflc:TranscribedTitle', json: transcribedTitleRt},
  {id: 'resourceTemplate:bf2:Title:VarTitle', json: varTitleRt},
  {id: 'resourceTemplate:bf2:WorkTitle', json: workTitleRt},
  {id: 'resourceTemplate:bf2:WorkVariantTitle', json: workVariantTitleRt},
  {id: 'resourceTemplate:bf2:Identifiers:LC', json: lccnRt},
  {id: 'resourceTemplate:bf2:Identifiers:DDC', json: ddcRt},
  {id: 'resourceTemplate:bf2:Identifiers:Shelfmark', json:shelfMarkRt},
  {id: 'resourceTemplate:bf2:Item', json: itemRt},
  {id: 'resourceTemplate:bf2:Item:Retention', json: retentionRt},
  {id: 'resourceTemplate:bf2:Item:ItemAcqSource', json: itemAcqSourceRt},
  {id: 'resourceTemplate:bf2:Item:Enumeration', json: enumerationRt},
  {id: 'resourceTemplate:bf2:Item:Chronology', json: chronologyRt}
]

export const resourceTemplateIds = resourceTemplateId2Json.map(template => template.id)

const getSpoofedResourceTemplate = (templateId) => {
  const emptyTemplate = { propertyTemplates : [{}] }

  if (!templateId) {
    console.log(`ERROR: asked for resourceTemplate with null/undefined id`)
    return emptyTemplate
  }

  if (!resourceTemplateIds.includes(templateId)) {
    console.log(`ERROR: un-spoofed resourceTemplate: ${templateId}`)
    return emptyTemplate
  }

  console.log(`returning template ${templateId} from spoof`)
  return resourceTemplateId2Json.find((template) => {
    return template.id == templateId
  }).json
}

const getResourceTemplateFromServer = async (templateId) => {
  console.log(`returning template ${templateId} from server`)
  let response = await superagent.get(`${Config.resourceTemplateContainerUrl}/${templateId}`).accept('json')
  return response.body
}

export const getResourceTemplate = async (templateId) => {
  if (Config.spoofSinopiaServer)
    return getSpoofedResourceTemplate(templateId)

  return await getResourceTemplateFromServer(templateId)
}
