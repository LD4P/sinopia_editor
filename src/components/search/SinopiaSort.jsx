// Copyright 2019 Stanford University see LICENSE for license
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSinopiaSearchResults } from 'actionCreators/search'


const SinopiaSort = () => {
  const query = useSelector(state => state.selectorReducer.search.query)
  const searchOptions = useSelector(state => state.selectorReducer.search.options)
  const curSortField = searchOptions.sortField
  const curSortOrder = searchOptions.sortOrder

  const dispatch = useDispatch()
  const handleSort = (sortField, sortOrder) => dispatch(fetchSinopiaSearchResults(query, {
    ...searchOptions, startOfRange: 0, sortField, sortOrder,
  }))

  const getClasses = (sortField, sortOrder) => (curSortField === sortField && curSortOrder === sortOrder ? 'dropdown-item active' : 'dropdown-item')


  return (
    <div className="dropdown float-right">
      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Sort by
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <button type="button" className={getClasses('label', 'asc')} href="#" onClick={ () => handleSort('label', 'asc') }>
          Label, ascending</button>
        <button type="button" className={getClasses('label', 'desc')} href="#" onClick={ () => handleSort('label', 'desc') }>
          Label, descending</button>
        <button type="button" className={getClasses('modified', 'desc')} href="#" onClick={ () => handleSort('modified', 'desc') }>
          Modified date, newest first</button>
        <button type="button" className={getClasses('modified', 'asc')} href="#" onClick={ () => handleSort('modified', 'asc') }>
          Modified date, oldest first</button>
        <button type="button" className={getClasses(undefined, undefined)} href="#" onClick={ () => handleSort(undefined, undefined) }>
          Relevance</button>
      </div>
    </div>
  )
}

export default SinopiaSort
