// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/lib/Button'
import { update } from 'actionCreators/resources'
import { rootResourceId, resourceHasChangesSinceLastSave } from 'selectors/resourceSelectors'
import { getCurrentUser } from 'authSelectors'
import { showGroupChooser } from 'actions/index'

const SaveAndPublishButton = props => (
  <Button id={ props.id } bsStyle="primary" bsSize="small" onClick={ props.save(props.isSaved, props.currentUser) } disabled={ props.isDisabled }>
        Save & Publish
  </Button>
)

SaveAndPublishButton.propTypes = {
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  save: PropTypes.func,
  isSaved: PropTypes.bool,
  currentUser: PropTypes.string,
}

const mapStateToProps = state => ({
  isSaved: !!rootResourceId(state),
  currentUser: getCurrentUser(state),
  isDisabled: !resourceHasChangesSinceLastSave(state),
})

const mapDispatchToProps = dispatch => ({
  save: (isSaved, user) => () => {
    if (isSaved) {
      dispatch(update(user))
    } else {
      dispatch(showGroupChooser(true))
    }
  },
})


export default connect(mapStateToProps, mapDispatchToProps)(SaveAndPublishButton)
