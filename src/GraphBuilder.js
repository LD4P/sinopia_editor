// Copyright 2019 Stanford University see LICENSE for license

const rdf = require('rdf-ext')

/**
 * Builds RDF graphs from the Redux state
 */
export default class GraphBuilder {
  /**
   * @param {Object} state the Redux state
   */
  constructor(state) {
    this.state = state
  }

  /**
   * @return {Graph} an RDF graph that represents the data in the state
   */
  get graph() {
    const dataset = rdf.dataset()

    for (const key in this.state) {
      /*
       * TODO: this is just a simple statement insert to show this works. We'll
       *       want to add more here.
       */
      dataset.add(rdf.quad(rdf.namedNode(''),
        rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        rdf.literal(key)))
    }
    return dataset
  }
}
