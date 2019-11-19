// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import RDFDisplay from 'components/editor/RDFDisplay'

describe('<RDFDisplay />', () => {
  const rdf = `<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@eng .
<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "bar" .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:Title:AbbrTitle" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle> .
`

  it('renders by default as a table', async () => {
    const {
      getAllByText, findByText, getByText, getByDisplayValue, container,
    } = render(<RDFDisplay rdf={rdf} />)
    expect(await findByText(/Format:/)).toBeInTheDocument()
    // Table is selected.
    expect(getByDisplayValue('Table')).toBeInTheDocument()
    // There is a table
    expect(container.querySelector('table')).toBeInTheDocument()
    // With table headers
    expect(getByText('Subject', 'th')).toBeInTheDocument()
    expect(getByText('Predicate', 'th')).toBeInTheDocument()
    expect(getByText('Object', 'th')).toBeInTheDocument()
    // And table rows
    expect(getAllByText('<>', 'td')).toHaveLength(4)
    expect(getAllByText('http://id.loc.gov/ontologies/bibframe/mainTitle', 'td')).toHaveLength(2)
    expect(getByText('foo [eng]', 'td')).toBeInTheDocument()
    expect(getByText('bar', 'td')).toBeInTheDocument()
  })

  it('renders N-Triples', async () => {
    const { getByLabelText, findByText } = render(<RDFDisplay rdf={rdf} />)
    expect(await findByText(/Format:/)).toBeInTheDocument()

    fireEvent.change(getByLabelText(/Format/), { target: { value: 'n-triples' } })

    expect(await findByText(/<> <http:\/\/id.loc.gov\/ontologies\/bibframe\/mainTitle> "foo"@eng \./)).toBeInTheDocument()
  })

  it('renders Turtle', async () => {
    const { getByLabelText, findByText } = render(<RDFDisplay rdf={rdf} />)
    expect(await findByText(/Format:/)).toBeInTheDocument()

    fireEvent.change(getByLabelText(/Format/), { target: { value: 'turtle' } })

    expect(await findByText(/<> <http:\/\/id.loc.gov\/ontologies\/bibframe\/mainTitle> "foo"@eng, "bar";/)).toBeInTheDocument()
  })

  it('displays errors', async () => {
    const { findByText } = render(<RDFDisplay rdf={`${rdf}x`} />)
    expect(await findByText(/Error: Unexpected "x"/)).toBeInTheDocument()
  })
})
