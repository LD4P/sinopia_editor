// Copyright 2020 Stanford University see LICENSE for license

import MarcBuilder from 'MarcBuilder'

describe('builds a MARC21 record', () => {


  it('generates an empty MARC 21 record with a leader', () => {
    const builder = new MarcBuilder()
    const record = builder.marc21
    expect(record.leader).toBe("     nam a22     uu 4500")
  })

  describe('from Redux state', () => {
    const builder = new MarcBuilder(store.getState())
    const record = builder.marc21

    it('generates a 020 field', () => {
      expect(record.containsFieldWithValue('020', 'a', '0491001304')).toBe(true)

    })

    it('generates a 245 field', () => {
      console.log(record.toString())
      expect(record.containsFieldWithValue('245', 'a', 'Moby Dick', 'n', 'First')).toBe(true)
    })
  })
})
