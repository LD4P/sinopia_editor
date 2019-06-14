import {
  getPropertyTemplate,
} from './reducers/index'

export default class Validator {
  constructor(state) {
    this.newState = { ...state }
    this.resource = this.newState.resource
  }

  /**
   * @param {Boolean} show if set to true this will force the validations to display
   * @return {Object} a new state with errors added to the 'editor.errors' and
   *    errors added to the resource properties
   */
  validate(show) {
    const errors = []

    Object.keys(this.resource).forEach((resourceTemplateId) => {
      this.predicatesForResourceTemplate(resourceTemplateId).forEach((predicate) => {
        errors.push(...this.validateProperty(resourceTemplateId, predicate))
      })
    })
    this.newState.editor.errors = errors
    if (show) {
      this.newState.editor.displayValidations = show
    }

    return this.newState
  }

  predicatesForResourceTemplate(resourceTemplateId) {
    return Object.keys(this.resource[resourceTemplateId]).filter(val => val !== 'resourceURI')
  }

  /**
   * Check and see if this property is required and if so, if it's filled in.
   * TODO: Recursive validation https://github.com/LD4P/sinopia_editor/issues/720
   * @return {Array} a list of errors for the property
   */
  validateProperty(resourceTemplateId, predicate) {
    const propertyTemplate = getPropertyTemplate({ selectorReducer: this.newState }, resourceTemplateId, predicate)

    if (propertyTemplate.mandatory !== 'true') {
      return [] // The provided property is not required
    }

    const property = this.getProperty(resourceTemplateId, predicate)

    // If it has items > 0 or nested objects then it's valid
    const errors = this.getItems(property).length > 0 ? [] : [{ message: 'Required', path: [resourceTemplateId, predicate], label: propertyTemplate.propertyLabel }]

    property.errors = errors
    return errors
  }

  getProperty(resourceTemplateId, predicate) {
    return this.resource[resourceTemplateId][predicate]
  }

  /**
   * @return {Array} a list of items or nested items
   */
  getItems(property) {
    if ('items' in property) {
      return property.items
    }
    return Object.keys(property).filter(key => key !== 'errors')
  }
}
