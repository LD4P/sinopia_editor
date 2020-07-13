import { createState } from 'stateUtils'
import { selectHistoricalTemplates, selectSubjectAndPropertyTemplates } from 'selectors/templates'

describe('selectHistoricalTemplates()', () => {
  it('returns empty when no historical templates', () => {
    const state = createState()
    expect(selectHistoricalTemplates(state)).toHaveLength(0)
  })

  it('returns templates', () => {
    const state = createState({ hasResourceWithLiteral: true })
    state.selectorReducer.historicalTemplates = ['ld4p:RT:bf2:Title:AbbrTitle']

    const templates = selectHistoricalTemplates(state)
    expect(templates).toHaveLength(1)
    expect(templates[0]).toBeSubjectTemplate('ld4p:RT:bf2:Title:AbbrTitle')
  })
})

describe('selectSubjectAndPropertyTemplates()', () => {
  it('returns null when no subject', () => {
    const state = createState()
    expect(selectSubjectAndPropertyTemplates(state, 'abc123')).toEqual([null, []])
  })

  it('returns templates', () => {
    const state = createState({ hasResourceWithLiteral: true })
    const [subjectTemplate, propertyTemplates] = selectSubjectAndPropertyTemplates(state, 'ld4p:RT:bf2:Title:AbbrTitle')
    expect(subjectTemplate).toBeSubjectTemplate('ld4p:RT:bf2:Title:AbbrTitle')
    expect(propertyTemplates).toBePropertyTemplates(['ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle'])
  })
})
