import React, { useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import PropTypes from "prop-types"
import { selectNormSubject } from "selectors/resources"
import { selectSubjectTemplate } from "selectors/templates"
import { selectGroups } from "selectors/authenticate"
import Config from "Config"
import TransferButton from "./TransferButton"
import { transfer } from "actionCreators/transfer"
import useAlerts from "hooks/useAlerts"
import _ from "lodash"

const TransferButtons = ({ resourceKey }) => {
  const dispatch = useDispatch()
  const errorKey = useAlerts()
  const resource = useSelector((state) => selectNormSubject(state, resourceKey))
  const subjectTemplate = useSelector((state) =>
    selectSubjectTemplate(state, resource?.subjectTemplateKey)
  )
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
  if (
    subjectTemplate?.class !== "http://id.loc.gov/ontologies/bibframe/Instance"
  )
    return null

  // Must be targets
  if (_.isEmpty(transferTargets)) return null

  const handleClick = (event, group, target) => {
    dispatch(transfer(resource.uri, group, target, errorKey))
    event.preventDefault()
  }

  const buttons = transferTargets.map(([target, group, label]) => (
    <TransferButton
      key={`${group}-${target}`}
      label={`Export to ${label}`}
      handleClick={(event) => handleClick(event, group, target)}
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
