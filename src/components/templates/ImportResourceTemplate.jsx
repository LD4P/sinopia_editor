// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import Header from '../Header'
import ImportFileZone from './ImportFileZone'
import UpdateResourceModal from './UpdateResourceModal'
import CreateResourceMessages from './CreateResourceMessages'
import TemplateSearch from './TemplateSearch'

const ImportResourceTemplate = (props) => (
  <section id="importResourceTemplate">
    <UpdateResourceModal />
    <Header triggerEditorMenu={props.triggerHandleOffsetMenu}/>
    <ImportFileZone />
    <CreateResourceMessages />
    <TemplateSearch history={props.history} />
  </section>
)

ImportResourceTemplate.propTypes = {
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func,
  history: PropTypes.object,
}

export default ImportResourceTemplate
