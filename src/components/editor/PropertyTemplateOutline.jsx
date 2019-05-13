// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import { connect } from 'react-redux'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import OutlineHeader from './OutlineHeader'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTypeRow from './PropertyTypeRow'
import RequiredSuperscript from './RequiredSuperscript'
import { refreshResourceTemplate } from '../../actions/index'
import { getResourceTemplate } from '../../sinopiaServer'
import lookupConfig from '../../../static/spoofedFilesFromServer/fromSinopiaServer/lookupConfig.json'
import PropTypes from 'prop-types'
import shortid from 'shortid'
const _ = require('lodash')

export const hasValueTemplateRef = (property) => {
  return (property.valueConstraint &&
          property.valueConstraint.valueTemplateRefs &&
          property.valueConstraint.valueTemplateRefs.length > 0)
}

export const getLookupConfigForTemplateUri = (templateUri) => {
  let returnConfigItem
  lookupConfig.forEach((configItem) => {
    if (configItem.uri === templateUri) {
      returnConfigItem = configItem
    }
  })
  return {value: returnConfigItem}
}

//This method is used for input list loc below, with just one lookup config passed back
// in {value : configItem } format
export const getLookupConfigItem = (property) => {
  const templateUri = property.valueConstraint.useValuesFrom[0]
  return getLookupConfigForTemplateUri(templateUri)
}

//More than one value possible so this returns all the lookup configs associated with property
export const getLookupConfigItems = (property) => {
  const templateUris = property.valueConstraint.useValuesFrom
  const templateConfigItems = []
  templateUris.forEach(templateUri => {
    const configItem = getLookupConfigForTemplateUri(templateUri)
    //TODO: Handle when this is undefined?
    templateConfigItems.push(configItem)
  })
  return templateConfigItems
}

