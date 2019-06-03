// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setLang } from '../../actions/index'

class InputLang extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      options: [],
    }
  }

  /*
   * TODO:
   * English is the default value, but is not set in the redux.lang.store, so it currently would need to be set manually
   * in the generation of RDF.
   * See https://github.com/LD4P/sinopia_editor/issues/290
   */

  /*
   * When clicking Cancel make it not save the language. Clicking X to remove the input for the literal
   * leaves the input in the lang redux store but nothing will be associated with it in the "literal" store.
   * See https://github.com/LD4P/sinopia_editor/issues/275
   */

  setPayLoad(items) {
    const payload = {
      id: this.props.textValue,
      items,
    }

    this.props.handleSelectedChange(payload)
  }

  createOptions = (json) => {
    for (const i in json) {
      try {
        const item = Object.getOwnPropertyDescriptor(json, i)
        const uri = item.value['@id']
        const valArr = item.value['http://www.loc.gov/mads/rdf/v1#authoritativeLabel']
        let label

        valArr.forEach((obj) => {
          if (obj['@language'] == 'en') {
            label = obj['@value']
          }
        })

        return { id: uri, uri, label }
      } catch (error) {
        // ignore
      }
    }
  }

  render() {
    const typeaheadProps = {
      id: 'langComponent',
      useCache: true,
      selectHintOnEnter: true,
      isLoading: this.state.isLoading,
      options: this.state.options,
      selected: this.state.selected,
    }
    const opts = []


    return (
      <div>
        <label htmlFor="langComponent">Select language for {this.props.textValue}
          <Typeahead
            onFocus={() => {
              this.setState({ isLoading: true })
              fetch('https://id.loc.gov/vocabulary/languages.json')
                .then(resp => resp.json())
                .then((json) => {
                  opts.push(this.createOptions(json))
                })
                .then(() => this.setState({
                  isLoading: false,
                  options: opts,
                }))
                .catch(() => false)
            }}
            onBlur={() => {
              this.setState({ isLoading: false })
            }}
            onChange={selected => this.setPayLoad(selected)}
            {...typeaheadProps}
          />
        </label>
      </div>
    )
  }
}

InputLang.propTypes = {
  textValue: PropTypes.string.isRequired,
}

const mapStatetoProps = (state) => {
  const data = state.lang.formData
  let result = {}

  if (data !== undefined) {
    result = { formData: data }
  }

  return result
}

const mapDispatchtoProps = dispatch => ({
  handleSelectedChange(selected) {
    dispatch(setLang(selected))
  },
})

export default connect(mapStatetoProps, mapDispatchtoProps)(InputLang)
