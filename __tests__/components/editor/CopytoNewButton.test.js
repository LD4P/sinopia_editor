// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import CopyToNewButton from 'components/editor/CopyToNewButton'
import { render } from '@testing-library/react'

test('Link button value of Copy', () => {
  const { queryByText } = render(
    <CopyToNewButton />,
  )
  expect(queryByText('Copy')).toBeInTheDocument()
})
