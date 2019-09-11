// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'

import rdf from 'rdf-ext'
import { getResourceTemplate } from 'sinopiaServer'
import _ from 'lodash'

/**
 * Builds Redux state from an RDF graph.
 * Example usage:
 * const builder = new ResourceStateBuilder(dataset, 'http://example/123')
 * const resourceState = builder.state
 */
export default class ResourceStateBuilder {
  /**
   * @param {Dataset} dataset the RDF graph
   * @param {string|null} resourceURI URI of the resource
   */
  constructor(dataset, resourceURI, resourceTemplateId) {
    this.dataset = dataset
    this.resourceURI = resourceURI === '' ? null : resourceURI
    this.resourceTemplateId = resourceTemplateId === '' ? null : resourceTemplateId
    this.resourceState = {}
    this.usedDataset = rdf.dataset(this.findTypeQuads(rdf.namedNode(this.resourceURI)))
  }

  /**
   * @return {Object} the resource represented as Redux state
   */
  async generateState() {
    // If a resource template id isn't provided, find one in the RDF.
    let rtId = this.resourceTemplateId
    if (!rtId) {
      // Find the resource template id of base resource. Should be only 1.
      const rtQuads = this.findResourceTemplateQuads(rdf.namedNode(this.resourceURI))
      if (rtQuads.length !== 1) {
        // TODO: Surface this to user.
        throw 'A single resource template must be provided or included as a triple (http://sinopia.io/vocabulary/hasResourceTemplate)'
      }
      const rtQuad = rtQuads[0]
      this.usedDataset.add(rtQuad)
      rtId = rtQuad.object.value
    }

    this.resourceState = await this.buildResource(rdf.namedNode(this.resourceURI), rtId)

    return [this.resourceState, this.dataset.difference(this.usedDataset)]
  }

  /**
   * @param {rdf.Term} resourceTerm NamedNode or BlankNode of resource to be built
   * @return {Object} the resource represented as Redux state
   */
  async buildResource(resourceTerm, rtId) {
    const resourceTemplate = await this.findResourceTemplate(rtId)

    const thisResourceState = {[rtId]: {}}

    // So that only use known properties, looping over property templates.
    await Promise.all(resourceTemplate.propertyTemplates.map(async (propertyTemplate) => {
      const propertyURI = propertyTemplate.propertyURI
      // All quads for this property
      const propertyQuads = this.match(this.dataset, resourceTerm, rdf.namedNode(propertyURI)).toArray()
      await Promise.all(propertyQuads.map(async (quad) => {
        // Assume that if there are children quads or there are valueTemplateRefs then this is an embedded resource.
        // Otherwise, it is a terminal literal or URI.
        let childrenQuads = []
        // Because literals won't have children quads.
        if (quad.object.termType !== 'Literal') {
          childrenQuads = this.match(this.dataset, quad.object).toArray()
        }
        // Better way to make sure valueConstraint is defined?
        if (_.isEmpty(childrenQuads) && (!propertyTemplate.valueConstraint || _.isEmpty(propertyTemplate.valueConstraint.valueTemplateRefs))) {
          if (!_.has(thisResourceState[rtId], propertyURI)) {
            thisResourceState[rtId][propertyURI] = { items: {} }
          }
          const item = this.buildItem(quad)

          thisResourceState[rtId][propertyURI].items[shortid.generate()] = item
          this.usedDataset.add(quad)
        } else {
          // Only build this embedded resource if can find the resource template.
          // Multiple types may be provided.
          const typeQuads = this.findTypeQuads(quad.object)

          // Among the valueTemplateRefs, find all of the resource templates that match a type.
          // Ideally, only want 1 but need to handle other cases.
          const childRtIds = await Promise.all(typeQuads.map(async (typeQuad) => {
              return this.selectResourceTemplateId(resourceTemplate, propertyURI, typeQuad.object.value)
          }))
          const compactChildRtIds = _.compact(childRtIds)

          // Don't know which to pick, so error.
          if (compactChildRtIds.length > 1) {
            throw 'More than one resource template matches: ' + compactChildRtIds
          }

          // Only handle if there is 1.
          if (! _.isEmpty(compactChildRtIds)) {
            const childRtId = compactChildRtIds[0]
            if (!_.has(thisResourceState[rtId], propertyURI)) {
              thisResourceState[rtId][propertyURI] = {}
            }
            thisResourceState[rtId][propertyURI][shortid.generate()] = await this.buildResource(quad.object, childRtId)
            this.usedDataset.addAll(typeQuads)
            this.usedDataset.add(quad)
          }
        }
      }))
    }))
    return thisResourceState
  }

  /**
   * @param {rdf.Term} resourceTerm NamedNode or BlankNode of resource to find
   * @return {string} the resource template id
   */
  findResourceTemplateQuads(resourceTerm) {
    return this.match(this.dataset, resourceTerm, rdf.namedNode('http://sinopia.io/vocabulary/hasResourceTemplate')).toArray()
  }

  /**
   * @param {rdf.Quad} quad for a property value
   * @return {Object} item state structure
   */
  buildItem(quad) {
    const item = {}
    if (quad.object.termType === 'NamedNode') {
      item.uri = quad.object.value
      // Until we have a way of looking up label values, use the URI as the label
      item.label = item.uri
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
    return item
  }

  /**
   * Matches against a dataset.
   * Necessary becase rdf.Dataset.match() does not correct handle null named nodes.
   * @param {rdf.Dataset} dataset to match against
   * @param {rdf.Term|null} subject to match
   * @param {rdf.Term|null} predicate to match
   * @return {rdf.Dataset} matching quads
   */
  match(dataset, subject, predicate) {
    const newDataset = rdf.dataset()
    this.dataset.match(subject, predicate).toArray().forEach((quad) => {
      if (!subject || quad.subject.equals(subject)) {
        newDataset.add(quad)
      }
    })
    return newDataset
  }

  async findResourceTemplate(rtId) {
    // TODO: Cache these
    return getResourceTemplate(rtId, 'ld4p').then((response) => {
      return response.response.body
    }).catch((err) => {
      console.error(err)
      // TODO: Error handling
    })
  }

  async selectResourceTemplateId(resourceTemplate, propertyURI, resourceURI) {
    const propertyTemplate = resourceTemplate.propertyTemplates.find((propertyTemplate) => {
      return propertyTemplate.propertyURI === propertyURI
    })
    // TODO: Handle no match
    // TODO: Can there be more than one with matching class?
    const rtIds = await Promise.all(
      propertyTemplate.valueConstraint.valueTemplateRefs.map(async (rtId) => {
        const rt = await this.findResourceTemplate(rtId)
        return rt.resourceURI === resourceURI ? rtId : undefined
      })
    )
    return rtIds.find((rtId) => rtId !== undefined)
  }

  findTypeQuads(resourceTerm) {
    return this.match(this.dataset, resourceTerm, rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')).toArray()
  }
}
