// Copyright 2019 Stanford University see LICENSE for license
import React, { Component } from 'react'
import {
  Menu, MenuItem, Typeahead, asyncContainer, Token,
} from 'react-bootstrap-typeahead'
import { getOptionLabel } from 'react-bootstrap-typeahead/lib/utils'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import { connect } from 'react-redux'
import {
  itemsForProperty, getDisplayValidations, getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'
import { changeSelections } from 'actions/index'
import { getLookupConfigItems, isValidURI } from 'Utilities'

class RenderLookupContext extends Component {
  constructor(props) {
    super(props)
  }


  // Discogs specific functions
  // This relies on auth label but would be better dependent on authority URI
  renderContext = (innerResult, authLabel) => {
    switch (authLabel) {
      case 'Discogs':
        return this.buildDiscogsContext(innerResult)
      default:
        return innerResult.label
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

    render() {
      return this.renderContext(this.props.innerResult, this.props.authLabel)
    }
}

RenderLookupContext.propTypes = {
  innerResult: PropTypes.object,
  authLabel: PropTypes.string,
}


export default connect(null, null)(RenderLookupContext)
