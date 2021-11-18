// Copyright 2019 Stanford University see LICENSE for license

import rdf from "rdf-ext"
import _ from "lodash"

/**
 * Builds RDF graphs for a full resource
 */
export default class GraphBuilder {
  /**
   * @param {Object} resource to be converted to graph
   */
  constructor(resource) {
    this.resource = resource
    this.dataset = rdf.dataset()
  }

  /**
   * @return {Dataset} an RDF graph that represents the data in the state
   */
  get graph() {
    if (this.resource) {
      const resourceTerm = rdf.namedNode(this.resource.uri || "")
      this.addGeneratedByTriple(resourceTerm, this.resource.subjectTemplate.id)
      this.buildSubject(this.resource, resourceTerm)
    }
    return this.dataset
  }

  buildSubject(subject, subjectTerm) {
    this.dataset.add(
      rdf.quad(
        subjectTerm,
        rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        rdf.namedNode(subject.subjectTemplate.class)
      )
    )
    subject.properties.forEach((property) =>
      this.buildProperty(property, subjectTerm)
    )
  }

  buildProperty(property, subjectTerm) {
    if (!this.shouldAddProperty(property)) return

    if (property.propertyTemplate?.ordered) {
      const values = property.values.filter((value) =>
        this.checkValueHasValue(value)
      )
      if (_.isEmpty(values)) return

      let nextNode = rdf.blankNode()
      this.dataset.add(
        rdf.quad(
          subjectTerm,
          // For ordered, get propertyUri from property.
          rdf.namedNode(property.propertyUri),
          nextNode
        )
      )
      values.forEach((value, index) => {
        const thisNode = nextNode
        nextNode =
          index !== values.length - 1
            ? rdf.blankNode()
            : rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#nil")
        this.dataset.add(
          rdf.quad(
            thisNode,
            rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"),
            nextNode
          )
        )
        this.buildValue(
          value,
          thisNode,
          rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#first"),
          property
        )
      })
    } else {
      const values = property.values.filter((value) =>
        this.checkValueHasValue(value)
      )

      values.forEach((value) =>
        this.buildValue(
          value,
          subjectTerm,
          rdf.namedNode(value.propertyUri),
          property
        )
      )
    }
  }

  buildValue(value, subjectTerm, propertyTerm, property) {
    // Can't use type to distinguish between uri and literal because inputlookups allow providing a literal for a uri.
    if (property.propertyTemplate.type === "resource") {
      this.buildValueSubject(value, subjectTerm, propertyTerm)
    } else if (value.uri) {
      this.buildUriValue(value, subjectTerm, propertyTerm)
    } else {
      this.buildLiteralValue(value, subjectTerm, propertyTerm)
    }
  }

  buildLiteralValue(value, subjectTerm, propertyTerm) {
    // TODO: ?. accessor for 2 tests that are hella annoying to fix
    const validationDataType =
      value.property?.propertyTemplate?.validationDataType
    let valueTerm
    if (validationDataType) {
      const namedNode = rdf.namedNode(validationDataType)
      valueTerm = rdf.literal(value.literal, namedNode)
    } else {
      valueTerm = rdf.literal(value.literal, value.lang)
    }
    this.dataset.add(rdf.quad(subjectTerm, propertyTerm, valueTerm))
  }

  buildUriValue(value, subjectTerm, propertyTerm) {
    const valueTerm = rdf.namedNode(value.uri)
    this.dataset.add(rdf.quad(subjectTerm, propertyTerm, valueTerm))
    if (value.label) {
      this.dataset.add(
        rdf.quad(
          valueTerm,
          rdf.namedNode("http://www.w3.org/2000/01/rdf-schema#label"),
          rdf.literal(value.label, value.lang)
        )
      )
    }
  }

  buildValueSubject(value, subjectTerm, propertyTerm) {
    if (!this.shouldAddValueSubject(value)) return
    if (value.valueSubject.subjectTemplate.suppressible) {
      this.buildSuppressedValueSubject(value, subjectTerm, propertyTerm)
    } else {
      const bnode = rdf.blankNode()
      this.dataset.add(rdf.quad(subjectTerm, propertyTerm, bnode))
      this.buildSubject(value.valueSubject, bnode)
    }
  }

  buildSuppressedValueSubject(value, subjectTerm, propertyTerm) {
    const uriValues = value.valueSubject.properties[0].values.filter(
      (value) => value.uri
    )
    uriValues.forEach((uriValue) => {
      this.buildUriValue(uriValue, subjectTerm, propertyTerm)
      this.dataset.add(
        rdf.quad(
          rdf.namedNode(uriValue.uri),
          rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          rdf.namedNode(value.valueSubject.subjectTemplate.class)
        )
      )
    })
    const literalValues = value.valueSubject.properties[0].values.filter(
      (value) => value.literal
    )
    if (!_.isEmpty(literalValues)) {
      const bnode = rdf.blankNode()
      this.dataset.add(rdf.quad(subjectTerm, propertyTerm, bnode))
      this.dataset.add(
        rdf.quad(
          bnode,
          rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          rdf.namedNode(value.valueSubject.subjectTemplate.class)
        )
      )
      literalValues.forEach((literalValue) => {
        this.buildLiteralValue(
          literalValue,
          bnode,
          rdf.namedNode(literalValue.propertyUri)
        )
      })
    }
  }

  // Add only if there is actually a value somewhere.
  shouldAddValueSubject(value) {
    return this.checkSubjectHasValue(value.valueSubject)
  }

  shouldAddProperty(property) {
    return this.checkPropertyHasValue(property)
  }

  checkSubjectHasValue(subject) {
    return subject.properties.some((property) =>
      this.checkPropertyHasValue(property)
    )
  }

  checkPropertyHasValue(property) {
    if (_.isEmpty(property.values)) return false
    return property.values.some((value) => this.checkValueHasValue(value))
  }

  checkValueHasValue(value) {
    if (value.literal || value.uri) return true
    if (value.valueSubject) return this.checkSubjectHasValue(value.valueSubject)
    return false
  }

  /**
   * Adds the assertion that points at the resourceTemplate we used to generate this node
   * @param {rdf.Term} baseURI
   * @param {string} resourceTemplateId the identifier of the resource template
   */
  addGeneratedByTriple(baseURI, resourceTemplateId) {
    this.dataset.add(
      rdf.quad(
        baseURI,
        rdf.namedNode("http://sinopia.io/vocabulary/hasResourceTemplate"),
        rdf.literal(resourceTemplateId)
      )
    )
  }
}
