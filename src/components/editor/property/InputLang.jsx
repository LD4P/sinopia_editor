// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class InputLang extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      options: [],
    }
  }

  setPayLoad(items) {
    const payload = {
      id: this.props.textId,
      reduxPath: this.props.reduxPath,
      items,
    }

    this.props.handleLangChange(payload)
  }

  createOptions = json => json.reduce((result, item) => {
    // Object.getOwnPropertyDescriptor is necessary to handle the @
    const uri = Object.getOwnPropertyDescriptor(item, '@id').value
    const labelArrayDescr = Object.getOwnPropertyDescriptor(item, 'http://www.loc.gov/mads/rdf/v1#authoritativeLabel')

    // There are some odd entries, so ignoring if don't have labels.
    if (!labelArrayDescr) return result
    const labelArray = labelArrayDescr.value

    // Looking for English label
    let label = null

    labelArray.forEach((langItem) => {
      if (langItem['@language'] === 'en') {
        label = langItem['@value']
      }
    })
    // But not every language has an English label.
    if (!label) return result

    result.push({ id: uri, uri, label })
    return result
  }, [])

  render() {
    const typeaheadProps = {
      id: 'langComponent',
      useCache: true,
      selectHintOnEnter: true,
      isLoading: this.state.isLoading,
      options: this.state.options,
      selected: this.state.selected,
      emptyLabel: 'retrieving list of languages...',
    }

    return (
      <div>
        <label htmlFor="langComponent">Select language for {this.props.textValue}
          <Typeahead
            onFocus={() => {
              // onFocus seems to get called multiple times.
              if (this.state.isLoading) {
                return
              }
              this.setState({ isLoading: true })
              fetch('https://id.loc.gov/vocabulary/languages.json')
                .then(resp => resp.json())
                .then((json) => {
                  this.setState({
                    isLoading: false,
                    options: this.createOptions(json),
                  })
                })
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
  textId: PropTypes.string.isRequired,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  handleLangChange: PropTypes.func,
}

const mapStatetoProps = () => ({})

const mapDispatchtoProps = () => ({
})

export default connect(mapStatetoProps, mapDispatchtoProps)(InputLang)
