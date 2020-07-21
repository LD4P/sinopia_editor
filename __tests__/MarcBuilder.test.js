// Copyright 2020 Stanford University see LICENSE for license

import MarcBuilder from 'MarcBuilder'
import { createState } from 'stateUtils'

describe('builds a MARC21 record', () => {

  it('generates an empty MARC 21 record with a leader', () => {
    const builder = new MarcBuilder()
    expect(builder.marcRecord.leader.length).toBe(24)
  })

  describe('from  state', () => {

    it('generates a 020 field', () => {
      // expect(record.containsFieldWithValue('020', 'a', '0491001304')).toBe(true)

    })

    it('generates a 245 field', () => {
      // expect(record.containsFieldWithValue('245', 'a', 'Moby Dick', 'n', 'First')).toBe(true)
    })
  })
})

describe('makeControlField()', () => {

  it('with a single constant', () => {
    const builder = new MarcBuilder()
    builder.makeControlField({}, {
      marcTag: '008',
      repeatable: 'false',
      positions: [
        {
          at: '06',
          constant: 's'
        }
      ]
    })
    expect(builder.marcRecord.get('008')[0].value).toBe('      s')
  })

  it('with a multiple constants', () => {
    const builder = new MarcBuilder()
    builder.makeControlField({}, {
      marcTag: '008',
      repeatable: 'false',
      positions: [
        {
          at: '06',
          constant: 's'
        },
        {
          at: '39',
          constant: 'd'
        }
      ]
    })
    expect(builder.marcRecord.get('008')[0].value).toBe('      s                                 d')
  })

  it('value from state', () => {
    const state = createState({ hasResourceWithLiteral: true })
    // Changing value to a number to extract a date
    state.selectorReducer.entities.values['CxGx7WMh2'].literal = '2020'
    const builder = new MarcBuilder(state)
    builder.makeControlField(state.selectorReducer.entities.subjects['t9zVwg2zO'], {
      marcTag: '008',
      repeatable: 'false',
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
      positions: [
        {
          at: '07',
          source: '00'
        },
        {
          at: '08',
          source: '01'
        }
      ]
    })
    expect(builder.marcRecord.get('008')[0].value).toBe('       2 0')
  })
})

describe('mergeFieldValues()', () => {

  it('takes two string with spaces and merges', () => {
    const builder = new MarcBuilder()
    const valueString = builder.mergeFieldValues('2002   a', '    df')
    expect(valueString).toEqual('2002df a')
  })

})
