import ResourceDiffer from "ResourceDiffer"
import _ from "lodash"

const resource = require("./__state_fixtures__/full_resource.json")
const addedValueSubject = require("./__state_fixtures__/value_subject.json")

describe("ResourceDiffer", () => {
  it("diffs identical resources", () => {
    const diff = new ResourceDiffer(resource, resource).diff

    expect(diff.addedProperties).toEqual([])
    expect(diff.removedProperties).toEqual([])
    expect(diff.changedPropertyDiffs).toEqual([])
  })

  it("diffs changed literal values", () => {
    const resource2 = newResource()
    resource2.properties.find(
      (property) => property.key === "Ju0IwOIn3oFsbvgxNZxeI"
    ).values[0].literal = "changed Uber template1, property2"

    const diff = new ResourceDiffer(resource, resource2).diff
    expect(diff.addedProperties).toEqual([])
    expect(diff.removedProperties).toEqual([])
    expect(diff.changedPropertyDiffs).toHaveLength(1)
    const propertyDiff = diff.changedPropertyDiffs[0]
    expect(propertyDiff.addedValues).toHaveLength(1)
    expect(propertyDiff.addedValues[0].literal).toEqual(
      "changed Uber template1, property2"
    )
    expect(propertyDiff.removedValues).toHaveLength(1)
    expect(propertyDiff.removedValues[0].literal).toEqual(
      "Uber template1, property2"
    )
    expect(propertyDiff.changedValues).toEqual([])
  })

  it("diffs changed literal languages", () => {
    const resource2 = newResource()
    resource2.properties.find(
      (property) => property.key === "Ju0IwOIn3oFsbvgxNZxeI"
    ).values[0].lang = "bhu"

    const diff = new ResourceDiffer(resource, resource2).diff
    expect(diff.addedProperties).toEqual([])
    expect(diff.removedProperties).toEqual([])
    expect(diff.changedPropertyDiffs).toHaveLength(1)
    const propertyDiff = diff.changedPropertyDiffs[0]
    expect(propertyDiff.addedValues).toEqual([])
    expect(propertyDiff.removedValues).toEqual([])
    expect(propertyDiff.changedValues).toHaveLength(1)
    expect(propertyDiff.changedValues[0][0].lang).toEqual("en")
    expect(propertyDiff.changedValues[0][1].lang).toEqual("bhu")
  })

  it("diffs changed URIs", () => {
    const resource2 = newResource()
    resource2.properties.find(
      (property) => property.key === "vD5j1BODY7KQnl4OGyCGa"
    ).values[0].uri = "http://example.edu/ubertemplate1:property5#changed"

    const diff = new ResourceDiffer(resource, resource2).diff
    expect(diff.addedProperties).toEqual([])
    expect(diff.removedProperties).toEqual([])
    expect(diff.changedPropertyDiffs).toHaveLength(1)
    const propertyDiff = diff.changedPropertyDiffs[0]
    expect(propertyDiff.addedValues).toHaveLength(1)
    expect(propertyDiff.addedValues[0].uri).toEqual(
      "http://example.edu/ubertemplate1:property5#changed"
    )
    expect(propertyDiff.removedValues).toHaveLength(1)
    expect(propertyDiff.removedValues[0].uri).toEqual(
      "http://example.edu/ubertemplate1:property5"
    )
    expect(propertyDiff.changedValues).toEqual([])
    expect(propertyDiff.changedSubjectValueDiffs).toEqual([])
  })

  it("diffs changed URI labels", () => {
    const resource2 = newResource()
    resource2.properties.find(
      (property) => property.key === "vD5j1BODY7KQnl4OGyCGa"
    ).values[0].label = "ubertemplate1:property5 changed"

    const diff = new ResourceDiffer(resource, resource2).diff
    expect(diff.addedProperties).toEqual([])
    expect(diff.removedProperties).toEqual([])
    expect(diff.changedPropertyDiffs).toHaveLength(1)
    const propertyDiff = diff.changedPropertyDiffs[0]
    expect(propertyDiff.addedValues).toEqual([])
    expect(propertyDiff.removedValues).toEqual([])
    expect(propertyDiff.changedValues).toHaveLength(1)
    expect(propertyDiff.changedValues[0][0].label).toEqual(
      "ubertemplate1:property5"
    )
    expect(propertyDiff.changedValues[0][1].label).toEqual(
      "ubertemplate1:property5 changed"
    )
    expect(propertyDiff.changedSubjectValueDiffs).toEqual([])
  })

  it("diffs added values", () => {
    const resource2 = newResource()
    const property = resource2.properties.find(
      (property) => property.key === "Ju0IwOIn3oFsbvgxNZxeI"
    )
    property.values.push({
      key: "zaD077UWwRFvQN2vzbJFN",
      literal: "Uber template1, property2, number2",
      lang: "en",
      uri: null,
      label: null,
      component: "InputLiteralValue",
      propertyKey: "Ju0IwOIn3oFsbvgxNZxeI",
      rootSubjectKey: "vX5R-HZ0W7j9I1kHhGsC1",
      rootPropertyKey: "Ju0IwOIn3oFsbvgxNZxeI",
      valueSubjectKey: null,
      errors: [],
      valueSubject: null,
    })
    property.valueKeys.push("zaD077UWwRFvQN2vzbJFN")

    const diff = new ResourceDiffer(resource, resource2).diff
    expect(diff.addedProperties).toEqual([])
    expect(diff.removedProperties).toEqual([])
    expect(diff.changedPropertyDiffs).toHaveLength(1)
    const propertyDiff = diff.changedPropertyDiffs[0]
    expect(propertyDiff.addedValues).toHaveLength(1)
    expect(propertyDiff.addedValues[0].literal).toEqual(
      "Uber template1, property2, number2"
    )
    expect(propertyDiff.removedValues).toEqual([])
    expect(propertyDiff.changedValues).toEqual([])
    expect(propertyDiff.changedSubjectValueDiffs).toEqual([])
  })

  it("diffs removed values", () => {
    const resource2 = newResource()
    const property = resource2.properties.find(
      (property) => property.key === "Ju0IwOIn3oFsbvgxNZxeI"
    )
    property.values = []
    property.valueKeys = []

    const diff = new ResourceDiffer(resource, resource2).diff
    expect(diff.addedProperties).toEqual([])
    expect(diff.removedProperties).toEqual([])
    expect(diff.changedPropertyDiffs).toHaveLength(1)
    const propertyDiff = diff.changedPropertyDiffs[0]
    expect(propertyDiff.addedValues).toEqual([])
    expect(propertyDiff.removedValues).toHaveLength(1)
    expect(propertyDiff.removedValues[0].key).toEqual("yzD077UWwRFvQN2vzbJFM")
    expect(propertyDiff.changedValues).toEqual([])
    expect(propertyDiff.changedSubjectValueDiffs).toEqual([])
  })

  it("diffs nested added values", () => {
    const resource2 = newResource()
    const property = resource2.properties.find(
      (property) => property.key === "6uklDAA3TijzPsJNCsovJ"
    )
    property.values.push(addedValueSubject)
    property.valueKeys.push(addedValueSubject.key)

    const diff = new ResourceDiffer(resource, resource2).diff
    expect(diff.addedProperties).toEqual([])
    expect(diff.removedProperties).toEqual([])
    expect(diff.changedPropertyDiffs).toHaveLength(1)
    const propertyDiff = diff.changedPropertyDiffs[0]
    expect(propertyDiff.addedValues).toHaveLength(1)
    expect(propertyDiff.addedValues[0].key).toEqual("iQvpJz9nosea5BkXyrOov")
    expect(propertyDiff.removedValues).toEqual([])
    expect(propertyDiff.changedValues).toEqual([])
    expect(propertyDiff.changedSubjectValueDiffs).toEqual([])
  })

  it("diffs nested removed values", () => {
    const resource2 = newResource()
    const property = resource2.properties.find(
      (property) => property.key === "6uklDAA3TijzPsJNCsovJ"
    )
    property.values = property.values.filter(
      (value) => value.key !== "hPvpJz9nosea5BkXyrOou"
    )
    property.valueKeys = ["8y2K463pFNEE630Sgn3tW", "Jy-9cgAg07Za-eebn9aPN"]

    const diff = new ResourceDiffer(resource, resource2).diff
    expect(diff.addedProperties).toEqual([])
    expect(diff.removedProperties).toEqual([])
    expect(diff.changedPropertyDiffs).toHaveLength(1)
    const propertyDiff = diff.changedPropertyDiffs[0]
    expect(propertyDiff.addedValues).toEqual([])
    expect(propertyDiff.removedValues).toHaveLength(1)
    expect(propertyDiff.removedValues[0].key).toEqual("hPvpJz9nosea5BkXyrOou")
    expect(propertyDiff.changedValues).toEqual([])
    expect(propertyDiff.changedSubjectValueDiffs).toEqual([])
  })

  it("diffs nested changed values", () => {
    const resource2 = newResource()
    const property = resource2.properties
      .find((property) => property.key === "6uklDAA3TijzPsJNCsovJ")
      .values.find((value) => value.key === "hPvpJz9nosea5BkXyrOou")
      .valueSubject.properties.find(
        (property) => property.key === "SG0vRsmPIgL0Z6sOqd-w6"
      )
    property.values.push({
      key: "EQYqd1xcBdX9R2efo7Qhx",
      literal: "Uber template2, property1, number2",
      lang: "en",
      uri: null,
      label: null,
      component: "InputLiteralValue",
      propertyKey: "SG0vRsmPIgL0Z6sOqd-w6",
      rootSubjectKey: "vX5R-HZ0W7j9I1kHhGsC1",
      rootPropertyKey: "6uklDAA3TijzPsJNCsovJ",
      valueSubjectKey: null,
      errors: [],
      valueSubject: null,
    })
    property.valueKeys.push("EQYqd1xcBdX9R2efo7Qhx")

    const diff = new ResourceDiffer(resource, resource2).diff
    expect(diff.addedProperties).toEqual([])
    expect(diff.removedProperties).toEqual([])
    expect(diff.changedPropertyDiffs).toHaveLength(1)
    const propertyDiff1 = diff.changedPropertyDiffs[0]
    expect(propertyDiff1.addedValues).toEqual([])
    expect(propertyDiff1.removedValues).toEqual([])
    expect(propertyDiff1.changedValues).toEqual([])
    expect(propertyDiff1.changedSubjectValueDiffs).toHaveLength(1)
    const subjectValueDiff = propertyDiff1.changedSubjectValueDiffs[0]
    expect(subjectValueDiff.addedProperties).toEqual([])
    expect(subjectValueDiff.removedProperties).toEqual([])
    expect(subjectValueDiff.changedPropertyDiffs).toHaveLength(1)
    const propertyDiff2 = subjectValueDiff.changedPropertyDiffs[0]
    expect(propertyDiff2.addedValues).toHaveLength(1)
    expect(propertyDiff2.addedValues[0].key).toEqual("EQYqd1xcBdX9R2efo7Qhx")
    expect(propertyDiff2.removedValues).toEqual([])
    expect(propertyDiff2.changedValues).toEqual([])
    expect(propertyDiff2.changedSubjectValueDiffs).toEqual([])
  })
})

const newResource = () => {
  return _.cloneDeep(resource)
}
