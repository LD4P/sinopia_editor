import { pretty } from "./matcherUtils"

// Goal with these matchers is to make tests more resilient to changes in resource model.
expect.extend({
  toBeSubject(subject, subjectKey) {
    if (typeof subjectKey !== "string") {
      throw new Error("expected subjectKey to be a string")
    }

    if (subject == null || subject.key !== subjectKey) {
      return {
        pass: false,
        message: () =>
          `Expected ${pretty(subject)} to be subject ${subjectKey}`,
      }
    }

    if (subject.subjectTemplate == null) {
      return {
        pass: false,
        message: () =>
          `Expected ${pretty(subject)} to have subjectTemplate property.`,
      }
    }

    if (
      subject.properties == null ||
      subject.properties.length !== subject.propertyKeys.length
    ) {
      return {
        pass: false,
        message: () =>
          `Expected ${pretty(subject)} to have properties ${
            subject.propertyKeys
          }.`,
      }
    }

    return {
      pass: true,
      message: () =>
        `Expected ${pretty(subject)} not to be subject ${subjectKey}`,
    }
  },
  toBeProperty(property, propertyKey) {
    if (typeof propertyKey !== "string") {
      throw new Error("expected propertyKey to be a string")
    }

    if (property == null || property.key !== propertyKey) {
      return {
        pass: false,
        message: () =>
          `Expected ${pretty(property)} to be property ${propertyKey}`,
      }
    }

    if (property.propertyTemplate == null) {
      return {
        pass: false,
        message: () =>
          `Expected ${pretty(property)} to have propertyTemplate property.`,
      }
    }

    if (property.valueKeys == null && property.values != null) {
      return {
        pass: false,
        message: () => `Expected ${pretty(property)} to have null values.`,
      }
    }

    if (property.valueKeys.length !== property.values.length) {
      return {
        pass: false,
        message: () =>
          `Expected ${pretty(property)} to have values ${property.valueKeys}.`,
      }
    }

    if (property.subject == null) {
      return {
        pass: false,
        message: () => `Expected ${pretty(property)} to have subject property.`,
      }
    }

    if (property.subject.subjectTemplate == null) {
      return {
        pass: false,
        message: () =>
          `Expected ${pretty(
            property
          )} to have subject with subjectTemplate property.`,
      }
    }

    return {
      pass: true,
      message: () =>
        `Expected ${pretty(property)} not to be property ${propertyKey}`,
    }
  },
  toBeValue(value, valueKey) {
    if (typeof valueKey !== "string") {
      throw new Error("expected valueKey to be a string")
    }

    if (value == null || value.key !== valueKey) {
      return {
        pass: false,
        message: () => `Expected ${pretty(value)} to be value ${valueKey}`,
      }
    }

    if (value.property == null) {
      return {
        pass: false,
        message: () => `Expected ${pretty(value)} to have property.`,
      }
    }

    if (value.valueSubjectKey != null && value.valueSubject == null) {
      return {
        pass: false,
        message: () =>
          `Expected ${pretty(value)} to have valueSubject ${
            value.valueSubjectKey
          }.`,
      }
    }

    return {
      pass: true,
      message: () => `Expected ${pretty(value)} not to be value ${valueKey}`,
    }
  },
})
