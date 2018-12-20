import generateRDF from '../../src/reducers/rdf'

describe('generateRDF reducer', () => {
  it('should handle initial state', () => {
    expect(
      generateRDF(undefined, {})
    ).toEqual({ "graph": null})
  })
})
