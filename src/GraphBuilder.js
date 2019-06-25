// Copyright 2019 Stanford University see LICENSE for license

const rdf = require('rdf-ext')
const _ = require('lodash')

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
      const resourceClass = this.getResourceTemplateClass(resourceTemplateId)

      this.buildTriplesForNode(resourceURI,
        resourceClass,
        resourceTemplateId,
        this.getPredicateList(resource[resourceTemplateId]))
    })
    return this.dataset
  }

  /**
   * @return {string} a string containing a uri for the class, or undefined when
   *   the class hasn't been loaded.  This can occur when there is a property
   *   that has a template ref, and that ref was never loaded because the
   *   property in the tree wasn't expanded
   */
  getResourceTemplateClass(resourceTemplateId) {
    return this.state.entities.resourceTemplates[resourceTemplateId]?.resourceURI
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
   * @param {Object} value looks something like this:
   *   { 'resourceTemplate:bf2:WorkTitle':
   *     { 'http://id.loc.gov/ontologies/bibframe/mainTitle': {},
   *       'http://id.loc.gov/ontologies/bibframe/partName': {} } }
   *
   * @return {rdf.Term} if nested object was found
   */
  buildTriplesForNestedObject(value) {
    // Is there ever more than one base node?
    const results = Object.keys(value).map((resourceTemplateId) => {
      const resourceClass = this.getResourceTemplateClass(resourceTemplateId)

      if (!resourceClass) {
        return
      }

      const baseURI = rdf.blankNode()

      this.buildTriplesForNode(baseURI,
        resourceClass,
        resourceTemplateId,
        this.getPredicateList(value[resourceTemplateId]))
      return baseURI
    })

    return results[0]
  }

  /**
   * @param {rdf.Term} baseURI
   * @param {string} resourceTemplateId the identifier of the resource template
   * @param {Array.<Object>}
   */
  buildTriplesForNode(baseURI, resourceClass, resourceTemplateId, predicateList) {
    this.addTypeTriple(baseURI, rdf.namedNode(resourceClass))
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
          const bnode = this.buildTriplesForNestedObject(nestedValue)
          if (bnode) {
            this.dataset.add(rdf.quad(baseURI, rdf.namedNode(predicate), bnode))
          }
        })
      }
    }
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
