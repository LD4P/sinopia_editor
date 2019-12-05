// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import VocabChoice from 'components/editor/diacritics/VocabChoice'
import { render, fireEvent } from '@testing-library/react'

describe('VocabChoice', () => {
  const mockSelectVocabulary = jest.fn()

  it('displays a list of vocabularies', () => {
    const { getByText } = render(<VocabChoice />)
    expect(getByText('Latin')).toBeInTheDocument()
  })

  it('selects a vocabulary when option is clicked', () => {
    const { getByText } = render(<VocabChoice selectVocabulary={mockSelectVocabulary} />)
    fireEvent.click(getByText('Greek Extended'))
    expect(mockSelectVocabulary.mock.calls.length).toBe(1)
  })
})
