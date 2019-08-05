// Copyright 2019 Stanford University see LICENSE for license

import { isContext } from 'actionCreators/qa'


describe('isContext()', () => {
  // check context property is picked up and when property is not present, method returns false
  it('detects context subproperty in resource template', () => {
    expect(isContext({ subtype: 'context' })).toEqual(true)
  })

  it('detects absence of context subproperty in resource template', () => {
    expect(isContext({})).toBeFalsy()
  })
})
