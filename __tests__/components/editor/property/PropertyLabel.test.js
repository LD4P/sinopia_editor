// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import PropertyLabel from 'components/editor/property/PropertyLabel'
import { render } from '@testing-library/react'


test('when the propertyTemplate has no remark and just a label', () => {
  const props = {
    propertyTemplate: {
      propertyLabel: 'Example RDA',
    },
  }

  const { queryByText } = render(
    <PropertyLabel {...props} />,
  )
  expect(queryByText('Example RDA')).toBeInTheDocument()
})

test('does not have the RequiredSuperscript component if property: mandatory is undefined', () => {
  const props = {
    propertyTemplate: {
      remark: 'http://access.rdatoolkit.org/example',
      propertyLabel: 'Example RDA',
    },
  }

  const { container } = render(
    <PropertyLabel {...props} />,
  )
  expect(container.querySelector('sup')).not.toBeInTheDocument()
})

test('does not have the RequiredSuperscript component if property: mandatory is false', () => {
  const props = {
    propertyTemplate: {
      propertyLabel: 'Example RDA',
      mandatory: 'false',
    },
  }

  const { container } = render(
    <PropertyLabel {...props} />,
  )
  expect(container.querySelector('sup')).not.toBeInTheDocument()
})

test('has the RequiredSuperscript component if property: mandatory is true', () => {
  const props = {
    propertyTemplate: {
      propertyLabel: 'Example RDA',
      mandatory: 'true',
    },
  }

  const { container } = render(
    <PropertyLabel {...props} />,
  )
  expect(container.querySelector('sup')).toBeInTheDocument()
})
