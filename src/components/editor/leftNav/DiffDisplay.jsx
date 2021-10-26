// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { isHttp } from "utilities/Utilities"
import _ from "lodash"

const DiffDisplay = ({ diff }) => {
  const displaySubjectDiff = (subjectDiff) => {
    const addedProperties = subjectDiff.addedProperties.map((property) =>
      displayProperty(property, true)
    )
    const removedProperties = subjectDiff.removedProperties.map((property) =>
      displayProperty(property, false)
    )
    const changedProperties = subjectDiff.changedPropertyDiffs.map(
      (propertyDiff) => displayChangedPropertyDiff(propertyDiff)
    )
    if (
      _.isEmpty(addedProperties) &&
      _.isEmpty(removedProperties) &&
      _.isEmpty(changedProperties)
    ) {
      return <React.Fragment>No differences</React.Fragment>
    }
    return (
      <ul>
        {addedProperties}
        {removedProperties}
        {changedProperties}
      </ul>
    )
  }

  const displaySubject = (subject, isAdd) => {
    const properties = _.compact(
      subject.properties.map((property) => displayProperty(property, isAdd))
    )
    if (_.isEmpty(properties))
      properties.push(<li key="nodiff">No differences</li>)
    return (
      <li key={subject.subjectTemplate.key} className={className(isAdd)}>
        {subject.subjectTemplate.label}
        <ul>{properties}</ul>
      </li>
    )
  }

  const displayProperty = (property, isAdd) => {
    if (!property.values) return null
    const values = property.values.map((value) => displayValue(value, isAdd))
    if (_.isEmpty(values)) values.push(<li key="nodiff">No differences</li>)
    return (
      <li key={property.propertyTemplate.key} className={className(isAdd)}>
        {property.propertyTemplate.label}
        <ul>{values}</ul>
      </li>
    )
  }

  const displayChangedPropertyDiff = (propertyDiff) => {
    const removedValues = propertyDiff.removedValues.map((value) =>
      displayValue(value, false)
    )
    const addedValues = propertyDiff.addedValues.map((value) =>
      displayValue(value, true)
    )
    const changedValues = propertyDiff.changedValues.map(([value1, value2]) => (
      <li key={value1.key}>
        <span className={className(false)}>
          {formatLiteralOrUriValue(value1)}
        </span>{" "}
        --&gt;{" "}
        <span className={className(true)}>
          {formatLiteralOrUriValue(value2)}
        </span>
      </li>
    ))
    const changedValueSubjects = propertyDiff.changedSubjectValueDiffs.map(
      (subjectDiff) => (
        <li key={subjectDiff.key}>
          {subjectDiff.subjectTemplate.label}
          {displaySubjectDiff(subjectDiff)}
        </li>
      )
    )
    return (
      <li key={propertyDiff.key}>
        {propertyDiff.propertyTemplate.label}
        <ul>
          {removedValues}
          {addedValues}
          {changedValues}
          {changedValueSubjects}
        </ul>
      </li>
    )
  }

  const displayValue = (value, isAdd) => {
    if (value.valueSubject) {
      return displaySubject(value.valueSubject, isAdd)
    }
    return (
      <li key={value.key} className={className(isAdd)}>
        {formatLiteralOrUriValue(value)}
      </li>
    )
  }

  const formatLiteralOrUriValue = (value) => {
    if (value.literal) {
      return formatLiteralValue(value)
    }
    return formatUriValue(value)
  }

  const formatUriValue = (value) => {
    const uri = isHttp(value.uri) ? (
      <a target="_blank" rel="noopener noreferrer" href={value.uri}>
        {value.uri}
      </a>
    ) : (
      value.uri
    )
    if (value.label) {
      const lang = value.lang ? ` [${value.lang}]` : ""
      return (
        <React.Fragment>
          {value.label}
          {lang}: {uri}
        </React.Fragment>
      )
    }
    return <React.Fragment>{uri}</React.Fragment>
  }

  const formatLiteralValue = (value) => {
    const lang = value.lang ? ` [${value.lang}]` : ""
    return (
      <React.Fragment>
        {value.literal}
        {lang}
      </React.Fragment>
    )
  }

  const className = (isAdd) => (isAdd ? "add" : "remove")

  return displaySubjectDiff(diff)
}

DiffDisplay.propTypes = {
  diff: PropTypes.object.isRequired,
}

export default DiffDisplay
