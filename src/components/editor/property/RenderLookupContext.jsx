// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  getContextValues,
  getContextValue,
} from "utilities/QuestioningAuthority"

class RenderLookupContext extends Component {
  // Discogs specific functions
  renderContext = (innerResult, authURI) => {
    if (authURI.startsWith("urn:discogs"))
      return this.buildDiscogsContext(innerResult)

    return this.renderContextContent(innerResult, authURI)
  }

  buildDiscogsContext = (innerResult) => {
    // const url = innerResult.uri
    const contexts = innerResult.context
    const imageUrl = getContextValue(contexts, "Image URL")
    const yearValue = getContextValue(contexts, "Year")
    const year = yearValue ? `(${yearValue})` : ""
    const recLabel = getContextValue(contexts, "Record Labels")
    const formats = getContextValues(contexts, "Formats").join(", ")
    const typeValue = getContextValue(contexts, "Type")
    const type = typeValue.charAt(0).toUpperCase() + typeValue.slice(1)
    return (
      <div className="context-container row">
        <div className="image-container col-md-2">
          <img alt="Result" className="discogs-image" src={imageUrl} />
          <br />
        </div>
        <div className="col-md-10">
          <div className="context-heading details-container">
            {innerResult.label} {year}
          </div>
          <div className="details-container">
            <span className="context-field">Format:</span> {formats}
          </div>
          <div className="details-container">
            <span className="context-field">Label:</span> {recLabel}
          </div>
          <div className="details-container">
            <span className="context-field">Type:</span> {type}
          </div>
        </div>
      </div>
    )
  }

  renderContextContent = (innerResult, authURI) => {
    const context = innerResult.context
    let contextContent = []
    const mainLabelProperty = ["authoritative label", "preferred label"]
    if (context) {
      if (authURI in authorityToContextOrderMap) {
        contextContent = this.generateOrderedContextView(authURI, context)
      } else {
        contextContent = this.generateDefaultContextView(
          context,
          mainLabelProperty
        )
      }
      return (
        <div className="context-container">
          <div className="context-heading details-container">
            {" "}
            {innerResult.label}{" "}
          </div>{" "}
          {contextContent}
        </div>
      )
    }
    return innerResult.label
  }

  /*
   *  Default rendering where on order is given, in this case the context will just be output in
   * its entirety.
   * mainLabelProperty: the array that holds the labels, we exclude that so as not to repeat it
   * this could be further generalized to a set of properties to be excluded from display if need be
   */
  generateDefaultContextView = (context, mainLabelProperty) => {
    const contextContent = context.map((contextResult, index) => {
      const property = contextResult.property
      // if property is one of the possible main label values don't show it
      if (mainLabelProperty.indexOf(property.toLowerCase()) < 0) {
        const innerDivKey = `c${index}`
        return this.displayValues(contextResult.values, innerDivKey, property)
      }
    })
    return contextContent
  }

  generateOrderedContextView = (authURI, context) => {
    // Map context to hash that allows for selection of specific properties
    const contextHash = context.reduce(
      (map, obj) => ((map[obj.property] = obj), map),
      {}
    )
    const propertyOrder = authorityToContextOrderMap[authURI]
    const contextContent = propertyOrder.map((property, index) => {
      if (property in contextHash) {
        const innerDivKey = `c${index}`
        return this.displayValues(
          contextHash[property].values,
          innerDivKey,
          property
        )
      }
    })
    return contextContent
  }

  displayValues = (values, innerDivKey, property) => {
    const valuesDisplay = this.generateValuesView(values)
    if (valuesDisplay.length) {
      return (
        <div className="details-container" key={innerDivKey}>
          {" "}
          <span className="context-field">{property}</span>: {valuesDisplay}{" "}
        </div>
      )
    }
  }

  // Handle both string and object value
  generateValuesView = (values) => {
    const valuesDisplay = values.map((value) => {
      if (typeof value === "object") {
        if ("label" in value) return value.label
        if ("uri" in value) return value.uri
        return JSON.stringify(value)
      }
      return value
    })
    return valuesDisplay.join(", ")
  }

  render() {
    return this.renderContext(this.props.innerResult, this.props.authURI)
  }
}

const authorityToContextOrderMap = {
  "urn:ld4p:qa:names:person": [
    "Descriptor",
    "Birth date",
    "Death date",
    "Affiliation",
    "Field of Activity",
    "Occupation",
    "Birth place",
    "Death place",
    "VIAF match",
    "Variant label",
    "Citation note",
    "Citation source",
    "Editorial note",
  ],
  "urn:ld4p:qa:names:organization": [
    "Descriptor",
    "Location",
    "Field of Activity",
    "Affiliation",
    "Occupation",
    "VIAF match",
    "Variant label",
    "Citation note",
    "Citation source",
    "Editorial note",
  ],
}

RenderLookupContext.propTypes = {
  innerResult: PropTypes.object,
  authLabel: PropTypes.string,
  authURI: PropTypes.string,
}

export default RenderLookupContext
