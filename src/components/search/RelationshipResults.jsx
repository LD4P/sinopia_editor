import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import PropTypes from "prop-types"
import { selectSearchRelationships } from "selectors/relationships"
import { getSearchResultsByUris } from "sinopiaSearch"
import useAlerts from "hooks/useAlerts"
import usePermissions from "hooks/usePermissions"
import { selectGroupMap } from "selectors/groups"
import SearchResultRow from "./SearchResultRow"
import { addError } from "actions/errors"
import _ from "lodash"

const RelationshipResults = ({ uri }) => {
  const dispatch = useDispatch()
  const errorKey = useAlerts()
  const relationships = useSelector((state) =>
    selectSearchRelationships(state, uri)
  )
  const { canEdit, canCreate } = usePermissions()
  const groupMap = useSelector((state) => selectGroupMap(state))

  // These are results from search
  const [resourceRowMap, setResourceRowMap] = useState({})
  const [isMounted, setMounted] = useState(true)

  useEffect(() => () => setMounted(false), [])

  useEffect(() => {
    if (_.isEmpty(relationships)) return
    const uris = [
      ...relationships.bfItemRefs,
      ...relationships.bfInstanceRefs,
      ...relationships.bfWorkRefs,
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
        setResourceRowMap(newResourceRowMap)
      })
      .catch((error) => {
        dispatch(addError(errorKey, error.message || error))
      })
  }, [relationships, isMounted, errorKey, dispatch])

  const relationshipList = (label, refs) => {
    if (_.isEmpty(refs)) return null
    const refRows = refs.map((ref) => {
      const row = resourceRowMap[ref]
      if (!row) return null
      return (
        <SearchResultRow
          key={row.uri}
          row={row}
          groupMap={groupMap}
          canCreate={canCreate}
          canEdit={canEdit(row)}
          withRelationships={false}
        />
      )
    })
    return (
      <div className="search-relationship">
        <h5 className="ps-3">{label}</h5>
        <table className="table table-bordered table-light mb-0">
          <colgroup>
            <col span="1" />
            <col span="1" style={{ width: "30%" }} />
            <col span="1" style={{ width: "15%" }} />
            <col span="1" style={{ width: "10%" }} />
            <col span="1" style={{ width: "10%" }} />
          </colgroup>
          <tbody>{refRows}</tbody>
        </table>
      </div>
    )
  }

  if (_.isEmpty(relationships)) return null

  if (_.isEmpty(resourceRowMap)) {
    return <div>Loading ... {Object.values(resourceRowMap).length}</div>
  }

  return (
    <div>
      {relationshipList("Works", relationships.bfWorkRefs)}
      {relationshipList("Instances", relationships.bfInstanceRefs)}
      {relationshipList("Items", relationships.bfItemRefs)}
      {relationshipList("Admin Metadata", relationships.bfAdminMetadataRefs)}
    </div>
  )
}

RelationshipResults.propTypes = {
  uri: PropTypes.string.isRequired,
}

export default RelationshipResults
