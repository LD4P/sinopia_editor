// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import rdf from 'rdf-ext'
import { getResourceTemplate } from 'sinopiaServer'
import _ from 'lodash'
import { validateResourceTemplate } from 'ResourceTemplateValidator'

/**
 * Builds Redux state from an RDF graph.
 * Example usage:
 * const builder = new ResourceStateBuilder(dataset, 'http://example/123')
 * const resourceState = builder.state
 */
export default class ResourceStateBuilder {
  /**
   * @param {rdf.Dataset} dataset the RDF graph
   * @param {string|null} resourceURI URI of the resource
   * @param {string|null} resourceTemplateId base resource template id
   */
  constructor(dataset, resourceURI, resourceTemplateId) {
    this.dataset = dataset
    this.resourceURI = _.isEmpty(resourceURI) ? '' : resourceURI
    this.baseResourceTemplateId = resourceTemplateId
  }

  /**
   * @return {Promise<[Object, rdf.Dataset, Object]>} the resource represented as Redux state,
   *  dataset containing unmatched triples, the resource templates
   * @raise reasons that generating state failed, including problems with the resource and loaded resource templates
   * @raise {ResourceStateBuilderTemplateError} if a resource template cannot be loaded or is not found or is invalid
   */
  async buildState() {
    this.resourceState = {}
    this.usedDataset = rdf.dataset(this.findTypeQuads(rdf.namedNode(this.resourceURI)))
    this.resourceTemplates = {}

    // Find the resource template id of base resource. Should be only 1.
    const rtId = this.baseResourceTemplateId || this.findRootResourceTemplateId()
    this.usedDataset.addAll(this.findResourceTemplateQuads(rdf.namedNode(this.resourceURI)))

    this.resourceState = await this.buildResource(rdf.namedNode(this.resourceURI), rtId)
    return [this.resourceState, this.dataset.difference(this.usedDataset), this.resourceTemplates]
  }

  /**
   * Builds the state for a resource.
   * @param {rdf.Term} resourceTerm NamedNode or BlankNode of resource to be built
   * @return {Object} the resource represented as Redux state
   */
  async buildResource(resourceTerm, rtId) {
    const resourceTemplate = await this.findResourceTemplate(rtId)
    const thisResourceState = { [rtId]: {} }

    // So that only use known properties, looping over property templates.
    await Promise.all(resourceTemplate.propertyTemplates.map(async (propertyTemplate) => {
      const thisPropertyState = await this.buildProperty(resourceTerm, propertyTemplate)
      if (!_.isEmpty(thisPropertyState)) {
        thisResourceState[rtId][propertyTemplate.propertyURI] = thisPropertyState
      }
    }))
    return thisResourceState
  }

  /**
   * Builds the state for a property.
   * @param {rdf.Term} resourceTerm NamedNode or BlankNode of resource to build
   * @param {Object} Property template of the property to build.
   * @return {Object} the property represented as Redux state
   */
  async buildProperty(resourceTerm, propertyTemplate) {
    const thisPropertyState = {}
    const propertyURI = propertyTemplate.propertyURI

    // literal, resource (URI), or embedded_resource
    const propertyType = _.isEmpty(propertyTemplate?.valueConstraint?.valueTemplateRefs) ? propertyTemplate.type : 'embedded_resource'

    // All quads for this property
    const propertyQuads = this.match(resourceTerm, rdf.namedNode(propertyURI)).toArray()
    await Promise.all(propertyQuads.map(async (quad) => {
      if (propertyType === 'embedded_resource') {
        const embeddedResourceState = await this.buildEmbeddedResource(quad, propertyTemplate)
        if (embeddedResourceState) {
          thisPropertyState[shortid.generate()] = embeddedResourceState
        }
      } else {
        if (_.isEmpty(thisPropertyState)) {
          thisPropertyState.items = {}
        }
        thisPropertyState.items[shortid.generate()] = this.buildItem(quad)
      }
    }))
    return thisPropertyState
  }

  /**
   * @param {rdf.Term} resourceTerm NamedNode or BlankNode of resource to find
   * @return {string} the resource template id
   */
  findResourceTemplateQuads(resourceTerm) {
    return this.match(resourceTerm, rdf.namedNode('http://sinopia.io/vocabulary/hasResourceTemplate')).toArray()
  }

