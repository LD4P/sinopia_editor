import { getResourceTemplate, findNode } from 'selectors/resourceSelectors'
import _ from 'lodash'

export default class Validator {
  constructor(selectorReducer) {
    this.selectorReducer = selectorReducer
    this.errorState = {}
    this.errors = []
  }

  /**
   * @return {[Object, Array]} a new redux path-organized error state and an array of messages.
   * For example: [{
   * resource: {
   *     'resourceTemplate:Monograph:Instance': {
   *       'http://id.loc.gov/ontologies/bibframe/title': {
   *         errors: ['Required',],
   *       },
   *     },
   *   },
   * },[{
   *   message: 'Required',
   *   path: ['Instance', 'Title'],
   *   reduxPath: ['resource', 'resourceTemplate:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/title'],
   * }]]
   */
  validate() {
    const resourceTemplateId = _.first(Object.keys(this.selectorReducer.resource))
    const reduxPath = ['resource', resourceTemplateId]
    this.validateResource(reduxPath, [])
    return [this.errorState, this.errors]
  }

  validateResource(reduxPath, labelPath) {
    const resourceTemplateId = reduxPath.slice(-1)[0]
    const resourceTemplate = getResourceTemplate({ selectorReducer: this.selectorReducer }, resourceTemplateId)
    resourceTemplate.propertyTemplates.forEach((propertyTemplate) => {
      const newReduxPath = [...reduxPath, propertyTemplate.propertyURI]
      const newLabelPath = [...labelPath, resourceTemplate.resourceLabel, propertyTemplate.propertyLabel]
      if (propertyTemplate.mandatory === 'true') {
        this.validateMandatoryProperty(newReduxPath, newLabelPath)
      }
      if (!_.isEmpty(propertyTemplate.valueConstraint?.valueTemplateRefs)) {
        this.validateNestedResourceProperty(newReduxPath, newLabelPath, propertyTemplate)
      }
    })
  }

  validateMandatoryProperty(reduxPath, labelPath) {
    const propertyNode = findNode(this.selectorReducer, reduxPath)
    if (propertyNode.items) {
      if (_.isEmpty(propertyNode.items)) this.addError(reduxPath, labelPath, 'Required')
    } else if (_.isEmpty(propertyNode)) {
      this.addError(reduxPath, labelPath, 'Required')
    }
  }

  validateNestedResourceProperty(reduxPath, labelPath, propertyTemplate) {
    const propertyNode = findNode(this.selectorReducer, reduxPath)
    propertyTemplate.valueConstraint.valueTemplateRefs.forEach((resourceTemplateId) => {
      Object.keys(propertyNode).forEach((key) => {
        const newReduxPath = [...reduxPath, key, resourceTemplateId]
        this.validateResource(newReduxPath, labelPath)
      })
    })
  }

  addError(reduxPath, labelPath, error) {
    const node = reduxPath.reduce((obj, key) => obj[key] || (obj[key] = {}), this.errorState)
    if (node.errors === undefined) {
      node.errors = []
    }
    node.errors.push(error)
    this.errors.push(
      { message: error, path: labelPath, reduxPath },
    )
  }
}
