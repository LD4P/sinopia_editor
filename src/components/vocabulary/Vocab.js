// Copyright 2020 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import Header from "../Header"
import AlertsContextProvider from "components/alerts/AlertsContextProvider"
import ContextAlert from "components/alerts/ContextAlert"
import _ from "lodash"

const vocabulary = {
  hasAuthor: {
    description: "Contact information associated with the template",
    url: "http://sinopia.io/vocabulary/hasAuthor",
  },
  hasAuthority: {
    description: "An authority associated with a lookup",
    url: "http://sinopia.io/vocabulary/hasAuthority",
  },
  hasClass: {
    description: "The RDF class for a property",
    url: "http://sinopia.io/vocabulary/hasClass",
  },
  hasDate: {
    description: "Date associated with the template",
    url: "http://sinopia.io/vocabulary/hasDate",
  },
  hasDefault: {
    description: "Default value(s) specific to a property",
    url: "http://sinopia.io/vocabulary/hasDefault",
  },
  hasLiteralAttributes: {
    description: "Attributes for a literal",
    url: "http://sinopia.io/vocabulary/hasLiteralAttributes",
  },
  hasLookupAttributes: {
    description: "Attributes for a lookup",
    url: "http://sinopia.io/vocabulary/hasLookupAttributes",
  },
  hasPropertyAttribute: {
    description: "Attributes specific to a property (e.g., repeatable)",
    url: "http://sinopia.io/vocabulary/hasPropertyAttribute",
  },
  hasPropertyTemplate: {
    description: "Property template used by the resource template",
    url: "http://sinopia.io/vocabulary/hasPropertyTemplate",
  },
  hasPropertyType: {
    description: "Specifies the type of property",
    url: "http://sinopia.io/vocabulary/hasPropertyType",
  },
  hasPropertyUri: {
    description: "URI of the RDF property being described",
    url: "http://sinopia.io/vocabulary/hasPropertyUri",
  },
  hasRemark: {
    description:
      "Comment or guiding statement intended to be presented as supplementary information in user display",
    url: "https://sinopia.io/vocabulary/hasRemark",
  },
  hasRemarkUrl: {
    description: "The property's remark as a URL",
    url: "http://sinopia.io/vocabulary/hasRemarkUrl",
  },
  hasResourceAttributes: {
    description: "Attributes specific to a resource (e.g., suppressible)",
    url: "http://sinopia.io/vocabulary/hasResourceAttributes",
  },
  hasResourceId: {
    description: "The resource's ID",
    url: "http://sinopia.io/vocabulary/hasResourceId",
  },
  hasResourceTemplate: {
    description:
      "The template used in creating, editing, or updating a resource",
    url: "http://sinopia.io/vocabulary/hasResourceTemplate",
  },
  hasResourceTemplateId: {
    description:
      "The resource's Template ID, e.g., ld4p:RT:bf2:Title:AbbrTitle",
    url: "http://sinopia.io/vocabulary/hasResourceTemplateId",
  },
  hasUri: {
    description: "URI",
    url: "http://sinopia.io/vocabulary/hasUri",
  },
  hasUriAttributes: {
    description: "Attributes for a URI",
    url: "http://sinopia.io/vocabulary/hasUriAttributes",
  },
  hasValidationDataType: {
    description: "Data Type to validate the literal, e.g. integer or dateTime",
    url: "http://sinopia.io/vocabulary/hasValidationDataType",
  },
  hasValidationRegex: {
    description: "Regular Expression to validate a literal",
    url: "http://sinopia.io/vocabulary/hasValidationRegex",
  },
  LookupPropertyTemplate: {
    description: "Class for a lookup property template",
    url: "http://sinopia.io/vocabulary/LookupPropertyTemplate",
  },
  PropertyTemplate: {
    description: "Class for a property template",
    url: "http://sinopia.io/vocabulary/PropertyTemplate",
  },
  "propertyAttribute/immutable": {
    description: "Value cannot be changed once assigned (for IDs)",
    url: "http://sinopia.io/vocabulary/propertyAttribute/immutable",
  },
  "propertyAttribute/ordered": {
    description: "Values are ordered",
    url: "http://sinopia.io/vocabulary/propertyAttribute/ordered",
  },
  "propertyAttribute/repeatable": {
    description: "Multiple values are allowed for the property",
    url: "http://sinopia.io/vocabulary/propertyAttribute/repeatable",
  },
  "propertyAttribute/required": {
    description: "Property value is required",
    url: "http://sinopia.io/vocabulary/propertyAttribute/required",
  },
  "propertyAttribute/suppressLanguage": {
    description: "Language selection is suppressed",
    url: "http://sinopia.io/vocabulary/propertyAttribute/languageSuppressed",
  },
  "propertyType/literal": {
    description: "Literal property value",
    url: "http://sinopia.io/vocabulary/propertyType/literal",
  },
  "propertyType/resource": {
    description: "Resource property value",
    url: "http://sinopia.io/vocabulary/propertyType/resource",
  },
  "propertyType/uri": {
    description: "URI property value",
    url: "http://sinopia.io/vocabulary/propertyType/uri",
  },
  "resourceAttribute/suppressible": {
    description:
      "whether resource is suppressible (must have only one property which is a lookup or URI)",
    url: "http://sinopia.io/vocabulary/resourceAttribute/suppressible",
  },
  ResourcePropertyTemplate: {
    description: "Class for a resource property template",
    url: "http://sinopia.io/vocabulary/ResourcePropertyTemplate",
  },
  ResourceTemplate: {
    description: "Class for a resource template ('template' or 'resource')",
    url: "http://sinopia.io/vocabulary/ResourceTemplate",
  },
  Uri: {
    description: "Class for a URI template",
    url: "http://sinopia.io/vocabulary/Uri",
  },
  UriPropertyTemplate: {
    description: "Class for a URI property template",
    url: "http://sinopia.io/vocabulary/UriPropertyTemplate",
  },
}

