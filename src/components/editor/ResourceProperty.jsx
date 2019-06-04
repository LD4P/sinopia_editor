// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import { refreshResourceTemplate } from '../../actions/index'
import { templateBoolean } from '../../Utilities'

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
            <PropertyActionButtons handleAddClick={this.props.handleAddClick(resourceTemplate)}
                                   reduxPath={this.props.reduxPath}
                                   addButtonDisabled={this.props.addButtonDisabled}
                                   key={shortid.generate()} />
          </section>
        </div>,
      )

      resourceTemplate.propertyTemplates.map((rtProperty) => {
        const keyId = shortid.generate()
        const newReduxPath = Object.assign([], this.props.reduxPath)

        newReduxPath.push(rtId)
        newReduxPath.push(rtProperty.propertyURI)
        const payload = { reduxPath: newReduxPath, property: rtProperty }

        this.props.initNewResourceTemplate(payload)
        const isAddDisabled = !templateBoolean(rtProperty.repeatable)

        jsx.push(
          <PropertyTemplateOutline key={keyId}
                                   propertyTemplate={rtProperty}
                                   reduxPath={newReduxPath}
                                   addButtonDisabled={isAddDisabled}
                                   initNewResourceTemplate={this.props.initNewResourceTemplate}
                                   resourceTemplate={resourceTemplate} />,
        )
      })
    })

    return jsx
  }

  render() {
    return (
      <div>
        { this.renderResourcePropertyJsx() }
      </div>
    )
  }
}

ResourceProperty.propTypes = {
  addButtonDisabled: PropTypes.bool,
  handleAddClick: PropTypes.func,
  initNewResourceTemplate: PropTypes.func,
  nestedResourceTemplates: PropTypes.array,
  propertyTemplate: PropTypes.object,
  reduxPath: PropTypes.array,
  rtReduxPath: PropTypes.object,
}
const mapDispatchToProps = dispatch => ({
  initNewResourceTemplate(rt_context) {
    dispatch(refreshResourceTemplate(rt_context))
  },
})

export default connect(null, mapDispatchToProps)(ResourceProperty)
