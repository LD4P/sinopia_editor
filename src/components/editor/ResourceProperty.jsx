// Copyright 2019 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import { refreshResourceTemplate } from '../../actions/index'
import PropTypes from 'prop-types'
import shortid from 'shortid'
const _ = require('lodash')

export class ResourceProperty extends Component {
  constructor(props) {
    super(props)
  }

  renderResourcePropertyJsx = () => {
    const jsx = []

    this.props.propertyTemplate.valueConstraint.valueTemplateRefs.map((rtId) => {
      const resourceTemplate = _.find(this.props.nestedResourceTemplates, ['id', rtId])

      jsx.push(
        <div className="row" key={shortid.generate()}>
          <section className="col-sm-8">
            <h5>{resourceTemplate.resourceLabel}</h5>
          </section>
          <section className="col-sm-4">
            <PropertyActionButtons handleAddClick={this.props.handleAddClick}
                                   handleMintUri={this.props.handleMintUri} key={shortid.generate()} />
          </section>
        </div>
      )

      resourceTemplate.propertyTemplates.map((rtProperty) => {
        const keyId = shortid.generate()
        const newReduxPath = Object.assign([], this.props.reduxPath)
        newReduxPath.push(rtId)
        newReduxPath.push(rtProperty.propertyURI)
        const payload = { reduxPath: newReduxPath, property: rtProperty }
        this.props.initNewResourceTemplate(payload)

        jsx.push(
          <PropertyTemplateOutline key={keyId}
                                   propertyTemplate={rtProperty}
                                   reduxPath={newReduxPath}
                                   initNewResourceTemplate={this.props.initNewResourceTemplate}
                                   resourceTemplate={resourceTemplate} />
        )
      })
    })

    return jsx
  }

  render() {
    return(
      <div>
        {this.renderResourcePropertyJsx()}
      </div>
    )
  }
}

ResourceProperty.propTypes = {
  handleAddClick: PropTypes.func,
  handleMintUri: PropTypes.func,
  initNewResourceTemplate: PropTypes.func,
  nestedResourceTemplates: PropTypes.array,
  propertyTemplate: PropTypes.object,
  reduxPath: PropTypes.array,
  rtReduxPath: PropTypes.object
}
const mapDispatchToProps = dispatch => ({
  initNewResourceTemplate(rt_context) {
    dispatch(refreshResourceTemplate(rt_context))
  }
})

export default connect(null, mapDispatchToProps)(ResourceProperty)