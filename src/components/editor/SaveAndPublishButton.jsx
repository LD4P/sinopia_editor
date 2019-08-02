// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/lib/Button'
import { update } from 'actionCreators/resources'
import { rootResourceId, resourceHasChangesSinceLastSave } from 'selectors/resourceSelectors'
import { getCurrentUser } from 'authSelectors'
import { showGroupChooser } from 'actions/index'

const SaveAndPublishButton = (props) => {
  const save = () => {
    if (props.isSaved) {
      props.update(props.currentUser)
    } else {
      props.showGroupChooser(true)
    }
  }

  return (
    <Button id={ props.id } bsStyle="primary" bsSize="small" onClick={ save } disabled={ props.isDisabled }>
      Save & Publish
    </Button>
  )
}

SaveAndPublishButton.propTypes = {
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  update: PropTypes.func,
  showGroupChooser: PropTypes.func,
  isSaved: PropTypes.bool,
  currentUser: PropTypes.object,
}

const mapStateToProps = state => ({
  isSaved: !!rootResourceId(state),
  currentUser: getCurrentUser(state),
  isDisabled: !resourceHasChangesSinceLastSave(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({ update, showGroupChooser }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SaveAndPublishButton)
