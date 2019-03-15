import fs from 'fs'
import superagent from 'superagent'
import Config from './Config'

const templateDir = 'static/spoofedFilesFromServer/fromSinopiaServer/resourceTemplates/'
const templateContainer = Config.resourceTemplateContainerPath
const templateContainerUrl = Config.resourceTemplateContainerUrl
// Load list of template files
const templates = fs.readdirSync(templateDir)

// Create templates container if it doesn't exist
superagent.get(templateContainerUrl)
  .then(() => {
    console.log('templates container already exists')
  })
  .catch(error => {
    if (error.status !== 404) {
      console.log(`templates container retrieval failed with ${error}`)
      return null
    }

    console.log('creating templates container')

    superagent.post(Config.sinopiaServerUrl)
      .type('application/ld+json')
      .set('Link', '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"')
      .set('Slug', templateContainer)
      .send('{ "@context": { "dcterms": "http://purl.org/dc/terms/" }, "@id": "", "dcterms:title": "LD4P group" }')
      .then(() => {
        console.log('container creation succeeded')
      })
      .catch(error => {
        console.log(`container creation failed with ${error}`)
      })
  })

templates.forEach((template) => {
  // Skip the note profile
  if (template === 'Note(Profile).json')
    return
  // Without second arg, a buffer (vs. a string) is returned
  let templateJson = fs.readFileSync(`${templateDir}/${template}`, 'utf8')
  let identifier = JSON.parse(templateJson).id

  superagent.post(templateContainerUrl)
    .type('application/json')
    .set('Link', '<http://www.w3.org/ns/ldp#NonRDFSource>; rel="type"')
    .set('Slug', identifier)
    .send(templateJson)
    .then(() => {
      console.log(`template created ${templateContainerUrl}/${identifier}`)
    })
    .catch(error => {
      console.log(`template creation failed with ${error}`)
    })
})
