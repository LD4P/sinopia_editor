// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class PropertyResourceTemplate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      collapse: true
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <section className="col-md-10">
            <h4>{this.props.resourceTemplate.resourceLabel}</h4>
          </section>
          <section className="col-md-2">
            <button className="btn btn-default">Add</button>
          </section>
        </div>
        <div className="row collapse">
          
        </div>
      </div>
    )
  }
}

// PropertyResourceTemplate.propTypes = {
//   id: PropTypes.number,
//   rtId: PropTypes.string
// }

const mapStateToProps = (state, props) => {
  return {

  }
}

const mapDispatchToProps = dispatch => ({

})

export default PropertyResourceTemplate;
// export default connect(mapStateToProps, mapDispatchToProps)(PropertyResourceTemplate)
