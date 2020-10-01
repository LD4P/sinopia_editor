// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { Menu, MenuItem, Token } from 'react-bootstrap-typeahead'
import { getOptionLabel } from 'react-bootstrap-typeahead/lib/utils'
import { isValidURI } from 'utilities/Utilities'
import RenderLookupContext from './RenderLookupContext'
import shortid from 'shortid'

export const renderMenuFunc = (results, menuProps, lookupConfigs) => {
  const items = []

  lookupConfigs.forEach((authority) => {
    items.push(<Menu.Header key={authority.uri}>{authority.label}</Menu.Header>)

    const hits = []
    let inAuthority = false
    results.forEach((row) => {
      if ('authURI' in row) {
        if (row.authURI === authority.uri) {
          inAuthority = true
          return
        }
        inAuthority = false
      }
      if (inAuthority) {
        hits.push(row)
      }
    })
    hits.forEach((result, i) => {
      if (result.customOption) return
      if (result.isError) {
        const errorMessage = result.label || 'An error occurred in retrieving results'
        items.push(
          <Menu.Header key={shortid.generate()}>
            <span className="dropdown-error">{errorMessage}</span>
          </Menu.Header>,
        )
      } else {
        const key = `${authority.uri}-${i}`
        items.push(
          <MenuItem option={result} key={key}>
            { result.context ? (
              <RenderLookupContext innerResult={result}
                                   authLabel={authority.label}
                                   authURI={authority.uri}></RenderLookupContext>
            ) : result.label
            }
          </MenuItem>,
        )
      }
    })
  })


  const customOption = results.filter((result) => result.customOption)
  customOption.forEach((result) => {
    const isURI = isValidURI(result.label)
    const headerLabel = isURI ? 'New URI' : 'New Literal'
    const option = {
      id: result.label,
      label: result.label,
    }
    isURI ? option.uri = result.label : option.content = result.label
    items.push(<Menu.Header key="customOption-header">{headerLabel}</Menu.Header>)
    items.push(<MenuItem key={result.label} option={option} data-testid="customOption-link">{result.label}</MenuItem>)
  })


  /*
   * Returning results
   * If error is returned, it will be used to display for that source
   */
  return (
    <Menu {...menuProps} id={menuProps.id}>
      {items}
    </Menu>
  )
}

// Render token function to be used by typeahead
export const renderTokenFunc = (option, tokenProps, idx) => {
  const optionLabel = getOptionLabel(option, tokenProps.labelKey)
  const children = option.uri ? (<a href={option.uri} rel="noopener noreferrer" target="_blank">{optionLabel}</a>) : optionLabel
  return (
    <Token
      key={idx}
      option={option}
      onRemove={tokenProps.onRemove}
      tabIndex={tokenProps.tabIndex}>
      { children }
    </Token>
  )
}

export const itemsForValues = (values) => values.map((value) => ({
  id: value.key,
  content: value.literal,
  uri: value.uri,
  label: value.label || value.literal,
}))
