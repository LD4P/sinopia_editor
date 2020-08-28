// Copyright 2020 Stanford University see LICENSE for license

import { renderApp } from 'testUtils'
import { fireEvent, screen } from '@testing-library/react'
import Config from 'Config'

global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })

jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property7> "Default literal1", "Default literal2";
    <http://id.loc.gov/ontologies/bibframe/uber/template1/property8> <http://sinopia.io/defaultURI1>, <http://sinopia.io/defaultURI2>;
    <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1";
    a <http://id.loc.gov/ontologies/bibframe/Uber1>.
<http://sinopia.io/defaultURI1> <http://www.w3.org/2000/01/rdf-schema#label> "Default URI1".`

describe('preview RDF after editing', () => {
  it('adds properties and then displays preview RDF model', async () => {
    renderApp()

    // Open the editor and then the templates tab
    fireEvent.click(screen.getByRole('link', { name: 'Linked Data Editor' }))
    fireEvent.click(screen.getByRole('link', { name: 'Resource Templates' }))

    // Click an existing resource template
    await screen.findByText(/Uber template1/)
    fireEvent.click(screen.getByRole('link', { name: 'Uber template1' }))

    // Click on the Preview RDF Button
    await screen.findByText(/Uber template1/)
    fireEvent.click(screen.getAllByRole('button', { name: 'Preview RDF' })[0])

    // Wait for RDF Preview Modal and selects turtle Format
    await screen.findByText(/RDF Preview/)
    fireEvent.change(screen.getByRole('combobox', { name: 'RDF Format Selection' }),
      { target: { value: 'turtle' } })

    // Tests for presence of turtle RDF in the model
    const rdfDisplay = await screen.findByTestId('rdf-display')
    expect(rdfDisplay.textContent).toContain(rdf)
  })
})
