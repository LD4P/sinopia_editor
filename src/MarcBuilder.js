// Copyright 2020 Stanford University see LICENSE for license

import _ from 'lodash'
import Record from 'marc-record-js'
import { getResourceTemplate } from 'sinopiaServer'

class MarcBuilder {
  /**
   * @param {Object} state Redux state to be converted to MARC21 record
   * @param {Object} record optional MARC21 record
   */
  constructor(state) {
    this.entities = state?.selectorReducer?.entities
    this.marcRecord = new Record()
    this.marcRecord.leader = '                        '
  }

  /**
   * @return {Record} a MARC21 record that represents the data in the state
   */
  get marc21() {
    Object.values(this.entities.subjects).forEach((subject) => {
      this.generateMarc(subject)
    })
    return this.marcRecord
  }

  /**
   * @param (Object) subject from state
   */
  generateMarc(subject) {
    const subjectTemplate = this.entities.subjectTemplates[subject.subjectTemplateKey]
    subjectTemplate.marcTemplates?.forEach((marcTemplate) => {
      if (marcTemplate.marcTag === 'LDR') {
        this.updateLeader(marcTemplate)
      } else if (parseInt(marcTemplate.marcTag, 10) < 10) {
        this.makeControlField(subject, marcTemplate)
      } else {
        this.makeDataField(subject, marcTemplate)
      }
    })
  }

  makeControlField(subject, marcTemplate) {
    const controlField = { tag: marcTemplate.marcTag, value: [] }
    const value = this.getControlFieldValue(subject, marcTemplate)
    marcTemplate.positions?.forEach((position) => {
      const positionAt = parseInt(position.at, 10)
      if (controlField.value.length < 1) {
        controlField.value = new Array(positionAt).fill('')
      }
      if ('constant' in position) {
        controlField.value[positionAt] = position.constant
      } else if(!_.isEmpty(value)) {
        controlField.value[positionAt] = value[parseInt(position.source, 10)]
      }
    })
    const existingFields = this.marcRecord.get(marcTemplate.marcTag)
    controlField.value = _.join(controlField.value, ' ')
    if (existingFields.length > 0 && marcTemplate.repeatable === 'false') {
      const combinedValue = this.mergeFieldValues(existingFields[0].value,
                                                  controlField.value)
      delete existingFields[0]


    }
    if(!_.isEmpty(controlField.value)) this.marcRecord.insertControlField(controlField)
  }

  getControlFieldValue(subject, marcTemplate) {
    let value = undefined
    if ('propertyURI' in marcTemplate) {
      const propertyTemplateKey = `${subject.subjectTemplateKey} > ${marcTemplate.propertyURI}`
      subject.propertyKeys?.forEach((propKey) => {
        const property = this.entities.properties[propKey]
        if (property.propertyTemplateKey === propertyTemplateKey) {
          property.valueKeys?.forEach((valueKey) => {
            value = this.entities.values[valueKey].literal
          })
        }
      })
    }
    return value
  }

  mergeFieldValues(existingValue, newValue) {
    let largerChars = undefined
    let smallerChars = undefined
    console.log(existingValue, newValue)
    if (existingValue.length >= newValue.length) {
      largerChars = existingValue.split('')
      smallerChars = newValue.split('')
    } else {
      largerChars = newValue.split('')
      smallerChars = existingValue.split('')
    }
    let count = 0
    let combinedChars = ''
    largerChars.forEach((char) => {
      if (char === ' ' && smallerChars[count] !== ' ') {
        combinedChars += smallerChars[count]
      } else {
        combinedChars += char
      }
      count += 1
    })
    console.log(`Before join call`, combinedChars)
    return combinedChars
    // return _.join(combinedChars)
  }

  makeDataField(subject, marcTemplate) {
    const tag = marcTemplate.marcTag
    if (this.marcRecord.get(tag).length > 0 && marcTemplate.repeatable === 'false') return
    const data = {
      ind1: marcTemplate.indicator0,
      ind2: marcTemplate.indicator1,
      subfields: []
    }
    subject.propertyKeys.forEach((propertyKey) => {
      const property = this.entities.properties[propertyKey]
      const propertyTemplate = this.entities.propertyTemplates[property.propertyTemplateKey]
      propertyTemplate.marcSubfields?.forEach((subfield) => {
        if (subfield.marcTag === tag) {
          property.valueKeys?.forEach((valueKey) => {
            const value = this.entities.values[valueKey]
            //! Need to restrict when repeatable is false
            const marcValue = this.getDataFieldValue(subfield, value)
            if (!_.isEmpty(marcValue)) {
              data.subfields.push({ code: subfield.code, value: marcValue })
            }
          })
        }
      })
    })
    if(!_.isEmpty(data.subfields)) this.marcRecord.insertField({ tag, ...data })
  }

  getDataFieldValue(subfield, value) {
    // Can be literal, uri, or label
    if ('valueSource' in subfield) {
      return this.conversion(subfield, value[subfield.valueSource])
    }
    return this.conversion(subfield, value.literal || value.label)
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

  updateLeader(mapping) {
    const oldLeader = this.marcRecord.leader
    const index = parseInt(mapping.position[0], 10)
    const newLeader = this.setValueAt(oldLeader, index, mapping.constant)
    this.marcRecord.setLeader(newLeader)
  }
}

export default MarcBuilder
