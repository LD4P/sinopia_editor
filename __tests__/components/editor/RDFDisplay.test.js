// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import RDFDisplay from 'components/editor/RDFDisplay'

describe('<RDFDisplay />', () => {
  const rdf = `<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@eng .
<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "bar" .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:Title:AbbrTitle" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle> .
`

  it('renders by default as a table', async () => {
    const { container } = render(<RDFDisplay rdf={rdf} />)
    await screen.findByText(/Format:/)
    // Table is selected.
    screen.getByDisplayValue('Table')
    // There is a table
    expect(container.querySelector('table')).toBeInTheDocument()
    // With table headers
    screen.getByText('Subject', 'th')
    screen.getByText('Predicate', 'th')
    screen.getByText('Object', 'th')
    // And table rows
    expect(screen.getAllByText('<>', 'td')).toHaveLength(4)
    expect(screen.getAllByText('http://id.loc.gov/ontologies/bibframe/mainTitle', 'td')).toHaveLength(2)
    screen.getByText('foo [eng]', 'td')
    screen.getByText('bar', 'td')
  })

  it('renders N-Triples', async () => {
    render(<RDFDisplay rdf={rdf} />)

    await screen.findByText(/Format:/)

    fireEvent.change(screen.getByLabelText(/Format/), { target: { value: 'n-triples' } })

    await screen.findByText(/<> <http:\/\/id.loc.gov\/ontologies\/bibframe\/mainTitle> "foo"@eng \./)
  })

  it('renders Turtle', async () => {
    render(<RDFDisplay rdf={rdf} />)

    await screen.findByText(/Format:/)

    fireEvent.change(screen.getByLabelText(/Format/), { target: { value: 'turtle' } })

    await screen.findByText(/<> <http:\/\/id.loc.gov\/ontologies\/bibframe\/mainTitle> "foo"@eng, "bar";/)
  })

  it('renders JSON-LD', async () => {
    render(<RDFDisplay rdf={rdf} />)

    await screen.findByText(/Format:/)

    fireEvent.change(screen.getByLabelText(/Format/), { target: { value: 'jsondld' } })

    await screen.findByText(/"@value": "foo",/)
  })

  it('displays errors', async () => {
    render(<RDFDisplay rdf={`${rdf}x`} />)

    await screen.findByText(/Unexpected "x"/)
  })
})
