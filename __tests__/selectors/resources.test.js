import { createState } from 'stateUtils'
import {
  selectSubject, selectProperty, selectValue,
  selectCurrentResource, selectFullSubject, resourceHasChangesSinceLastSave,
} from 'selectors/resources'

describe('selectSubject()', () => {
  it('returns null when no match', () => {
    const state = createState()
    expect(selectSubject(state, 'abc123')).toBeNull()
  })

  it('returns subject', () => {
    const state = createState({ hasResourceWithNestedResource: true })
    expect(selectSubject(state, 'ljAblGiBW')).toBeSubject('ljAblGiBW')
  })
})

describe('selectProperty()', () => {
  it('returns null when no match', () => {
    const state = createState()
    expect(selectProperty(state, 'abc123')).toBeNull()
  })

  it('returns property', () => {
    const state = createState({ hasResourceWithNestedResource: true })
    expect(selectProperty(state, 'v1o90QO1Qx')).toBeProperty('v1o90QO1Qx')
  })
})

describe('selectValue()', () => {
  it('returns null when no match', () => {
    const state = createState()
    expect(selectValue(state, 'abc123')).toBeNull()
  })

  it('returns value', () => {
    const state = createState({ hasResourceWithNestedResource: true })
    const value = selectValue(state, 'VDOeQCnFA8')
    expect(value).toBeValue('VDOeQCnFA8')
    expect(value.index).toBe(1)
  })
})

describe('selectCurrentResource()', () => {
  it('returns null when no current resource', () => {
    const state = createState()
    expect(selectCurrentResource(state)).toBeNull()
  })

  it('returns subject for current resource', () => {
    const state = createState({ hasResourceWithNestedResource: true })
    expect(selectCurrentResource(state)).toBeSubject('ljAblGiBW')
  })
})

describe('selectFullSubject()', () => {
  it('returns null when no match', () => {
    const state = createState()
    expect(selectFullSubject(state, 'abc123')).toBeNull()
  })

  it('returns subject and all descendants', () => {
    const state = createState({ hasResourceWithNestedResource: true })
    const subject = selectFullSubject(state, 'ljAblGiBW')
    expect(subject).toBeSubject('ljAblGiBW')
    expect(subject.properties).toHaveLength(1)
    const property = subject.properties[0]
    expect(property).toBeProperty('v1o90QO1Qx')
    expect(property.values).toHaveLength(1)
    const value = property.values[0]
    expect(value).toBeValue('VDOeQCnFA8')
    const nestedSubject = value.valueSubject
    expect(nestedSubject).toBeSubject('XPb8jaPWo')
    expect(nestedSubject.properties).toHaveLength(1)
    const nestedProperty = nestedSubject.properties[0]
    expect(nestedProperty).toBeProperty('7caLbfwwle')
    expect(nestedProperty.values).toHaveLength(1)
    const nestedValue = nestedProperty.values[0]
    expect(nestedValue).toBeValue('pRJ0lO_mT-')
  })
})

describe('resourceHasChangesSinceLastSave', () => {
  it('returns changed for currentResource if key not provided', () => {
    const state = createState({ hasResourceWithNestedResource: true })
    state.entities.subjects.ljAblGiBW.changed = true
    expect(resourceHasChangesSinceLastSave(state)).toBe(true)
  })
  it('returns changed for provided resource', () => {
    const state = createState({ hasResourceWithNestedResource: true })
    state.entities.subjects.ljAblGiBW.changed = true
    expect(resourceHasChangesSinceLastSave(state, 'ljAblGiBW')).toBe(true)
  })
})
