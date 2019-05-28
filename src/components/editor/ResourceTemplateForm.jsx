// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import PropertyPanel from './PropertyPanel'
import PropertyResourceTemplate from './PropertyResourceTemplate'
import PropertyComponent from './PropertyComponent'
import { getLD, setItems, removeAllContent } from '../../actions/index'
import { getResourceTemplate } from '../../sinopiaServer'
import { isResourceWithValueTemplateRef, resourceToName } from "../../Utilities";
const N3 = require('n3')
const { DataFactory } = N3
const { blankNode } = DataFactory
const _ = require('lodash')

// renders the input form for a ResourceTemplate
export class ResourceTemplateForm extends Component {
  constructor(props) {
    super(props)
    this.defaultValues()
    this.state = {
      showRdf: false,
      rdfOuterSubject: this.makeSubject(),
      inputs: {},
      nestedResourceTemplates: [],
      ptRtIds: [],
      templateError: false,
      templateErrors: [],
      componentForm: <div/>
    }
  }

  componentDidMount() {
    this.fulfillRTPromises(this.resourceTemplatePromise(this.joinedRTs())).then(() => {
      this.setState({
        componentForm: (
          this.renderComponentForm()
        )
      })
    })
  }

  fulfillRTPromises = async (promiseAll) => {
    await promiseAll.then(async (rts) => {
      rts.map(rt => {
        const joinedRts = [...this.state.nestedResourceTemplates]
        joinedRts.push(rt.response.body)
        this.setState({nestedResourceTemplates: joinedRts})
      })
    }).catch((err) => {
      this.setState({templateError: err})
    })
  }

  resourceTemplateFields = (rtIds, propUri) => {
    const rtProperties = []
    if (rtIds === null || rtIds === undefined) {
      return rtProperties
    }
    rtIds.map((rtId, i) => {
      const rt = this.rtForPt(rtId)
      if (rt !== undefined) {
        const keyId = shortid.generate()
        const reduxPath = [this.props.rtId, propUri, keyId, rtId]
        rtProperties.push(<PropertyResourceTemplate
          key={keyId}
          resourceTemplate={rt}
          reduxPath={reduxPath} />)
        if ((rtIds.length - i) > 1) {
          rtProperties.push(<hr key={i} />)
        }
      } else {
        this.setState({templateError: true})
      }
    })
    return rtProperties
  }

  resourceTemplatePromise = async (templateRefs) => {
    return Promise.all(templateRefs.map(rtId =>
      getResourceTemplate(rtId).catch(err => {
        const joinedErrorUrls = [...this.state.templateErrors]
        joinedErrorUrls.push(decodeURIComponent(resourceToName(err.url)))
        this.setState({templateErrors: _.sortedUniq(joinedErrorUrls)})
      })
    ))
  }

  joinedRTs = () => {
    let joined = []
    this.props.propertyTemplates.map(pt => {
      if(_.has(pt.valueConstraint, 'valueTemplateRefs')) {
        joined = joined.concat(pt.valueConstraint.valueTemplateRefs)
      }
    })
    return joined
  }

  defaultValues = () => {
    this.props.propertyTemplates.map( (pt) =>{
      if (pt.mandatory == undefined) pt.mandatory = "true"
      if (pt.repeatable == undefined) pt.repeatable = "false"
      if (pt.editable == undefined) pt.editable = "true"
    })
  }

  makeSubject = () => {
    // in the future we will return a blank node or an IRI (using namedNode in the DataFactory ^^)...
    // return namedNode('http://example.com')
    return blankNode()
  }

  rtForPt = (rtId) => {
    return _.find(this.state.nestedResourceTemplates, ['id', rtId])
  }

  renderComponentForm = () => (
    <div>
      <form>
        <div className='ResourceTemplateForm row'>
          { this.props.propertyTemplates.map((pt, index) => {

              if (isResourceWithValueTemplateRef(pt)) {
                return (
                  <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.rtId}>
                    {this.resourceTemplateFields(pt.valueConstraint.valueTemplateRefs, pt.propertyURI)}
                  </PropertyPanel>
                )
              } else {
                return (
                  <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.rtId}>
                    <PropertyComponent index={index} rtId={this.props.rtId} propertyTemplate={pt} />
                  </PropertyPanel>
                )
              }
            }
          )
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
      {this.state.templateErrors.join(", ")}
    </div>;

    if (this.state.templateError) {
      return errMessage
    } else {
      return this.state.componentForm
    }
  }
}

ResourceTemplateForm.propTypes = {
  literals: PropTypes.oneOfType( [PropTypes.array, PropTypes.object] ),
  lookups: PropTypes.oneOfType( [PropTypes.array, PropTypes.object] ),
  handleGenerateLD: PropTypes.func,
  propertyTemplates: PropTypes.arrayOf( PropTypes.object ).isRequired,
  resourceTemplate: PropTypes.object.isRequired,
  rtId: PropTypes.string,
  handleMyItemsChange: PropTypes.func,
  handleRemoveAllContent: PropTypes.func
}

const mapStateToProps = ( state ) => {
  return {
    literals: state.literal,
    lookups: state.lookups
  }
}

const mapDispatchToProps = dispatch => ( {
  handleMyItemsChange( user_input ) {
    dispatch( setItems( user_input ) )
  },
  handleRemoveAllContent( id ) {
    dispatch( removeAllContent( id ) )
  },
  handleGenerateLD( inputs ) {
    dispatch( getLD( inputs ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( ResourceTemplateForm)
