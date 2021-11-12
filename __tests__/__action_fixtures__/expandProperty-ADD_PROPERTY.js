import ResourceBuilder from "resourceBuilderUtils"

const build = new ResourceBuilder()

const expectedAction = {
  type: "ADD_PROPERTY",
  payload: build.property({
    key: "JQEtq-vmq8",
    subjectKey: "t9zVwg2zO",
    propertyTemplateKey:
      "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
    show: true,
    values: [],
  }),
}

export default expectedAction
