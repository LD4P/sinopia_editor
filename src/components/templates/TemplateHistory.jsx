// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useSelector } from 'react-redux'

const TemplateHistory = (props) => {
  const resourceTemplateIds = useSelector(state => state.selectorReducer.history.resourceTemplateIds)
  if (resourceTemplateIds.length === 0) return (<div>Nothing</div>)

  const history = resourceTemplateIds.map(id => <li key={id}>{id}</li>)
  return (
    <table className="table">
      History
      <tr>
        <td>
          {history}
        </td>
      </tr>
    </table>)
}


export default TemplateHistory
