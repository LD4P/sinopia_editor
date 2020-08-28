// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import Header from '../Header'
import CreateResourceMessages from './CreateResourceMessages'
import TemplateSearch from './TemplateSearch'

const ResourceTemplate = (props) => (
  <section id="resourceTemplate">
    <Header triggerEditorMenu={props.triggerHandleOffsetMenu}/>
    <CreateResourceMessages />
    <TemplateSearch history={props.history} />
  </section>
)

ResourceTemplate.propTypes = {
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func,
  history: PropTypes.object,
}

export default ResourceTemplate
