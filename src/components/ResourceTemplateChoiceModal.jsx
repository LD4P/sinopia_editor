// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import ModalWrapper from "components/ModalWrapper"
import PropTypes from "prop-types"
import { hideModal } from "actions/modals"
import { Typeahead, withAsync } from "react-bootstrap-typeahead"
import { getTemplateSearchResults } from "sinopiaSearch"

const AsyncTypeahead = withAsync(Typeahead)

const ResourceTemplateChoiceModal = (props) => {
  const dispatch = useDispatch()

  const [isLoading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([])
  const [selectedValue, setSelectedValue] = useState(undefined)

  const search = useCallback((query) => {
    setLoading(true)
    getTemplateSearchResults(query).then((searchResults) => {
      setOptions(
        searchResults.results.map((result) => ({
          label: `${result.resourceLabel} (${result.id})`,
          id: result.id,
        }))
      )
      setLoading(false)
    })
  }, [])

  const change = (newSelected) => {
    setSelected(newSelected)
    if (newSelected.length === 1) {
      setSelectedValue(newSelected[0].id)
    }
  }

  const close = (event) => {
    event.preventDefault()
    dispatch(hideModal())
  }

  const saveAndClose = (event) => {
    event.preventDefault()
    props.choose(selectedValue)
    close(event)
  }

  const header = <h4 className="modal-title">Choose resource template</h4>

  const body = (
    <React.Fragment>
      <label htmlFor="template-lookup">
        Into which resource template do you want to load this resource?
      </label>
      <AsyncTypeahead
        onSearch={search}
        onChange={change}
        options={options}
        multiple={false}
        isLoading={isLoading}
        selected={selected}
        placeholder="Enter id, label, URI, remark, or author"
        minLength={1}
        allowNew={() => false}
        id={"template-lookup"}
      />
    </React.Fragment>
  )

  const footer = (
    <React.Fragment>
      <button
        className="btn btn-link"
        style={{ paddingRight: "20px" }}
        onClick={close}
      >
        Cancel
      </button>
      <button
        className="btn btn-primary btn-sm"
        onClick={(event) => saveAndClose(event)}
      >
        Save
      </button>
    </React.Fragment>
  )

  return (
    <ModalWrapper
      modalName="ResourceTemplateChoiceModal"
      ariaLabel="Choose resource template"
      header={header}
      body={body}
      footer={footer}
    />
  )
}

ResourceTemplateChoiceModal.propTypes = {
  choose: PropTypes.func.isRequired,
}

export default ResourceTemplateChoiceModal
