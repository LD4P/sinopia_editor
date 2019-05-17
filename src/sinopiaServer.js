import SinopiaServer from 'sinopia_server'
import { loadState } from './localStorage'
import Config from './Config'

const instance = new SinopiaServer.LDPApi()
const curJwt = loadState('jwtAuth')

instance.apiClient.basePath = Config.sinopiaServerBase
if (curJwt !== undefined) {
  instance.apiClient.authentications['CognitoUser'].accessToken = curJwt.id_token
}

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
  {id: 'resourceTemplate:bf2:Identifiers:LCCN', json: lccnRt},
  {id: 'resourceTemplate:bf2:Identifiers:DDC', json: ddcRt},
  {id: 'resourceTemplate:bf2:Identifiers:Shelfmark', json:shelfMarkRt},
  {id: 'resourceTemplate:bf2:Item', json: itemRt},
  {id: 'resourceTemplate:bf2:Item:Retention', json: retentionRt},
  {id: 'resourceTemplate:bf2:Item:ItemAcqSource', json: itemAcqSourceRt},
  {id: 'resourceTemplate:bf2:Item:Enumeration', json: enumerationRt},
  {id: 'resourceTemplate:bf2:Item:Chronology', json: chronologyRt}
]

const emptyTemplate = { propertyTemplates : [{}] }
export const resourceTemplateIds = resourceTemplateId2Json.map(template => template.id)

const getSpoofedResourceTemplate = (templateId) => {
  if (!templateId) {
    emptyTemplate['error'] = `ERROR: asked for resourceTemplate with null/undefined id`
    return emptyTemplate
  }

  if (!resourceTemplateIds.includes(templateId)) {
    emptyTemplate['error'] = `ERROR: un-spoofed resourceTemplate: ${templateId}`
    return emptyTemplate
  }

  const spoofedResponse = { response: {} }

  spoofedResponse['response']['body'] = resourceTemplateId2Json.find((template) => {
    if(template.id == templateId)
      return template
  }).json

  return new Promise(resolve => {
    resolve(spoofedResponse)
  })
}

export const spoofedResourcesInGroupContainer = (group) => {
  const container = `http://spoof.trellis.io/${group}`
  const ids = []
  resourceTemplateId2Json.map(rt => {
    ids.push(`${container}/${rt.id}`)
  })
  return {
    response: {
      body: {
        "@id": container,
        contains: ids
      }
    }
  }
}

const getResourceTemplateFromServer = (templateId, group) => {
  // Allow function to be called without second arg
  if (!group)
    group = Config.defaultSinopiaGroupId

  if (!templateId) {
    emptyTemplate['error'] = `ERROR: asked for resourceTemplate with null/undefined id`
    return emptyTemplate
  }

  return instance.getResourceWithHttpInfo(group, templateId, { acceptEncoding: 'application/json' })
}

export const getResourceTemplate = (templateId, group) => {
  if (Config.spoofSinopiaServer)
    return getSpoofedResourceTemplate(templateId)

  return getResourceTemplateFromServer(templateId, group)
}

export const getGroups = () => {
  if (Config.spoofSinopiaServer)
    return new Promise(resolve => {
      resolve({
        response: {
          body: {
            contains: 'http://spoof.trellis.io/ld4p'
          }
        }
      })
    })

  return instance.getBaseWithHttpInfo()
}

export const listResourcesInGroupContainer = (group) => {
  if (Config.spoofSinopiaServer)
    return new Promise(resolve => {
      resolve(spoofedResourcesInGroupContainer(group))
    })

  return instance.getGroupWithHttpInfo(group)
}
