// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import PropTypes from "prop-types"
import PreviewModal from "../preview/PreviewModal"
import { selectRelationships } from "selectors/relationships"
import { getSearchResultsByUris } from "sinopiaSearch"
import { addError } from "actions/errors"
import RelationshipRow from "./RelationshipRow"
import _ from "lodash"

const RelationshipsDisplay = ({
  resourceKey,
  errorKey,
  displayActions = true,
}) => {
  const dispatch = useDispatch()

  // These are results from search
  const [resourceRowMaps, setResourceRowMaps] = useState({})
  const [isMounted, setMounted] = useState(true)
  // Note that when loading a new resource the inferred refs may arrive asynchronously, which means the refs
  // may change during the lifecycle of the component.
  const { bfAdminMetadataRefs, bfItemRefs, bfInstanceRefs, bfWorkRefs } =
    useSelector((state) => selectRelationships(state, resourceKey), _.isEqual)

  useEffect(() => () => setMounted(false), [])

  useEffect(() => {
    const uris = [
      ...bfAdminMetadataRefs,
      ...bfItemRefs,
      ...bfInstanceRefs,
      ...bfWorkRefs,
    ]
    if (_.isEmpty(uris)) return
    getSearchResultsByUris(uris)
      .then((searchResult) => {
        if (!isMounted) return
        if (searchResult.error) {
          dispatch(
            addError(
              errorKey,
              `Error getting relationships: ${searchResult.error}`
            )
          )
          return
        }
        const newResourceRowMap = {}
        searchResult.results.forEach(
          (row) => (newResourceRowMap[row.uri] = row)
        )
        setResourceRowMaps((resourceRowMaps) => ({
          ...resourceRowMaps,
          [resourceKey]: newResourceRowMap,
        }))
      })
      .catch((error) => {
        dispatch(addError(errorKey, error.message || error))
      })
  }, [
    bfAdminMetadataRefs,
    bfItemRefs,
    bfInstanceRefs,
    bfWorkRefs,
    isMounted,
    resourceKey,
    errorKey,
    dispatch,
  ])

  const relationshipList = (label, refs) => {
    const resourceRowMap = resourceRowMaps[resourceKey]
    if (_.isEmpty(refs) || _.isEmpty(resourceRowMap)) return null
    const refItems = refs.map((ref) => {
      const row = resourceRowMap[ref]
      if (!row) return null
      return (
        <RelationshipRow
          key={ref}
          displayActions={displayActions}
          row={row}
          errorKey={errorKey}
        />
      )
    })
    return (
      <React.Fragment>
        <h5>{label}</h5>
        <ul>{refItems}</ul>
      </React.Fragment>
    )
  }

  if (!resourceRowMaps[resourceKey])
    return <div className="relationships-nav">Loading ...</div>

  return (
    <React.Fragment>
      {displayActions && <PreviewModal errorKey={errorKey} />}

      <div className="relationships-nav">
        {relationshipList("Works", bfWorkRefs)}
        {relationshipList("Instances", bfInstanceRefs)}
        {relationshipList("Items", bfItemRefs)}
        {relationshipList("Admin Metadata", bfAdminMetadataRefs)}
      </div>
    </React.Fragment>
  )
}

RelationshipsDisplay.propTypes = {
  resourceKey: PropTypes.string.isRequired,
  errorKey: PropTypes.string.isRequired,
  displayActions: PropTypes.bool,
}

export default RelationshipsDisplay
