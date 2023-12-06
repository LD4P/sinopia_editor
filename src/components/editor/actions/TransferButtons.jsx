import React, { useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import PropTypes from "prop-types"
import { selectNormSubject } from "selectors/resources"
import { selectGroups } from "selectors/authenticate"
import Config from "Config"
import TransferButton from "./TransferButton"
import { transfer } from "actionCreators/transfer"
import useAlerts from "hooks/useAlerts"
import { isBfInstance } from "utilities/Bibframe"
import _ from "lodash"

const TransferButtons = ({ resourceKey }) => {
  const dispatch = useDispatch()
  const errorKey = useAlerts()
  const resource = useSelector((state) => selectNormSubject(state, resourceKey))
  const userGroups = useSelector((state) => selectGroups(state))

  const transferTargets = useMemo(() => {
    const newTargets = []
    Object.entries(Config.transferConfig).forEach(([target, targetConfig]) => {
      Object.entries(targetConfig).forEach(([group, label]) => {
        if (userGroups.includes(group)) newTargets.push([target, group, label])
      })
    })
    return newTargets
  }, [userGroups])

  // Resource must be saved
  if (!resource?.uri) return null

  // Resource must be a bf:Instance
  if (!isBfInstance(resource?.classes)) return null

  // Must be targets
  if (_.isEmpty(transferTargets)) return null

  const handleTransfer = (group, target, localId) => {
    dispatch(transfer(resource.uri, group, target, localId, errorKey))
  }

  const buttons = transferTargets.map(([target, group, label]) => (
    <TransferButton
      key={`${group}-${target}`}
      group={group}
      target={target}
      resourceKey={resourceKey}
      label={`Export to ${label}`}
      handleTransfer={(localId) => handleTransfer(group, target, localId)}
    />
  ))

  return (
    <React.Fragment>
      {buttons} <div className="separator-circle">•</div>
    </React.Fragment>
  )
}

TransferButtons.propTypes = {
  resourceKey: PropTypes.string.isRequired,
}

export default TransferButtons
