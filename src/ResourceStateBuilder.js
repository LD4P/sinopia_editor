// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'

import rdf from 'rdf-ext'
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
  constructor(dataset, resourceURI) {
    this.dataset = dataset
    this.resourceURI = resourceURI === '' ? null : resourceURI
    this.resourceState = {}
  }

  /**
   * @return {Object} the resource represented as Redux state
   */
  get state() {
    this.resourceState = this.buildResource(rdf.namedNode(this.resourceURI))

    return this.resourceState
  }

  /**
   * @param {rdf.Term} resourceTerm NamedNode or BlankNode of resource to be built
   * @return {Object} the resource represented as Redux state
   */
  buildResource(resourceTerm) {
    const thisResourceState = {}
    // Find the resource template id. Should be only 1.
    const rtId = this.findResourceTemplateId(resourceTerm)
    thisResourceState[rtId] = {}

    // Find the properties
    const propertyDataset = this.findProperties(resourceTerm)

    // Add each property
    propertyDataset.forEach((quad) => {
      const propertyURI = quad.predicate.value
      if (quad.object.termType === 'BlankNode') {
        if (thisResourceState[rtId][propertyURI] === undefined) {
          thisResourceState[rtId][propertyURI] = {}
        }
        thisResourceState[rtId][propertyURI][shortid.generate()] = this.buildResource(quad.object)
      } else {
        if (!_.has(thisResourceState[rtId], propertyURI)) {
          thisResourceState[rtId][propertyURI] = { items: [] }
        }
        const item = this.buildItem(quad)

        thisResourceState[rtId][propertyURI].items.push(item)
      }
    })
    return thisResourceState
  }

  /**
   * @param {rdf.Term} resourceTerm NamedNode or BlankNode of resource to find
   * @return {string} the resource template id
   */
  findResourceTemplateId(resourceTerm) {
    // Should be only 1.
    return this.match(this.dataset, resourceTerm, rdf.namedNode('http://www.w3.org/ns/prov#wasGeneratedBy')).toArray()[0].object.value
  }

  /**
   * @param {rdf.Term} resourceTerm NamedNode or BlankNode of resource to find
   * @return {rdf.Dataset} dataset containing all of the properties for the provided resource term
   */
  findProperties(resourceTerm) {
    // Find the properties
    const propertyDataset = this.match(this.dataset, resourceTerm)
    // Remove triples that are not properties.
    propertyDataset.removeMatches(null, rdf.namedNode('http://www.w3.org/ns/prov#wasGeneratedBy'))
    propertyDataset.removeMatches(null, rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'))

    return propertyDataset
  }

  /**
   * @param {rdf.Quad} quad for a property value
   * @return {Object} item state structure
   */
  buildItem(quad) {
    const item = { id: shortid.generate() }
    if (quad.object.termType === 'NamedNode') {
      item.uri = quad.object.value
    } else {
      // A literal
      item.content = quad.object.value
      // Add language
      const lang = quad.object.language
      if (!_.isEmpty(lang)) {
        item.lang = { id: lang }
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
}
