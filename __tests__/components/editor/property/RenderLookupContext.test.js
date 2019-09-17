// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import RenderLookupContext from 'components/editor/property/RenderLookupContext'

const contextPersonResult = {
  uri: 'http://id.loc.gov/rwo/agents/n79021164',
  id: 'n 79021164',
  label: 'Twain, Mark, 1835-1910',
  context: [
    {
      property: 'Preferred label',
      values: [
        'Twain, Mark, 1835-1910',
      ],
    },
    {
      group: 'Dates',
      property: 'Birth date',
      values: [
        '(edtf) 1835-11-30',
      ],
    },
    {
      property: 'Occupation',
      values: [
        'Lecturers',
        'Humorists',
        'Authors',
      ],
    },
  ],
}

const genericResult = {
  uri: 'http://id.loc.gov/rwo/agents/n79021164',
  id: 'n 79021164',
  label: 'Biology',
  context: [

    {
      property: 'Preferred label',
      values: [
        'Biology',
      ],
    },
    {
      property: 'Additional Info',
      values: [
        'Additional Information',
      ],

    },
  ],
}

const discogsResult = {
  uri: 'https://api.discogs.com/masters/144098',
  id: '144098',
  label: 'Frank Sinatra',
  context: {
    'Image URL': [
      'https://imageurl.jpg',
    ],
    Year: [
      '1963',
    ],
    'Record Labels': [
      'Reprise Records',
    ],
    Formats: [
      'Vinyl',
    ],
    Type: [
      'master',
    ],
  },

}

const genreResult = {
  uri: 'http://id.loc.gov/authorities/genreForms/gf2011026181',
  id: 'gf2011026181',
  label: 'Cutout animation films',
  context: [
    {
      property: 'Broader',
      values: [
        {
          uri: 'http://id.loc.gov/authorities/genreForms/gf2011026049',
          id: 'gf2011026049',
          label: 'Animated films',
        },
      ],
    },
  ],
}

const plProps = {
  authURI: 'urn:ld4p:qa:names:person',
  authLabel: 'LOC person [names] (QA)',
  innerResult: contextPersonResult,
  colorClassName: 'context-result-bg',
}

const p2Props = {
  authURI: 'urn:generic',
  authLabel: 'Lookups',
  innerResult: genericResult,
  colorClassName: 'context-result-bg',
}

const p3Props = {
  authURI: 'urn:discogs',
  authLabel: 'Discogs',
  innerResult: discogsResult,
  colorClassName: 'context-result-bg',
}

const p4Props = {
  authURI: 'urn:ld4p:qa:genres',
  authLabel: 'LOC Genre Forms',
  innerResult: genreResult,
  colorClassName: 'context-result-bg',
}


describe('<RenderLookupContext />', () => {
  const wrapper = shallow(<RenderLookupContext.WrappedComponent {...plProps} />)
  it('displays label and additional context with order specified', () => {
    const detailsContainer = wrapper.find('.details-container')
    expect(detailsContainer.length).toEqual(3)
    const label = detailsContainer.at(0)
    expect(label.html()).toMatch('Twain, Mark, 1835-1910')
    const dateDetails = detailsContainer.at(1)
    expect(dateDetails.find('.context-field').html()).toMatch('Birth date')
    expect(dateDetails.html()).toMatch('(edtf) 1835-11-30')
    const details = detailsContainer.at(2)
    expect(details.find('.context-field').contains('Occupation')).toEqual(true)
    expect(details.contains('Lecturers, Humorists, Authors')).toEqual(true)
  })

  const genericWrapper = shallow(<RenderLookupContext.WrappedComponent {...p2Props} />)
  it('displays label additional context when no order specified for context values for that authority', () => {
    const genericContainer = genericWrapper.find('.details-container')
    expect(genericContainer.length).toEqual(2)
    const genericLabel = genericContainer.at(0)
    expect(genericLabel.contains('Biology')).toEqual(true)
    const genericDetails = genericContainer.at(1)
    expect(genericDetails.find('.context-field').contains('Additional Info')).toEqual(true)
    expect(genericDetails.contains('Additional Information')).toEqual(true)
  })

  const discogsWrapper = shallow(<RenderLookupContext.WrappedComponent {...p3Props} />)
  it('displays discogs label and context', () => {
    expect(discogsWrapper.find('img').prop('src')).toEqual('https://imageurl.jpg')
    const discogsDetailsContainer = discogsWrapper.find('.details-container')
    expect(discogsDetailsContainer.contains('Frank Sinatra')).toEqual(true)
    expect(discogsDetailsContainer.contains('(1963)')).toEqual(true)
    expect(discogsDetailsContainer.contains('Reprise Records')).toEqual(true)
    expect(discogsDetailsContainer.contains('Vinyl')).toEqual(true)
    expect(discogsDetailsContainer.find('.type-span').contains('Master')).toEqual(true)
  })

  const genreWrapper = shallow(<RenderLookupContext.WrappedComponent {...p4Props} />)
  it('displays nested object label', () => {
    const genreContainer = genreWrapper.find('.details-container')
    const genreDetails = genreContainer.at(1)
    expect(genreDetails.find('.context-field').contains('Broader')).toEqual(true)
    expect(genreDetails.contains('Animated films')).toEqual(true)
  })
})
