// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import ModalWrapper, {
  useDisplayStyle,
  useModalCss,
} from "components/ModalWrapper"
import PropTypes from "prop-types"
import { hideModal } from "actions/modals"
import { Typeahead, withAsync } from "react-bootstrap-typeahead"
import { getTemplateSearchResults } from "sinopiaSearch"
import { isCurrentModal } from "selectors/modals"

const AsyncTypeahead = withAsync(Typeahead)

const ResourceTemplateChoiceModal = (props) => {
  const dispatch = useDispatch()
  const show = useSelector((state) =>
    isCurrentModal(state, "ResourceTemplateChoiceModal")
  )

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

  const modal = (
    <div
      className={useModalCss(show)}
      tabIndex="-1"
      role="dialog"
      id="choose-rt"
      style={{ display: useDisplayStyle(show) }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Choose resource template</h4>
            <button
              type="button"
              className="btn-close"
              onClick={close}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
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
          </div>
          <div className="modal-footer">
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
          </div>
        </div>
      </div>
    </div>
  )

  return <ModalWrapper modal={modal} />
}

ResourceTemplateChoiceModal.propTypes = {
  choose: PropTypes.func.isRequired,
}

export default ResourceTemplateChoiceModal
