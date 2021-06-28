// Copyright 2020 Stanford University see LICENSE for license

import { renderApp } from 'testUtils'
import { fireEvent, screen } from '@testing-library/react'
import { featureSetup } from 'featureUtils'

featureSetup()

const rdf = `<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1";
    a <http://id.loc.gov/ontologies/bibframe/Uber1>;
    <http://id.loc.gov/ontologies/bibframe/uber/template1/property7> "Default literal1", "Default literal2";
    <http://id.loc.gov/ontologies/bibframe/uber/template1/property8> <http://sinopia.io/defaultURI1>, <http://sinopia.io/defaultURI2>;
    <http://id.loc.gov/ontologies/bibframe/uber/template1/property20> "Default required literal1", "Default required literal2".
<http://sinopia.io/defaultURI1> <http://www.w3.org/2000/01/rdf-schema#label> "Default URI1".
`

describe('preview RDF after editing', () => {
  it('adds properties and then displays preview RDF model', async () => {
    const { container } = renderApp()

    // Open the editor and then the templates tab
    fireEvent.click(screen.getByText('Linked Data Editor', { selector: 'a' }))
    fireEvent.click(screen.getByText('Resource Templates', { selector: 'a' }))

    // Click an existing resource template
    fireEvent.click(await screen.findByText(/Uber template1/, { selector: 'a' }))

    // Click on the Preview RDF Button
    await screen.findByText(/Uber template1/)
    fireEvent.click(container.querySelector('button[aria-label="Preview RDF"]'))

    // Wait for RDF Preview Modal and selects turtle Format
    await screen.findByText(/RDF Preview/)
    fireEvent.change(screen.getByLabelText('RDF Format Selection'), { target: { value: 'turtle' } })

    // Tests for presence of turtle RDF in the model
    const rdfDisplay = await screen.findByTestId('rdf-display')
    expect(rdfDisplay.textContent).toContain(rdf)
  }, 15000)
})
