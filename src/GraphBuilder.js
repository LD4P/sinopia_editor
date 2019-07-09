// Copyright 2019 Stanford University see LICENSE for license

import rdf from 'rdf-ext'
import _ from 'lodash'

/**
 * Builds RDF graphs from the Redux state
 */
export default class GraphBuilder {
  /**
   * @param {Object} state the Redux state
   */
  constructor(state) {
    this.state = state
    this.dataset = rdf.dataset()
  }

  /**
   * @return {Graph} an RDF graph that represents the data in the state
   */
  get graph() {
    // Is there ever more than one base node?
    const resource = this.state.resource

    Object.keys(resource).forEach((resourceTemplateId) => {
      // If the resourceURI is not in the state, then this is an unsaved resource and we want a relative URI to use as the base
      const resourceURI = rdf.namedNode(resource[resourceTemplateId].resourceURI || '')

      this.buildTriplesForNode(resourceURI,
        resourceTemplateId,
        this.getPredicateList(resource[resourceTemplateId]))
    })
    return this.dataset
  }

  /**
   * @return {string} a string containing a uri for the class
   */
  getResourceTemplateClass(resourceTemplateId) {
    return this.state.entities.resourceTemplates[resourceTemplateId].resourceURI
  }

  /**
   * Filter out the non-predicate values (e.g. resourceURI)
   * @param {<object>} Object containing predicates as keys
   * @return {<Object>} the filtered predicate list
   */
  getPredicateList(predicateList) {
    const newPredicateList = {}

    Object.keys(predicateList).forEach((predicateKey) => {
      if (!['resourceURI'].includes(predicateKey)) {
        newPredicateList[predicateKey] = predicateList[predicateKey]
      }
    })
    return newPredicateList
  }

  /**
   * @param {rdf.Term} baseURI
   * @param {Object} value looks something like this:
   *   { 'resourceTemplate:bf2:WorkTitle':
   *     { 'http://id.loc.gov/ontologies/bibframe/mainTitle': {},
   *       'http://id.loc.gov/ontologies/bibframe/partName': {} } }
   */
  buildTriplesForNestedObject(baseURI, value) {
    // Is there ever more than one base node?
    Object.keys(value).forEach((resourceTemplateId) => {
      this.buildTriplesForNode(baseURI,
        resourceTemplateId,
        this.getPredicateList(value[resourceTemplateId]))
    })
  }

  /**
   * @param {rdf.Term} baseURI
   * @param {string} resourceTemplateId the identifier of the resource template
   * @param {Array.<Object>}
   */
  buildTriplesForNode(baseURI, resourceTemplateId, predicateList) {
    const type = this.getResourceTemplateClass(resourceTemplateId)

    if (type) {
      this.addTypeTriple(baseURI, rdf.namedNode(type))
    }

    this.addGeneratedByTriple(baseURI, resourceTemplateId)

    // Now add all the other properties
    for (const predicate in predicateList) {
      const value = predicateList[predicate]

      if (_.isEmpty(value)) {
        continue
      }

      if (value.items) {
        for (const item of value.items) {
          const object = item.uri ? rdf.namedNode(item.uri) : this.createLiteral(item)
          this.dataset.add(rdf.quad(baseURI, rdf.namedNode(predicate), object))
        }
      } else { // It's a deeply nested object
        Object.keys(value).filter(elem => elem !== 'errors').forEach((key) => {
          const nestedValue = value[key]
          const bnode = rdf.blankNode()

          // Before adding blank node, make sure that there is a descendant non-empty items array.
          if (this.hasItemDescendants(nestedValue)) {
            this.dataset.add(rdf.quad(baseURI, rdf.namedNode(predicate), bnode))
            this.buildTriplesForNestedObject(bnode, nestedValue)
          }
        })
      }
    }
  }

  /**
   * Returns true if value or descendant has a non-empty item
   * @param {Object} value from the redux store
   */
  hasItemDescendants(value) {
    if (value.items && value.items.length > 0) {
      return true
    }
    return Object.keys(value).some(key => this.hasItemDescendants(value[key]))
  }

  /**
   * Returns a literal with an optional language tag
   * @param {Object} item from the redux store
   * @return {rdf.LiteralExt} the literal with a language value
   */
  createLiteral(item) {
    return rdf.literal(item.content, item.lang?.items[0].id)
  }

  /**
   * @param {rdf.Term} baseURI
   * @param {rdf.Term} type
   */
  addTypeTriple(baseURI, type) {
    this.dataset.add(rdf.quad(baseURI,
      rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
      type))
  }

  /**
   * Adds the assertion that points at the resourceTemplate we used to generate this node
   * @param {rdf.Term} baseURI
   * @param {string} resourceTemplateId the identifier of the resource template
   */
  addGeneratedByTriple(baseURI, resourceTemplateId) {
    this.dataset.add(rdf.quad(baseURI,
      rdf.namedNode('http://www.w3.org/ns/prov#wasGeneratedBy'),
      rdf.literal(resourceTemplateId)))
  }
}
