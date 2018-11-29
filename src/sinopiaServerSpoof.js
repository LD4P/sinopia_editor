// data structures to support spoofing Sinopia Server calls to get resource templates, etc.
// TODO: eventually, this will do an http request to the sinopiaServer via fetch or axios

const monographInstanceRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/MonographInstance.json')
const monographWorkRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/MonographWork.json')
const noteRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/Note.json')
const parallelTitleRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/ParallelTitle.json')
const serialRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/SerialFrequency.json')
const titleRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/Title.json')
const titleNoteRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/TitleNote.json')
const transcribedTitleRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/TranscribedTitle.json')
const varTitleRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/VarTitle.json')
const workTitleRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/WorkTitle.json')
const workVariantTitleRt = require('../static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/WorkVariantTitle.json')
const qaLocVocabFrequencies = require('../static/spoofedFilesFromServer/fromQA/frequencies.json')
const resourceTemplateId2Json = [
  {'id': 'resourceTemplate:bf2:Monograph:Instance', 'json': monographInstanceRt},
  {'id': 'resourceTemplate:bf2:Monograph:Work', 'json': monographWorkRt},
  {'id': 'resourceTemplate:bf2:Note', 'json': noteRt},
  {'id': 'resourceTemplate:bf2:ParallelTitle', 'json': parallelTitleRt},
  {'id': 'resourceTemplate:bf2:Serial:Frequency', 'json': serialRt},
  {'id': 'resourceTemplate:bf2:Title', 'json': titleRt},
  {'id': 'resourceTemplate:bf2:Title:Note', 'json': titleNoteRt},
  {'id': 'resourceTemplate:bflc:TranscribedTitle', 'json': transcribedTitleRt},
  {'id': 'resourceTemplate:bf2:Title:VarTitle', 'json': varTitleRt},
  {'id': 'resourceTemplate:bf2:WorkTitle', 'json': workTitleRt},
  {'id': 'resourceTemplate:bf2:WorkVariantTitle', 'json': workVariantTitleRt},
  {'id': 'vocabulary:bf2:frequencies', 'json': qaLocVocabFrequencies}
]

const resourceTemplateIds = []
loadResourceTemplates()
module.exports.resourceTemplateIds = resourceTemplateIds
module.exports.resourceTemplateId2Json = resourceTemplateId2Json
module.exports.getResourceTemplate = getResourceTemplate

function loadResourceTemplates() {
  if (resourceTemplateIds.length == 0) {
    resourceTemplateId2Json.forEach(function (el) {
      resourceTemplateIds.push(el.id)
    })
  }
}

function getResourceTemplate(rtId) {
  var rTemplate = {propertyTemplates : [{}] }
  if (rtId != null) {
    if (resourceTemplateIds.includes(rtId)) {
      // FIXME:  there's probably a better way to find the value in array than forEach
      resourceTemplateId2Json.forEach( function(el) {
        if (rtId == el.id) {
          rTemplate = el.json
        }
      })
    } else {
      console.error(`ERROR: un-spoofed resourceTemplate: ${rtId}`)
    }
  } else {
    console.error(`ERROR: asked for resourceTemplate with null id`)
  }
  return rTemplate
}
