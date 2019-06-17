// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import PropertyPanel from './property/PropertyPanel'
import PropertyResourceTemplate from './property/PropertyResourceTemplate'
import PropertyComponent from './property/PropertyComponent'
import { removeAllContent, setItems, resourceTemplateLoaded } from 'actions/index'
import { getResourceTemplate } from 'sinopiaServer'
import { isResourceWithValueTemplateRef, resourceToName } from 'Utilities'
import store from 'store'

const _ = require('lodash')

// Renders the input form for a ResourceTemplate
export class ResourceTemplateForm extends Component {
  constructor(props) {
    super(props)
    this.defaultValues()
    this.state = {
      inputs: {},
      nestedResourceTemplates: [],
      ptRtIds: [],
      templateError: false,
      templateErrors: [],
    }
  }

  componentDidMount() {
    this.fulfillRTPromises(this.resourceTemplatePromise(this.joinedRTs()))
  }

  /*
   * For each fulfillled RT retrieval promise,
   *   - dispatch loaded template to redux to be put into store
   *   - add retrieved RT onto "nestedResourceTemplates" array in state
   */
  fulfillRTPromises = async (promiseAll) => {
    await promiseAll.then(async (rts) => {
      const joinedRts = [...this.state.nestedResourceTemplates]

      rts.map((fulfilledResourceTemplateRequest) => {
        joinedRts.push(fulfilledResourceTemplateRequest.response.body)
        // Add the resource template into the store
        store.dispatch(resourceTemplateLoaded(fulfilledResourceTemplateRequest.response.body))
      })
      this.setState({ nestedResourceTemplates: joinedRts })
    }).catch((err) => {
      this.setState({ templateError: err })
    })
  }

  /*
   *  templateRefs is an array of rt ids
   *
   *  returns a single promise:
   *    reject result if any of the desired rtIds gets a reject from getResourceTemplate
   *    resolves if ALL resource templates are retrieved from Sinopia Server (or from spoofing), returning array of every promise's result
   */
  resourceTemplatePromise = async templateRefs => Promise.all(templateRefs.map(rtId => getResourceTemplate(rtId).catch((err) => {
    const joinedErrorUrls = [...this.state.templateErrors]

    joinedErrorUrls.push(decodeURIComponent(resourceToName(err.url)))
    this.setState({ templateErrors: _.sortedUniq(joinedErrorUrls) })
  })))

  // Returns an array of resource template ids from the valueTemplateRefs values in the propertyTemplates
  joinedRTs = () => {
    let joined = []

    this.props.propertyTemplates.map((pt) => {
      if (_.has(pt.valueConstraint, 'valueTemplateRefs')) {
        joined = joined.concat(pt.valueConstraint.valueTemplateRefs)
      }
    })

    return joined
  }

  resourceTemplateFields = (rtIds, property) => {
    const rtProperties = []

    if (rtIds === null || rtIds === undefined) {
      return rtProperties
    }
    rtIds.map((rtId, i) => {
      const rt = this.rtForPt(rtId)

      if (rt !== undefined) { // It may not be loaded yet
        const keyId = shortid.generate()
        const reduxPath = ['resource', this.props.rtId, property.propertyURI, keyId, rtId]

        rtProperties.push(<PropertyResourceTemplate
          key={keyId}
          isRepeatable={property.repeatable}
          resourceTemplate={rt}
          reduxPath={reduxPath} />)
        if ((rtIds.length - i) > 1) {
          rtProperties.push(<hr key={i} />)
        }
      }
    })

    return rtProperties
  }

  defaultValues = () => {
    this.props.propertyTemplates.map((pt) => {
      if (pt.mandatory === undefined) pt.mandatory = 'true'
      if (pt.repeatable === undefined) pt.repeatable = 'false'
      if (pt.editable === undefined) pt.editable = 'true'
    })
  }

  rtForPt = (rtId) => {
    if (this.props.resourceTemplateMap) {
      return this.props.resourceTemplateMap[rtId]
    }
    return {}
  }

  renderComponentForm = () => (
    <div>
      <form>
        <div className="ResourceTemplateForm row">
          {
            this.props.propertyTemplates.map((pt, index) => {
              if (isResourceWithValueTemplateRef(pt)) {
                return (
                  <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.rtId}>
                    {this.resourceTemplateFields(pt.valueConstraint.valueTemplateRefs, pt)}
                  </PropertyPanel>
                )
              }

              return (
                <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.rtId}>
                  <PropertyComponent index={index}
                                     reduxPath={['resource', this.props.rtId]}
                                     rtId={this.props.rtId}
                                     propertyTemplate={pt} />
                </PropertyPanel>
              )
            })
          }
        </div>
      </form>
    </div>
  )

  render() {
    const errMessage = <div className="alert alert-warning">
      There are missing resource templates required by resource template: <strong>{this.props.resourceTemplate.resourceURI}</strong>.
      <br />
      Please make sure all referenced templates in property template are uploaded first. Missing templates:
      <br />
      {this.state.templateErrors.join(', ')}
    </div>

    if (this.state.templateError) {
      return errMessage
    }

    return this.renderComponentForm()
  }
}

ResourceTemplateForm.propTypes = {
  literals: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  lookups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  propertyTemplates: PropTypes.arrayOf(PropTypes.object).isRequired,
  resourceTemplate: PropTypes.object.isRequired,
  rtId: PropTypes.string,
  handleMyItemsChange: PropTypes.func,
  handleRemoveAllContent: PropTypes.func,
  resourceTemplateMap: PropTypes.object,
}

const mapStateToProps = state => ({
  literals: state.literal,
  lookups: state.lookups,
  resourceTemplateMap: state.selectorReducer.entities.resourceTemplates,
})

const mapDispatchToProps = dispatch => ({
  handleMyItemsChange(userInput) {
    dispatch(setItems(userInput))
  },
  handleRemoveAllContent(id) {
    dispatch(removeAllContent(id))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceTemplateForm)