export class PropertyTemplateOutline extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true,
      output: [],
      nestedResourceTemplates: []
    }
  }

  /**
   * @private
   */
  fulfillRTPromises = async (promiseAll) => {
    await promiseAll.then(rts => {
      rts.map(rt => {
        this.setState({tempState: rt.response.body})
        const joinedRts = this.state.nestedResourceTemplates.slice(0)
        joinedRts.push(this.state.tempState)
        this.setState({nestedResourceTemplates: joinedRts})
      })
    }).catch(() => {})
  }

  /**
   * @private
   */
  resourceTemplatePromises = (templateRefs) => {
    return Promise.all(templateRefs.map(rtId =>
      getResourceTemplate(rtId)
    ))
  }

  handleAddClick = (event) => {
    event.preventDefault()
    if (this.props.handleAddClick !== undefined) {
      this.props.handleAddClick(event)
    }
  }

  handleMintUri = (event) => {
    event.preventDefault()
    if (this.props.handleMintUri !== undefined) {
      this.props.handleMintUri(event)
    }
  }

  /**
   * returns jsx to render for passed property
   * @private
   */
  propertyComponentJsx = (property) => {
    const rtReduxPath = Object.assign([], this.props.reduxPath)
    let jsx, key, lookupConfigItem

    switch (property.type) {
      case "literal":
        if (rtReduxPath[rtReduxPath.length - 1] !== property.propertyURI) {
          rtReduxPath.push(property.propertyURI)
        }
        key = shortid.generate()
        jsx = <InputLiteral id={key}
                              propertyTemplate={property}
                              key={key}
                              reduxPath={rtReduxPath}
                              rtId={property.rtId} />
        break
      case "lookup":
        lookupConfigItem = getLookupConfigItems(property)
        jsx = <InputLookupQA propertyTemplate={property}
                               lookupConfig={lookupConfigItem}
                               rtId = {property.rtId} />
        break
      case "resource":
        jsx = this.resourcePropertyJsx(property, rtReduxPath)
    }
    return jsx
  }

  /**
   * returns jsx to render for property of type resource
   * @private
   */
  resourcePropertyJsx = (property, rtReduxPath) => {
    if (hasValueTemplateRef(property)){
      const jsx = []
      property.valueConstraint.valueTemplateRefs.map((rtId) => {
        const resourceTemplate = _.find(this.state.nestedResourceTemplates, ['id', rtId])
        jsx.push(<div className="row" key={shortid.generate()}>
            <section className="col-sm-8">
              <h5>{resourceTemplate.resourceLabel}</h5>
            </section>
            <section className="col-sm-4">
              <PropertyActionButtons handleAddClick={this.handleAddClick}
                                     handleMintUri={this.handleMintUri} key={shortid.generate()} />
            </section>
          </div>)
        resourceTemplate.propertyTemplates.map((rtProperty) => {
          const keyId = shortid.generate()
          const newReduxPath = Object.assign([], rtReduxPath)
          newReduxPath.push(rtId)
          newReduxPath.push(rtProperty.propertyURI)
          const payload = { reduxPath: newReduxPath, property: rtProperty }
          this.props.initNewResourceTemplate(payload)
          jsx.push(<PropertyTemplateOutline key={keyId}
                                              propertyTemplate={rtProperty}
                                              reduxPath={newReduxPath}
                                              initNewResourceTemplate={this.props.initNewResourceTemplate}
                                              resourceTemplate={resourceTemplate} />)
        })
      })
      return jsx
    } else {
      // TODO: remove this case
      // if no valueTemplateRef, assume it is a confused propertyTemplate intended to be of type lookup
      // NOTE: this case is due to orig LC resourceTemplates;  sinopia schemas v0.0.9 and up do NOT allow this
      return <InputListLOC propertyTemplate = {property}
                            lookupConfig = {getLookupConfigItem(property)}
                            rtId = {property.rtId} />
    }
  }

  /**
  * expanded vs collapsed property outline
  * @private
  */
  handleClick = (property) => (event) => {
    event.preventDefault()
    let newOutput = this.state.output
    const templateRefList = hasValueTemplateRef(property) ? property.valueConstraint.valueTemplateRefs : []
    this.fulfillRTPromises(this.resourceTemplatePromises(templateRefList))
      .then(() => {
        const propertyJsx = this.propertyComponentJsx(property)
        let existingJsx
        newOutput.forEach((propertyJsx) => {
          if (this.props.propertyTemplate.propertyURI === propertyJsx.props.propertyTemplate.propertyURI) {
            existingJsx = propertyJsx
            return
          }
        })
        if (existingJsx === undefined) {
          newOutput.push(<PropertyTypeRow
            key={shortid.generate()}
            handleAddClick={this.props.handleAddClick}
            handleMintUri={this.props.handleMintUri}
            propertyTemplate={property}>
            {propertyJsx}
          </PropertyTypeRow>)
        }
        this.setState({
          collapsed: !this.state.collapsed,
          output: newOutput
        })
    })
  }

  /**
   * @private
   */
  isRequired = (property) => {
    if (property.mandatory === "true") {
      return <RequiredSuperscript />
    }
  }

  /**
   * @private
   */
  outlinerClasses = () => {
    let classNames = "rOutline-property"
    if (this.state.collapsed) { classNames += " collapse"}
    return classNames
  }

  render() {
    return(<div className="rtOutline" key={shortid.generate()}>
      <OutlineHeader label={this.props.propertyTemplate.propertyLabel}
                     collapsed={this.state.collapsed}
                     key={shortid.generate()}
                     isRequired={this.isRequired(this.props.propertyTemplate)}
                     handleCollapsed={this.handleClick(this.props.propertyTemplate)} />
      <div className={this.outlinerClasses()}>
        {this.state.output}
      </div>
    </div>)
  }
}

PropertyTemplateOutline.propTypes = {
  handleAddClick: PropTypes.func,
  handleMintUri: PropTypes.func,
  handleCollapsed: PropTypes.func,
  initNewResourceTemplate: PropTypes.func,
  isRequired: PropTypes.func,
  propertyTemplate: PropTypes.object,
  reduxPath: PropTypes.array,
  rtId: PropTypes.string
}

const mapDispatchToProps = dispatch => ({
  initNewResourceTemplate(rt_context) {
    dispatch(refreshResourceTemplate(rt_context))
  }
})

export default connect(null, mapDispatchToProps)(PropertyTemplateOutline)
