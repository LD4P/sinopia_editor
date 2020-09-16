// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import RDFDisplay from 'components/editor/RDFDisplay'
import GraphBuilder from 'GraphBuilder'
import { createState } from 'stateUtils'
import { selectFullSubject, selectCurrentResourceKey } from 'selectors/resources'
import * as dataSetUtils from 'utilities/Utilities'

describe('<RDFDisplay />', () => {
  const state = createState({ hasTwoLiteralResources: true })
  const dataset = new GraphBuilder(selectFullSubject(state, selectCurrentResourceKey(state))).graph

  it('renders by default as a table', async () => {
    const { container } = render(<RDFDisplay dataset={dataset} />)
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
    expect(screen.getAllByText('https://api.sinopia.io/resource/0894a8b3', 'td')).toHaveLength(3)
    expect(screen.getAllByText('http://id.loc.gov/ontologies/bibframe/mainTitle', 'td')).toHaveLength(1)
    screen.getByText('foo [eng]', 'td')
  })

  it('renders N-Triples', async () => {
    render(<RDFDisplay dataset={dataset} />)

    await screen.findByText(/Format:/)

    fireEvent.change(screen.getByLabelText(/Format/), { target: { value: 'n-triples' } })

    await screen.findByText(/<https:\/\/api.sinopia.io\/resource\/0894a8b3> <http:\/\/id.loc.gov\/ontologies\/bibframe\/mainTitle> "foo"@eng \./)
  })

  it('renders Turtle', async () => {
    render(<RDFDisplay dataset={dataset} />)

    await screen.findByText(/Format:/)

    fireEvent.change(screen.getByLabelText(/Format/), { target: { value: 'turtle' } })

    await screen.findByText(/<http:\/\/id.loc.gov\/ontologies\/bibframe\/mainTitle> "foo"@eng./)
  })

  it('renders JSON-LD', async () => {
    render(<RDFDisplay dataset={dataset} />)

    await screen.findByText(/Format:/)

    fireEvent.change(screen.getByLabelText(/Format/), { target: { value: 'jsonld' } })

    await screen.findByText(/"@value": "foo",/)
  }, 10000)

  it('displays errors', async () => {
    jest.spyOn(dataSetUtils, 'jsonldFromDataset').mockRejectedValueOnce(new Error('Alert error'))

    render(<RDFDisplay dataset={dataset} />)

    await screen.findByText(/Format:/)

    fireEvent.change(screen.getByLabelText(/Format/), { target: { value: 'jsonld' } })

    await screen.findByText(/Alert error/)
  })
})
