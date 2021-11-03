// Copyright 2019 Stanford University see LICENSE for license

import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, addError } from "actions/errors"
import { showModal } from "actions/modals"
import ResourceTemplateChoiceModal from "../ResourceTemplateChoiceModal"
import { getTerm, getContextValues } from "utilities/QuestioningAuthority"
import useRdfResource from "hooks/useRdfResource"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import Alerts from "components/alerts/OldAlerts"
import { selectErrors } from "selectors/errors"
import _ from "lodash"
import { datasetFromN3 } from "utilities/Utilities"
import { selectSearchUri, selectSearchResults } from "selectors/search"

// Errors from retrieving a resource from this page.
export const searchQARetrieveErrorKey = "searchqaresource"

const QASearchResults = () => {
  const dispatch = useDispatch()

  const errorsRef = useRef(null)

  const searchResults = useSelector((state) =>
    selectSearchResults(state, "resource")
  )
  const searchUri = useSelector((state) => selectSearchUri(state, "resource"))

  const [resourceURI, setResourceURI] = useState(null)
  // Resource ID is for handling non-LD QA authorities, e.g., Discog
  const [resourceId, setResourceId] = useState(null)
  const [resourceTemplateId, setResourceTemplateId] = useState(null)
  const [dataset, setDataset] = useState(null)
  useRdfResource(
    dataset,
    resourceURI,
    resourceTemplateId,
    searchQARetrieveErrorKey
  )

  // Retrieve N3 from QA
  useEffect(() => {
    if (!resourceURI || !searchUri) {
      return
    }
    dispatch(clearErrors(searchQARetrieveErrorKey))
    getTerm(resourceURI, resourceId, searchUri)
      .then((resourceN3) => {
        datasetFromN3(resourceN3)
          .then((newDataset) => setDataset(newDataset))
          .catch((err) =>
            dispatch(addError(`Error parsing resource: ${err.message || err}`))
          )
      })
      .catch((err) =>
        dispatch(addError(`Error retrieving resource: ${err.message || err}`))
      )
  }, [dispatch, resourceId, resourceURI, searchUri])

  const errors = useSelector((state) =>
    selectErrors(state, searchQARetrieveErrorKey)
  )
  useLayoutEffect(() => {
    if (!_.isEmpty(errors)) window.scrollTo(0, errorsRef.current.offsetTop)
  }, [errors])

  // Transform the results into the format to be displayed in the table.
  const tableData = useMemo(
    () =>
      searchResults.map((result) => {
        const types = []
        const contexts = {}
        let imageURL
        if (result.context) {
          const typeValues = getContextValues(result.context, "Type")
          imageURL = _.first(getContextValues(result.context, "Image URL"))
          if (typeValues) types.push(...typeValues)
          const excludeProperties = ["Type", "Title", "Image URL"]
          result.context.forEach((context) => {
            if (!excludeProperties.includes(context.property))
              contexts[context.property] = context.values
          })
        }
        return {
          label: result.label,
          uri: result.uri,
          id: result.id,
          types,
          contexts,
          imageURL,
        }
      }),
    [searchResults]
  )

  const handleCopy = (uri, id) => {
    setResourceURI(uri)
    setResourceId(id)
    setResourceTemplateId(null)
    dispatch(showModal("ResourceTemplateChoiceModal"))
  }

  // Passed into resource template chooser to allow it to pass back selected resource template id.
  const chooseResourceTemplate = (resourceTemplateId) => {
    setResourceTemplateId(resourceTemplateId)
  }

  const typesFormatter = (types) => (
    <ul className="list-unstyled">
      {types.map((type) => (
        <li key={type}>{type}</li>
      ))}
    </ul>
  )

  const imageFormatter = (imageURL, label) => {
    if (imageURL) {
      return (
        <img
          src={imageURL}
          className="img-thumbnail float-left"
          alt={label}
          style={{ width: "100px", marginRight: "4px" }}
        />
      )
    }
  }

  const actionFormatter = (uri, id) => (
    <div>
      <button
        type="button"
        className="btn btn-link"
        onClick={() => handleCopy(uri, id)}
        title="Copy"
        aria-label="Copy this resource"
      >
        <FontAwesomeIcon icon={faCopy} className="icon-lg" />
      </button>
    </div>
  )

  const contextFormatter = (contexts) => {
    const contextItems = Object.entries(contexts).map(([property, values]) => (
      <li key={property}>
        <strong>{property}</strong>: {values.join(", ")}
      </li>
    ))
    return <ul className="list-unstyled">{contextItems}</ul>
  }

  const generateRows = () => {
    const rows = []
    tableData.forEach((row) => {
      rows.push(
        <tr key={row.uri}>
          <td>
            {row.label}
            {row.label !== row.uri && (
              <React.Fragment>
                <br />
                {row.uri}
              </React.Fragment>
            )}
          </td>
          <td>{typesFormatter(row.types)}</td>
          <td>
            {imageFormatter(row.imageURL, row.label)}
            {contextFormatter(row.contexts)}
          </td>
          <td>{actionFormatter(row.uri, row.id)}</td>
        </tr>
      )
    })
    return rows
  }

  if (searchResults.length === 0) {
    return null
  }

  return (
    <React.Fragment>
      <div ref={errorsRef}>
        <Alerts errorKey={searchQARetrieveErrorKey} />
      </div>
      <div id="search-results" className="row">
        <div className="col">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="search-header" style={{ width: "40%" }}>
                  Label / ID
                </th>
                <th className="search-header" style={{ width: "25%" }}>
                  Class
                </th>
                <th className="search-header" style={{ width: "25%" }}>
                  Context
                </th>
                <th className="search-header" style={{ width: "10%" }} />
              </tr>
            </thead>
            <tbody>{generateRows()}</tbody>
          </table>
        </div>
        <ResourceTemplateChoiceModal choose={chooseResourceTemplate} />
      </div>
    </React.Fragment>
  )
}

export default QASearchResults
