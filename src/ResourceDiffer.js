import _ from "lodash"

/**
 * Determines diffs between resources.
 */
export default class ResourceDiffer {
  constructor(resource1, resource2) {
    this.resource1 = resource1
    this.resource2 = resource2
    this.resourceDiff
  }

  get diff() {
    if (!this.resourceDiff)
      this.resourceDiff = this.diffSubject(this.resource1, this.resource2)
    return this.resourceDiff
  }

  diffSubject(subject1, subject2) {
    const addedProperties = []
    const removedProperties = []
    const matchedProperties = []

    subject1.properties.forEach((property) => {
      const matchedProperty = this.findMatchedProperty(
        subject2,
        property.propertyTemplateKey
      )
      if (!matchedProperty || (property.values && !matchedProperty.values)) {
        removedProperties.push(property)
      } else if (property.values && matchedProperty.values) {
        matchedProperties.push([property, matchedProperty])
      }
    })
    subject2.properties.forEach((property) => {
      const matchedProperty = this.findMatchedProperty(
        subject1,
        property.propertyTemplateKey
      )
      if (!matchedProperty || (property.values && !matchedProperty.values)) {
        addedProperties.push(property)
      }
    })

    const changedPropertyDiffs = []
    const sameProperties = []
    const similarProperties = []
    matchedProperties.forEach(([property1, property2]) => {
      const propertyDiff = this.diffProperty(property1, property2)
      if (
        !_.isEmpty(propertyDiff.addedValues) ||
        !_.isEmpty(propertyDiff.removedValues) ||
        !_.isEmpty(propertyDiff.changedValues) ||
        !_.isEmpty(propertyDiff.changedSubjectValueDiffs)
      ) {
        changedPropertyDiffs.push(propertyDiff)
        if (!_.isEmpty(propertyDiff.sameValues))
          similarProperties.push([property1, property2])
      } else {
        sameProperties.push([property1, property2])
      }
    })

    return {
      key: subject1.key,
      subjectTemplate: subject1.subjectTemplate,
      addedProperties,
      removedProperties,
      changedPropertyDiffs,
      sameProperties,
      similarProperties,
    }
  }

  findMatchedProperty(subject, propertyTemplateKey) {
    return subject.properties.find(
      (property) => property.propertyTemplateKey === propertyTemplateKey
    )
  }

  diffProperty(property1, property2) {
    const addedValues = []
    const removedValues = []
    const matchedValues = []

    const property1Values = property1.values || []
    property1Values.forEach((value) => {
      const matchedValue = this.findMatchedValue(property2, value)
      if (matchedValue) {
        matchedValues.push([value, matchedValue])
      } else if (!this.isEmptyValue(value)) {
        removedValues.push(value)
      }
    })

    const property2Values = property2.values || []
    property2Values.forEach((value) => {
      const matchedValue = this.findMatchedValue(property1, value)
      if (!matchedValue && !this.isEmptyValue(value)) {
        addedValues.push(value)
      }
    })

    const changedValues = []
    const changedSubjectValueDiffs = []
    const sameValues = []
    matchedValues.forEach(([value1, value2]) => {
      if (value1.valueSubject) {
        const subjectDiff = this.diffSubject(
          value1.valueSubject,
          value2.valueSubject
        )
        if (
          !_.isEmpty(subjectDiff.addedProperties) ||
          !_.isEmpty(subjectDiff.removedProperties) ||
          !_.isEmpty(subjectDiff.changedPropertyDiffs)
        ) {
          changedSubjectValueDiffs.push(subjectDiff)
        } else {
          sameValues.push([value1, value2])
        }
      } else if (value1.label !== value2.label || value1.lang !== value2.lang) {
        // Already know that literal and uri match
        changedValues.push([value1, value2])
      } else {
        sameValues.push([value1, value2])
      }
    })

    return {
      key: property1.key,
      addedValues,
      removedValues,
      changedValues,
      changedSubjectValueDiffs,
      sameValues,
      propertyTemplate: property1.propertyTemplate,
    }
  }

  findMatchedValue(property, matchValue) {
    const values = property.values || []
    return values.find((value) => {
      // For value subjects, match if subject template is the same and at least one property matches or is similar.
      if (matchValue.valueSubject) {
        const subjectDiff = this.diffSubject(
          value.valueSubject,
          matchValue.valueSubject
        )
        return (
          value.valueSubject.subjectTemplateKey ===
            matchValue.valueSubject.subjectTemplateKey &&
          (!_.isEmpty(subjectDiff.sameProperties) ||
            !_.isEmpty(subjectDiff.similarProperties))
        )
      }
      return (
        value.uri === matchValue.uri && value.literal === matchValue.literal
      )
    })
  }

  isEmptyValue(value) {
    return (
      _.isEmpty(value.literal) && _.isEmpty(value.uri) && !value.valueSubject
    )
  }
}
