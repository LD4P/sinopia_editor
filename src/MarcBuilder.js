// Copyright 2020 Stanford University see LICENSE for license

import _ from 'lodash'
import Record from 'marc-record-js'

class MarcBuilder {
  /**
   * @param {Object} state Redux state to be converted to MARC21 record
   * @param {Object} record optional MARC21 record
   */
  constructor(state, record = null) {
    this.entities = state?.selectorReducer?.entities
    this.resourceTemplates = {}
    Object.values(this.entities?.resourceTemplates || {})
      .forEach((resourceTemplate) => {
        if ('marcTemplates' in resourceTemplate) {
          this.resourceTemplates[resourceTemplate.id] = resourceTemplate.marcTemplates
        }
      })
    this.marcRecord = record || new Record()
    this.marcRecord.setLeader('     nam a22     uu 4500')
  }

  /**
   * @return {Record} a MARC21 record that represents the data in the state
   */
  get marc21() {
    const resources = this.entities?.resources ? this.entities.resources : {}
    Object.values(resources).forEach((resource) => {
      this.generateMarc(resource)
    })
    return this.marcRecord
  }

  /**
   * @param (Object) resource from state
   */
  generateMarc(resource) {
    Object.keys(resource).forEach((rtKey) => {
      if (rtKey in this.resourceTemplates) {
        this.makeFields(this.resourceTemplates[rtKey], resource)
      } else {
        Object.keys(resource[rtKey]).forEach((key) => {
          const property = resource[rtKey][key]
          if (key in this.resourceTemplates) this.makeFields(this.resourceTemplates[key], property)
          if (!(_.isEmpty(property) || typeof property === 'string' || 'items' in property)) {
            return this.generateMarc(property)
          }
        })
      }
    })
  }

  makeFields(resourceTemplate, resource) {
    resourceTemplate.forEach((mapping) => {
      if (parseInt(mapping.marcTag, 10) < 10) {
        this.makeControlField(resource, mapping)
      } else {
        this.makeDataField(resource, mapping)
      }
    })
  }

  makeControlField(resource, mapping) {
    const tag = mapping.marcTag
    if (this.marcRecord.get(mapping.marcTag) && mapping.repeatable === 'false') return
    const data = {}
    if ('constant' in mapping) {
      const value = this.setValueAt(' ', mapping.position, mapping.constant)
      data.value = value
    }
    if ('conversion' in mapping) {
      const regEx = new RegExp(mapping.conversion)
      data.value = regEx.replace(data.value)
    }
    console.log(`Before control field `, data)
    this.marcRecord.insertControlField({ tag, ...data })
  }

  makeDataField(resource, mapping) {
    const tag = mapping.marcTag
    if (this.marcRecord.get(tag).length > 0 && mapping.repeatable === 'false') return
    const data = {
      ind1: mapping.indicator0,
      ind2: mapping.indicator1,
      subfields: [],
    }
    mapping.subfields.forEach((subfield) => {
      const property = resource[subfield.propertyURI] || {}
      if (Object.keys(property).length < 1) return
      if (!('items' in property)) {
        console.log('ERROR: Need to handle embedded resource templates')
        return
      }
      const itemValues = Object.values(property.items)
      if (itemValues.length < 1) return
      if (subfield.repeatable === 'true') {
        itemValues.forEach((item) => {
          data.subfields.push({ code: subfield.code, value: this.conversion(subfield, item.content || item.label) })
        })
      } else {
        // Use the first value in items
        data.subfields.push({ code: subfield.code, value: this.conversion(subfield, itemValues[0].content || itemValues[0].label) })
      }
    })
    if (data.subfields.length < 1) return
    this.marcRecord.insertField({ tag, ...data })
  }

  conversion(subfield, content) {
    if (!('conversion' in subfield)) return content
    const regex = new RegExp(`${subfield.conversion}`)
    return regex.replace(content)
  }

  setValueAt(string, index, value) {
    if (index > string.length-1) return string
    return string.substring(0,index) + value + string.substring(index+1)
  }
}

export default MarcBuilder
