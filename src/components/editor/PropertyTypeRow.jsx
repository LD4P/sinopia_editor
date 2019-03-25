// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import PropertyActionButtons from './PropertyActionButtons'
import { valueTemplateRefTest } from './PropertyTemplateOutline'
import shortid from 'shortid'

export class PropertyTypeRow extends Component {

  constructor (props) {
    super(props)
  }

  addButtons = () => {
    if (valueTemplateRefTest(this.props.propertyTemplate)) {
      return <PropertyActionButtons handleAddClick={this.props.handleAddClick}
        handleMintUri={this.props.handleMintUri} key={shortid.generate()}/>
    }
  }

  render() {
    return(<React.Fragment key={shortid.generate()}>
      <div className="row">
        <section className="col-sm-8">
        {this.props.propertyTemplate.propertyLabel}
        </section>
        <section className="col-sm-4">
          {this.addButtons()}
        </section>
      </div>
      { this.props.children }
    </React.Fragment>)
  }
}

PropertyTypeRow.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  handleAddClick: PropTypes.func,
  handleMintUri: PropTypes.func,
  propertyTemplate: PropTypes.object,
}

export default PropertyTypeRow;
