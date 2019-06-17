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

      this.buildTriplesForNode(resourceURI,
        this.getResourceTemplateClass(resourceTemplateId),
        this.getPredicateList(resource[resourceTemplateId]))
    })
    return this.dataset
  }

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
        this.getResourceTemplateClass(resourceTemplateId),
        this.getPredicateList(value[resourceTemplateId]))
    })
  }

  /**
   * @param {rdf.Term} baseURI
   * @param {string} type
   * @param {Array.<Object>}
   */
  buildTriplesForNode(baseURI, type, predicateList) {
    if (type) {
      this.addTypeTriple(baseURI, rdf.namedNode(type))
    }

    // Now add all the other properties
    for (const predicate in predicateList) {
      const value = predicateList[predicate]

      if (_.isEmpty(value)) {
        continue
      }

      if (value.items) {
        for (const item of value.items) {
          if (item.uri) {
            this.dataset.add(rdf.quad(baseURI, rdf.namedNode(predicate), rdf.namedNode(item.uri)))
          } else {
            this.dataset.add(rdf.quad(baseURI, rdf.namedNode(predicate), rdf.literal(item.content)))
          }
        }
      } else { // It's a deeply nested object
        Object.keys(value).filter(elem => elem !== 'errors').forEach((key) => {
          const nestedValue = value[key]
          const bnode = rdf.blankNode()

          this.dataset.add(rdf.quad(baseURI, rdf.namedNode(predicate), bnode))
          this.buildTriplesForNestedObject(bnode, nestedValue)
        })
      }
    }
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
}
