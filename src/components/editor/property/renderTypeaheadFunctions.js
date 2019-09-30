import React from 'react'
import { Menu, MenuItem, Token } from 'react-bootstrap-typeahead'
import { getOptionLabel } from 'react-bootstrap-typeahead/lib/utils'
import { isValidURI } from '../../../Utilities'
import RenderLookupContext from './RenderLookupContext'
import shortid from 'shortid'

export const renderMenuFunc = (results, menuProps) => {
  const items = []
  let authURI
  let authLabel

  /*
   * Returning results
   * If error is returned, it will be used to display for that source
   */
  results.forEach((result, i) => {
    if (result.customOption) {
      let headerLabel
      let option

      if (isValidURI(result.label)) {
        headerLabel = 'New URI'
        option = {
          id: result.label,
          label: result.label,
          uri: result.label,
        }
      } else {
        headerLabel = 'New Literal'
        option = {
          id: result.label,
          label: result.label,
          content: result.label,
        }
      }
      items.push(<Menu.Header key="customOption-header">{headerLabel}</Menu.Header>)
      items.push(
        <MenuItem option={option} position={i} key={i}>
          {result.label}
        </MenuItem>,
      )
      return
    }

    if (result.isError) {
      const errorMessage = result.label || 'An error occurred in retrieving results'

      items.push(
        <Menu.Header key={shortid.generate()}>
          <span className="dropdown-error">{errorMessage}</span>
        </Menu.Header>,
      )

      // Effectively a `continue`/`next` statement within the `forEach()` context, skipping to the next iteration
      return
    }
    if ('authURI' in result) {
      authLabel = result.authLabel
      authURI = result.authURI
      const labelKey = `${authLabel}-header`
      items.push(<Menu.Header key={labelKey}>{authLabel}</Menu.Header>)
      return
    }
    if (menuProps.id === 'sinopia-lookup') {
      const labelKey = `${result.uri}-header`
      items.push(<Menu.Header key={labelKey}>Sinopia Entity</Menu.Header>)
    }

    let bgClass = 'context-result-bg'
    if (i % 2 === 0) {
      bgClass = 'context-result-alt-bg'
    }
    items.push(
      <MenuItem option={result} position={i} key={i}>
        {result.context ? (
          <RenderLookupContext innerResult={result} authLabel={authLabel} authURI={authURI} colorClassName={bgClass}></RenderLookupContext>
        ) : result.label
        }
      </MenuItem>,
    )
  })

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
      disabled={tokenProps.disabled}
      key={idx}
      onRemove={tokenProps.onRemove}
      tabIndex={tokenProps.tabIndex}>
      { children }
    </Token>
  )
}
