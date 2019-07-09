// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import PropertyPanel from './property/PropertyPanel'
import PropertyResourceTemplate from './property/PropertyResourceTemplate'
import PropertyComponent from './property/PropertyComponent'
import { removeAllContent, setItems, resourceTemplateLoaded } from 'actions/index'
// import { getResourceTemplate } from 'sinopiaServer'
import { isResourceWithValueTemplateRef, resourceToName } from 'Utilities'
import { getResourceTemplate, findNode } from 'selectors/resourceSelectors'
import store from 'store'

const _ = require('lodash')

// Renders the input form for the root ResourceTemplate
export class ResourceTemplateForm extends Component {
  constructor(props) {
    super(props)
    this.defaultValues()
    this.state = {
      templateError: false,
      templateErrors: [],
    }
  }

  componentDidMount() {
    // this.fulfillRTPromises(this.resourceTemplatePromise(this.joinedRTs()))
  }

  /*
   * For each fulfillled RT retrieval promise,
   *   - dispatch loaded template to redux to be put into store
   */
  // fulfillRTPromises = async (promiseAll) => {
  //   await promiseAll.then(async (rts) => {
  //     rts.map((fulfilledResourceTemplateRequest) => {
  //       // Add the resource template into the store
  //       store.dispatch(resourceTemplateLoaded(fulfilledResourceTemplateRequest.response.body))
  //     })
  //     this.setState({ templateError: false }) // Force a re-render
  //   }).catch((err) => {
  //     this.setState({ templateError: err })
  //   })
  // }

  /*
   *  templateRefs is an array of rt ids
   *
   *  returns a single promise:
   *    reject result if any of the desired rtIds gets a reject from getResourceTemplate
   *    resolves if ALL resource templates are retrieved from Sinopia Server (or from fixtures), returning array of every promise's result
   */
  // resourceTemplatePromise = async templateRefs => Promise.all(templateRefs.map(rtId => getResourceTemplate(rtId).catch((err) => {
  //   const joinedErrorUrls = [...this.state.templateErrors]
  //
  //   joinedErrorUrls.push(decodeURIComponent(resourceToName(err.url)))
  //   this.setState({ templateErrors: _.sortedUniq(joinedErrorUrls) })
  // })))

  // Returns an array of resource template ids from the valueTemplateRefs values in the propertyTemplates
  // joinedRTs = () => {
  //   let joined = []
  //
  //   this.props.propertyTemplates.map((pt) => {
  //     if (_.has(pt.valueConstraint, 'valueTemplateRefs')) {
  //       joined = joined.concat(pt.valueConstraint.valueTemplateRefs)
  //     }
  //   })
  //
  //   return joined
  // }

  resourceTemplateFields = (rtIds, property) => {
    const rtProperties = []

    if (rtIds === null || rtIds === undefined) {
      return rtProperties
    }
    rtIds.map((rtId, i) => {

      // const rt = getResourceTemplate(rtId)
      // if (rt !== undefined) { // It may not be loaded yet

      const resourceProperty = this.props.resourceProperties[property.propertyURI]
      if (!resourceProperty) {
        return
      }
      const key = Object.keys(resourceProperty).find((key) => {
        return _.first(Object.keys(resourceProperty[key])) === rtId
      })
      if (!key) {
        return
      }

      // Can be multiple, but assuming 1 for now
      const resourceTemplateId = _.first(Object.keys(resourceProperty[key]))
      const newReduxPath = [...this.props.reduxPath, property.propertyURI, key, resourceTemplateId]

      rtProperties.push(<PropertyResourceTemplate
        key={shortid.generate()}
        isRepeatable={property.repeatable}
        reduxPath={newReduxPath} />)
      if ((rtIds.length - i) > 1) {
        rtProperties.push(<hr key={i} />)
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
                if (! _.isEmpty(this.props.resourceProperties)) {
                  return (
                    <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.resourceTemplateId}>
                        {this.resourceTemplateFields(pt.valueConstraint.valueTemplateRefs, pt)}
                    </PropertyPanel>
                  )
                }
              }

              // <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.rtId}>
              //   <PropertyComponent index={index}
              //                      reduxPath={['resource', this.props.rtId]}
              //                      rtId={this.props.rtId}
              //                      propertyTemplate={pt} />
              // </PropertyPanel>

              const newReduxPath = [...this.props.reduxPath, pt.propertyURI]
              return (
                <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.resourceTemplateId}>
                  <PropertyComponent index={index}
                                     reduxPath={newReduxPath}
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
      There are missing resource templates required by resource template: <strong>{this.props.rtId}</strong>.
      <br />
      Please make sure all referenced templates in property template are uploaded first. Missing templates:
      <br />
      {this.state.templateErrors.join(', ')}
    </div>

    if (this.state.templateError) {
      return errMessage
    }

    if(!this.props.resourceProperties) {
      return null
    }
    return this.renderComponentForm()
  }
}

ResourceTemplateForm.propTypes = {
  resourceTemplateId: PropTypes.string.isRequired,
  handleMyItemsChange: PropTypes.func,
  handleRemoveAllContent: PropTypes.func,
  resourceTemplateMap: PropTypes.object,
  propertyTemplates: PropTypes.array,
  resourceProperties: PropTypes.object,
}

const mapStateToProps = (state, ourProps) => {
  const reduxPath = [...ourProps.reduxPath]
  const resourceTemplateId = reduxPath.pop()
  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)
  const resourceProperties = findNode(state.selectorReducer, ourProps.reduxPath)
  return {
    resourceTemplateId,
    propertyTemplates: resourceTemplate?.propertyTemplates || [],
    resourceProperties,
  }
}

const mapDispatchToProps = dispatch => ({
  handleMyItemsChange(userInput) {
    dispatch(setItems(userInput))
  },
  handleRemoveAllContent(id) {
    dispatch(removeAllContent(id))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceTemplateForm)
