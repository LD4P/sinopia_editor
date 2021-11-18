import { isValidURI } from "utilities/Utilities"

export const literalRequiredError = (value, property, propertyTemplate) => {
  const errors = []
  if (
    propertyTemplate.required &&
    value.key === property.valueKeys[0] && // we only check the first property
    (!value.literal || value.literal.length === 0)
  ) {
    errors.push("Literal required")
  }
  return errors
}

export const literalRegexValidationError = (value, propertyTemplate) => {
  const errors = []
  if (
    propertyTemplate.validationRegex !== null &&
    propertyTemplate.validationRegex !== ""
  ) {
    // NOTE: RegExp constructor sanitizes the string argument, so a string of "^\d+$" becomes /^d+$/
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regex = new RegExp(propertyTemplate.validationRegex)
    if (!regex.test(value.literal)) {
      errors.push(
        `Expected '${value.literal}' to match validationRegex '${propertyTemplate.validationRegex}'.`
      )
    }
  }
  return errors
}

export const literalIntegerValidationError = (value, propertyTemplate) => {
  const errors = []
  // because parseInt('88.9') is 88 rather than NaN
  const integerRegex = /^\d+$/
  if (
    propertyTemplate.validationDataType ===
      "http://www.w3.org/2001/XMLSchema#integer" &&
    (!integerRegex.test(value.literal) ||
      Number.isNaN(parseInt(value.literal, 10)))
  )
    errors.push(
      `Expected datatype is 'http://www.w3.org/2001/XMLSchema#integer' but '${value.literal}' is not an integer.`
    )
  return errors
}

export const literalDateTimeValidationError = (value, propertyTemplate) => {
  const errors = []
  // this regex not restrictive enough, but with Date object instantiation, it's good enough
  // eslint-disable-next-line security/detect-unsafe-regex
  const xsdDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?$/
  const isValidXsdDateTime = (value) =>
    xsdDateTimeRegex.test(value) && new Date(value) !== "Invalid Date"

  if (
    propertyTemplate.validationDataType ===
      "http://www.w3.org/2001/XMLSchema#dateTime" &&
    !isValidXsdDateTime(value.literal)
  )
    errors.push(
      `Expected datatype is 'http://www.w3.org/2001/XMLSchema#dateTime' but '${value.literal}' is not of the format 'YYYY-MM-DDThh:mm:ss(.s+)'.`
    )
  return errors
}

export const literalDateTimeStampValidationError = (
  value,
  propertyTemplate
) => {
  const errors = []
  // this regex not restrictive enough, but with Date object instantiation, it's good enough
  const xsdDateTimeStampRegex =
    // eslint-disable-next-line security/detect-unsafe-regex
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?(Z|([+-]\d{2}):\d{2})$/
  const isValidXsdDateTimeStamp = (value) =>
    xsdDateTimeStampRegex.test(value) && new Date(value) !== "Invalid Date"

  if (
    propertyTemplate.validationDataType ===
      "http://www.w3.org/2001/XMLSchema#dateTimeStamp" &&
    !isValidXsdDateTimeStamp(value.literal)
  )
    errors.push(
      `Expected datatype is 'http://www.w3.org/2001/XMLSchema#dateTimeStamp' but '${value.literal}' is not of the format 'YYYY-MM-DDThh:mm:ss(.s+)?(Z|([+-]hh:mm))'.`
    )
  return errors
}

export const uriPropertiesAndValueErrors = (
  value,
  property,
  propertyTemplate
) => {
  const errors = []
  if (value.key === property.valueKeys[0] && propertyTemplate.required) {
    if (!value.uri) errors.push("URI required")
    if (!value.label) errors.push("Label required")
  } else {
    if (value.uri && !value.label) errors.push("Label required")
    if (!value.uri && value.label) errors.push("URI required")
  }
  if (value.uri && !isValidURI(value.uri)) errors.push("Invalid URI")
  return errors
}
