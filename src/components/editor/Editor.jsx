import React, {Component} from 'react'
import ResourceTemplate from './ResourceTemplate'
import Footer from '../Footer'

class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // selecting a resource template will happen in the left-nav "Create Resource" menu, another child of this component
      // NOTE: temporarily hardcoded here.
      resourceTemplates: [
        {
          "id": "profile:bf2:Monograph:Instance",
          "resourceLabel": "BIBFRAME Instance",
          "resourceURI": "http://id.loc.gov/ontologies/bibframe/Instance",
          "remark": "Can you believe we're doing this!?",
          "propertyTemplates": [
            {
              "propertyLabel": "Instance of",
              "propertyURI": "http://id.loc.gov/ontologies/bibframe/instanceOf",
              "resourceTemplates": [],
              "type": "resource",
              "valueConstraint": {
                "valueTemplateRefs": [
                  "profile:bf2:Monograph:Work"
                ],
                "useValuesFrom": [],
                "valueDataType": {},
                "defaults": []
              },
              "mandatory": "false",
              "repeatable": "true"
            },
            {
              "propertyLabel": "Title Information",
              "propertyURI": "http://id.loc.gov/ontologies/bibframe/title",
              "resourceTemplates": [],
              "valueConstraint": {
                "valueTemplateRefs": [
                  "profile:bf2:Title",
                  "profile:bf2:Title:VarTitle",
                  "profile:bf2:ParallelTitle",
                  "profile:bflc:TranscribedTitle"
                ],
                "useValuesFrom": [],
                "valueDataType": {
                  "remark": ""
                },
                "defaults": []
              },
              "mandatory": "false",
              "repeatable": "true",
              "type": "resource",
              "remark": ""
            },
            {
              "propertyLabel": "Statement of Responsibility Relating to Title Proper (RDA 2.4.2)",
              "remark": "http://access.rdatoolkit.org/2.4.2.html",
              "propertyURI": "http://id.loc.gov/ontologies/bibframe/responsibilityStatement",
              "mandatory": "false",
              "repeatable": "true",
              "type": "literal",
              "resourceTemplates": [],
              "valueConstraint": {
                "valueTemplateRefs": [],
                "useValuesFrom": [],
                "valueDataType": {},
                "defaults": []
              }
            },
            {
              "propertyURI": "http://id.loc.gov/ontologies/bibframe/issuance",
              "propertyLabel": "Mode of Issuance (RDA 2.13)",
              "remark": "http://access.rdatoolkit.org/2.13.html",
              "mandatory": "false",
              "repeatable": "true",
              "type": "resource",
              "resourceTemplates": [],
              "valueConstraint": {
                "valueTemplateRefs": [],
                "useValuesFrom": [
                  "http://id.loc.gov/vocabulary/issuance"
                ],
                "valueDataType": {
                  "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Issuance"
                },
                "editable": "false",
                "repeatable": "true",
                "defaults": [
                  {
                    "defaultURI": "http://id.loc.gov/vocabulary/issuance/mono",
                    "defaultLiteral": "single unit"
                  }
                ]
              }
            },
            {
              "propertyLabel": "Notes about the Instance",
              "remark": "http://access.rdatoolkit.org/2.17.html",
              "propertyURI": "http://id.loc.gov/ontologies/bibframe/note",
              "mandatory": "false",
              "repeatable": "true",
              "type": "resource",
              "resourceTemplates": [],
              "valueConstraint": {
                "valueTemplateRefs": [
                  "profile:bf2:Note"
                ],
                "useValuesFrom": [],
                "valueDataType": {},
                "defaults": []
              }
            }
          ]
        }
      ]
    }
  }

  render() {
    return(
      <div id="editor">
        <h2>Editor Page</h2>
        <p>(will have a "Choose Resource Template" area + editing area)</p>
        <p>The selected resource template is <strong>{this.state.resourceTemplates[0].id}</strong></p>
        <ResourceTemplate
          resourceTemplates = {this.state.resourceTemplates}
          />
        <Footer />
      </div>
    )
  }
}

export default Editor
