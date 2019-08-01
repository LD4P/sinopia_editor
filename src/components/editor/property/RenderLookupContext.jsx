// Copyright 2019 Stanford University see LICENSE for license
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class RenderLookupContext extends Component {
  // Discogs specific functions
  renderContext = (innerResult, authURI) => {
    switch (authURI) {
      case 'urn:discogs':
        return this.buildDiscogsContext(innerResult)
      default:
        return this.renderContextContent(innerResult, authURI)
    }
  }

    buildDiscogsContext = (innerResult) => {
      // const url = innerResult.uri
      const context = innerResult.context
      const imageUrl = context['Image URL'][0]
      let year = ''
      if (context.Year[0].length > 0) {
        year = `(${context.Year[0]})`
      }
      const recLabel = context['Record Labels'][0]
      const formats = context.Formats.toString()
      // const discogsType = context.Type[0]
      // const target = '_blank'
      const type = context.Type[0].charAt(0).toUpperCase() + context.Type[0].slice(1)
      return (
        <div className="row discogs-container">
          <div className="image-container col-md-2">
            <img alt="Result" className="discogs-image-style" src={imageUrl}/><br />
          </div>
          <div className="col-md-10 details-container">
            {innerResult.label} {year}<br />
            <b>Format: </b>{formats}<br />
            <b>Label: </b>{recLabel}<span className="type-span"><b>Type: </b>{type}</span>
          </div>
        </div>
      )
    }

  renderContextContent = (innerResult, authURI) => {
    const context = innerResult.context
    let contextContent = []
    const mainLabelProperty = ['authoritative label', 'preferred label']
    if (context) {
      if (authURI in authorityToContextOrderMap)
      { contextContent = this.generateOrderedContextView(authURI, context) }
      else
      { contextContent = this.generateDefaultContextView(context, mainLabelProperty) }
      const divClassName = `row discogs-container ${this.props.colorClassName}`
      return (<div className={divClassName}> <div className="context-label-dropdown details-container"> {innerResult.label} </div> {contextContent} </div>)
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
       const values = contextResult.values
       // const values = [contextResult.value] //hack for wikidata, to be removed later
       const innerDivKey = `c${index}`
       if (values.length) {
         return (<div className="details-container" key={innerDivKey}> <span className="context-field">{property}</span>: {values.join(', ')} </div>)
       }
     }
   })
   return contextContent
 }

 generateOrderedContextView = (authURI, context) => {
   // Map context to hash that allows for selection of specific properties
   const contextHash = context.reduce((map, obj) => (map[obj.property] = obj, map), {})
   const propertyOrder = authorityToContextOrderMap[authURI]
   const contextContent = propertyOrder.map((property, index) => {
     if (property in contextHash) {
       const values = contextHash[property].values
       const innerDivKey = `c${index}`
       if (values.length) {
         return (<div className="details-container" key={innerDivKey}> <span className="context-field">{property}</span>: {values.join(', ')} </div>)
       }
     }
   })
   return contextContent
 }

 render() {
   return this.renderContext(this.props.innerResult, this.props.authURI)
 }
}

const authorityToContextOrderMap = {
  'urn:ld4p:qa:names:person': ['Descriptor',
    'Birth date', 'Death date',
    'Affiliation', 'Field of Activity',
    'Occupation', 'Birth place', 'Death place', 'VIAF match', 'Variant label', 'Citation note', 'Citation source', 'Editorial note'],
  'urn:ld4p:qa:names:organization': ['Descriptor', 'Location', 'Field of Activity', 'Affiliation', 'Occupation', 'VIAF match', 'Variant label',
    'Citation note', 'Citation source', 'Editorial note'],
}

RenderLookupContext.propTypes = {
  innerResult: PropTypes.object,
  authLabel: PropTypes.string,
  authURI: PropTypes.string,
  colorClassName: PropTypes.string,
}


export default connect(null, null)(RenderLookupContext)