const displayProperty = (params) => {
  const header = <h2>Sinopia Vocabulary</h2>
  const key = params.sub ? `${params.element}/${params.sub}` : params.element
  const element = vocabulary[key]
  if (_.isEmpty(element))
    return (
      <div>
        {header}
        <h1>{key} not found</h1>
      </div>
    )
  return (
    <div>
      {header}
      <h1>{key}</h1>
      <h3>
        <em>{element.url}</em>
      </h3>
      <p>{element.description}</p>
      <p>
        Back to <a href="/vocabulary">Vocabulary</a>
      </p>
    </div>
  )
}

const AllProperties = () => (
  <div>
    <h1>Vocabulary</h1>
    <p>
      Sinopia uses a number of properties and classes for adding and editing RDF
      resources.
    </p>
    {Object.keys(vocabulary).map((key) => {
      const element = vocabulary[key]
      return (
        <div className="card w-50 mb-2" id={key} key={key}>
          <div className="card-body">
            <h2 className="card-title">
              <a href={`/vocabulary/${key}`}>{key}</a>
            </h2>
            <h3 className="card-subtitle mb-2 text-muted">{element.url}</h3>
            <p>{element.description}</p>
          </div>
        </div>
      )
    })}
  </div>
)

const vocabErrorKey = "vocab"

const Vocab = (props) => {
  const body =
    props.match.params.element === undefined ? (
      <AllProperties />
    ) : (
      displayProperty(props.match.params)
    )
  return (
    <AlertsContextProvider value={vocabErrorKey}>
      <div id="vocabulary">
        <Header triggerHomePageMenu={props.triggerHandleOffsetMenu} />
        <ContextAlert />
        {body}
      </div>
    </AlertsContextProvider>
  )
}

Vocab.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  match: PropTypes.object,
}

export default Vocab
