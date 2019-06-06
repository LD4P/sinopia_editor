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
    // A relative URI to use as the base
    const baseURI = rdf.namedNode('')

    // Is there ever more than one base node?
    Object.keys(this.state).forEach((key) => {
      this.buildTriplesForNode(baseURI, rdf.namedNode(this.state[key].rdfClass), this.getPredicateList(key))
    })
    return this.dataset
  }

  /**
   * Filter out the non-predicate values (e.g. rdfClass)
   * @param {string} key
   * @return {Array.<Object>} the predicate InputListLOC
   */
  getPredicateList(key) {
    const predicateList = {}

    Object.keys(this.state[key]).forEach((predicateKey) => {
      if (predicateKey != 'rdfClass') {
        predicateList[predicateKey] = this.state[key][predicateKey]
      }
    })
    return predicateList
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
    Object.values(value).forEach((rt) => {
      // we don't have a resourceURI to send as the second argument in the propertyTemplates yet.
      this.buildTriplesForNode(baseURI, null, rt)
    })
  }

  /**
   * @param {rdf.Term} baseURI
   * @param {rdf.Term} type
   * @param {Array.<Object>}
   */
  buildTriplesForNode(baseURI, type, predicateList) {
    if (type) {
      this.addTypeTriple(baseURI, type)
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
        const bnode = rdf.blankNode()

        this.dataset.add(rdf.quad(baseURI, rdf.namedNode(predicate), bnode))
        const nestedValue = value[Object.keys(value)[0]]

        this.buildTriplesForNestedObject(bnode, nestedValue)
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