  /**
   * Builds a Literal or URI
   * @param {rdf.Quad} quad for a property value
   * @return {Object} item state structure
   */
  buildItem(quad) {
    const item = {}
    const labelNode = rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#label')
    if (quad.object.termType === 'NamedNode') {
      item.uri = quad.object.value
      const label = this.dataset.match(item.uri, labelNode).toArray()
      if (label.length > 0) {
        item.label = label[0].object.value // Use first match
        // Remove quad(s) from dataset
        this.dataset.removeMatches(item.uri, labelNode)
      } else {
        item.label = item.uri
      }
    } else {
      // A literal
      item.content = quad.object.value
      item.label = item.content // required for InputLookupQA
      // Add language
      const lang = quad.object.language
      if (!_.isEmpty(lang)) {
        item.lang = lang
      }
    }
    this.usedDataset.add(quad)
    return item
  }

  /**
   * Builds the state for an embedded resource.
   * @param {rdf.Quad} Quad whose object is embedded resource
   * @param {Object} Property template of the property to build
   * @return {Object|null} the embedded resource represented as Redux state or null if no embedded resource
   * @raise if more than one resource template can be used for this resource
   */
  async buildEmbeddedResource(quad, propertyTemplate) {
    // Only build this embedded resource if can find the resource template.
    // Multiple types may be provided.
    const typeQuads = this.findTypeQuads(quad.object)

    // Among the valueTemplateRefs, find all of the resource templates that match a type.
    // Ideally, only want 1 but need to handle other cases.
    const childRtIds = await Promise.all(typeQuads.map(async (typeQuad) => this.selectResourceTemplateId(propertyTemplate, typeQuad.object.value)))
    const compactChildRtIds = _.compact(_.flatten(childRtIds))

    // Don't know which to pick, so error.
    if (compactChildRtIds.length > 1) {
      throw `More than one resource template matches: ${compactChildRtIds}`
    }
    // No matching resource template, so do nothing
    if (_.isEmpty(compactChildRtIds)) {
      return null
    }
    // One resource template
    this.usedDataset.addAll(typeQuads)
    this.usedDataset.add(quad)
    return this.buildResource(quad.object, compactChildRtIds[0])
  }

  /**
   * Matches against this dataset.
   * Necessary becase rdf.Dataset.match() does not correct handle null named nodes.
   * @param {rdf.Term|null} subject to match
   * @param {rdf.Term|null} predicate to match
   * @return {rdf.Dataset} matching quads
   */
  match(subject, predicate) {
    const newDataset = rdf.dataset()
    this.dataset.match(subject, predicate).toArray().forEach((quad) => {
      if (!subject || quad.subject.equals(subject)) {
        newDataset.add(quad)
      }
    })
    return newDataset
  }

  async findResourceTemplate(rtId) {
    if (this.resourceTemplates[rtId]) {
      return this.resourceTemplates[rtId]
    }

    return getResourceTemplate(rtId, 'ld4p').then((response) => {
      const resourceTemplate = response.response.body
      this.resourceTemplates[rtId] = resourceTemplate
      return validateResourceTemplate(resourceTemplate)
        .then((errors) => {
          if (!_.isEmpty(errors)) {
            const err = new Error(`Error validating ${rtId}: ${errors.join(' ')}`)
            err.name = 'ResourceStateBuilderTemplateError'
            err.validationErrors = errors
            throw err
          }
          return resourceTemplate
        })
        .catch((err) => { throw err })
    }).catch((err) => {
      if (err.name === 'ResourceStateBuilderTemplateError') throw err
      const error = new Error(`Unable to load ${rtId}: ${err}`)
      error.name = 'ResourceStateBuilderTemplateError'
      throw error
    })
  }

  async selectResourceTemplateId(propertyTemplate, resourceURI) {
    return Promise.all(
      propertyTemplate.valueConstraint.valueTemplateRefs.map(async (rtId) => {
        const rt = await this.findResourceTemplate(rtId)
        return rt.resourceURI === resourceURI ? rtId : undefined
      }),
    )
  }

  findTypeQuads(resourceTerm) {
    return this.match(resourceTerm, rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')).toArray()
  }

  /**
   * @return {String} the resource template id
   * @raise if the wrong number of resource template ids are found
   */
  findRootResourceTemplateId() {
    const rtQuads = this.findResourceTemplateQuads(rdf.namedNode(this.resourceURI))
    if (rtQuads.length !== 1) {
      throw 'A single resource template must be included as a triple (http://sinopia.io/vocabulary/hasResourceTemplate)'
    }
    const rtQuad = rtQuads[0]
    return rtQuad.object.value
  }
}
