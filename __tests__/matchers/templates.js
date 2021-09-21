import { pretty } from "./matcherUtils"

// Goal with these matchers is to make tests more resilient to changes in template model.
expect.extend({
  toBeSubjectTemplate(subjectTemplate, subjectTemplateKey) {
    if (typeof subjectTemplateKey !== "string") {
      throw new Error("expected subjectTemplateKey to be a string")
    }

    // Make sure the keys match and this is a subject template (indicated by having class)
    if (
      subjectTemplate == null ||
      subjectTemplate.key !== subjectTemplateKey ||
      subjectTemplate.class === undefined
    ) {
      return {
        pass: false,
        message: () =>
          `Expected ${pretty(
            subjectTemplate
          )} to be subject template ${subjectTemplateKey}`,
      }
    }

    return {
      pass: true,
      message: () =>
        `Expected ${pretty(
          subjectTemplate
        )} not to be subject template ${subjectTemplateKey}`,
    }
  },
  toBePropertyTemplate(propertyTemplate, propertyTemplateKey) {
    if (typeof propertyTemplateKey !== "string") {
      throw new Error("expected propertyTemplateKey to be a string")
    }

    if (!equalsPropertyTemplate(propertyTemplate, propertyTemplateKey)) {
      return {
        pass: false,
        message: () =>
          `Expected ${pretty(
            propertyTemplate
          )} to be property template ${propertyTemplateKey}`,
      }
    }

    return {
      pass: true,
      message: () =>
        `Expected ${pretty(
          propertyTemplate
        )} not to be property template ${propertyTemplateKey}`,
    }
  },
  toBePropertyTemplates(propertyTemplates, propertyTemplateKeys) {
    if (!Array.isArray(propertyTemplateKeys)) {
      throw new Error("expected propertyTemplateKeys to be an array")
    }

    if (propertyTemplates.length !== propertyTemplateKeys.length) {
      return {
        pass: false,
        message: () =>
          `Expected ${pretty(propertyTemplates)} to have length ${
            propertyTemplateKeys.length
          }`,
      }
    }

    if (
      !propertyTemplates.every((propertyTemplate, index) =>
        equalsPropertyTemplate(propertyTemplate, propertyTemplateKeys[index])
      )
    ) {
      return {
        pass: false,
        message: () =>
          `Expected ${pretty(
            propertyTemplates
          )} to be property templates ${propertyTemplateKeys}`,
      }
    }

    return {
      pass: true,
      message: () =>
        `Expected ${pretty(
          propertyTemplates
        )} not to be property template ${propertyTemplateKeys}`,
    }
  },
})

// Make sure the keys match and this is a property template (indicated by having a subject template key)
const equalsPropertyTemplate = (propertyTemplate, propertyTemplateKey) =>
  propertyTemplate.key === propertyTemplateKey &&
  propertyTemplate.subjectTemplateKey !== undefined
