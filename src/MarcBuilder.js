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
  async marc21() {
    //  await Object.keys(this.entities.subjectTemplates).map((subjectKey) => {
    //   getResourceTemplate(subjectKey, 'ld4p').then((response) => {
    //     const resourceTemplate = response.response.body
    //     if ('marcTemplates' in resourceTemplate) {
    //       this.generateMarc(subjectKey, resourceTemplate.marcTemplates)
    //     }
    //   })
    // })
    Object.values(this.entities.subjects).forEach((subject) => {
      console.log(`${subject} ${subject.subjectTemplateKey}`)
    })
    return this.marcRecord
  }

  /**
   * @param (Object) resource from state
   */
  generateMarc(subjectKey, marcTemplates) {
    marcTemplates.forEach((marcMap) => {
      if (marcMap.marcTag === 'LDR') {
        this.updateLeader(marcMap)
      } else if (parseInt(marcMap.marcTag, 10) < 10) {

      } else {
        this.makeDataField(subjectKey, marcMap)
      }
    })
    console.log(this.marcRecord.toString())
    // Object.keys(resource).forEach((rtKey) => {
    //   if (rtKey in this.resourceTemplates) {
    //     this.makeFields(this.resourceTemplates[rtKey], resource)
    //   } else {
    //     Object.keys(resource[rtKey]).forEach((key) => {
    //       const property = resource[rtKey][key]
    //       if (key in this.resourceTemplates) this.makeFields(this.resourceTemplates[key], property)
    //       if (!(_.isEmpty(property) || typeof property === 'string' || 'items' in property)) {
    //         return this.generateMarc(property)
    //       }
    //     })
    //   }
    // })
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

  makeDataField(subjectTemplateKey, mapping) {
    const tag = mapping.marcTag
    if (this.marcRecord.get(tag).length > 0 && mapping.repeatable === 'false') return
    const data = {
      ind1: mapping.indicator0,
      ind2: mapping.indicator1,
      subfields: [],
    }
    const subjects = Object.values(this.entities.subjects).filter((value) => value.subjectTemplateKey === subjectTemplateKey)
    mapping.subfields.forEach((subfield) => {
      const subfieldPropertyKey = `${subjectTemplateKey} > ${subfield.propertyURI}`
      subjects.forEach((subject) => {
        const properties = subject.propertyKeys.reduce((propKey) => {
          const prop = this.entities.properties[propKey]
          if (prop.propertyTemplateKey === subfieldPropertyKey) return prop
        })
        console.log(`Properties are `, properties)
      })
      // const property = resource[subfield.propertyURI] || {}
      // if (Object.keys(property).length < 1) return
      // if (!('items' in property)) {
      //   console.log('ERROR: Need to handle embedded resource templates')
      //   return
      // }
      // const itemValues = Object.values(property.items)
      // if (itemValues.length < 1) return
      // if (subfield.repeatable === 'true') {
      //   itemValues.forEach((item) => {
      //     data.subfields.push({ code: subfield.code, value: this.conversion(subfield, item.content || item.label) })
      //   })
      // } else {
      //   // Use the first value in items
      //   data.subfields.push({ code: subfield.code, value: this.conversion(subfield, itemValues[0].content || itemValues[0].label) })
      // }
    })
    // if (data.subfields.length < 1) return
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

  updateLeader(mapping) {
    const oldLeader = this.marcRecord.leader
    const index = parseInt(mapping.position[0], 10)
    const newLeader = this.setValueAt(oldLeader, index, mapping.constant)
    this.marcRecord.setLeader(newLeader)
  }
}

export default MarcBuilder
