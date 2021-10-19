// Copyright 2020 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import Header from "../Header"
import _ from "lodash"

const vocabulary = {
  hasAuthor: {
    description: "Contact information associated with the template",
    url: "http://sinopia.io/vocabulary/hasAuthor",
  },
  hasClass: {
    description: "The RDF class for a property",
    url: "http://sinopia.io/vocabulary/hasClass",
  },
  hasDate: {
    description: "Date associated with the template",
    url: "http://sinopia.io/vocabulary/hasDate",
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
  hasResourceAttribute: {
    description: "Attributes specific to a resource (e.g., suppressible)",
    url: "http://sinopia.io/vocabulary/hasResourceAttribute",
  },
  hasResourceTemplate: {
    description: "The template used in creating, editing, or updating a resource",
    url: "http://sinopia.io/vocabulary/hasResourceTemplate",
  },
  PropertyTemplate: {
    description: "",
    url: "http://sinopia.io/vocabulary/PropertyTemplate",
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
  ResourcePropertyTemplate: {
    description: "Class for a resource property template",
    url: "http://sinopia.io/vocabulary/ResourcePropertyTemplate",
  },
  ResourceTemplate: {
    description: "Class for a resource template",
    url: "http://sinopia.io/vocabulary/ResourceTemplate",
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
    <p>Sinopia uses a number of properties and classes for adding and editing RDF resources.</p>
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

const Vocab = (props) => {
  const body =
    props.match.params.element === undefined ? (
      <AllProperties />
    ) : (
      displayProperty(props.match.params)
    )
  return (
    <div id="vocabulary">
      <Header triggerHomePageMenu={props.triggerHandleOffsetMenu} />
      {body}
    </div>
  )
}

Vocab.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  match: PropTypes.object,
}

export default Vocab
