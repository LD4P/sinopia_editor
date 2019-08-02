// Copyright 2019 Stanford University see LICENSE for license
/* This seems to be throwing false positives */
/* eslint react/prop-types: 'off' */
/* eslint import/dynamic-import-chunkname: 'off' */

import React from 'react'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import { getTagNameForPropertyTemplate } from 'utilities/propertyTemplates'

const PropertyComponent = (props) => {
  const tag = getTagNameForPropertyTemplate(props.propertyTemplate)
  const TagName = React.lazy(() => import(`./${tag}`))
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <TagName reduxPath={props.reduxPath} />
    </React.Suspense>
  )
}

PropertyComponent.propTypes = {
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.array.isRequired,
}

export default PropertyComponent
