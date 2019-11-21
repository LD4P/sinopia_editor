import React from 'react'
import LongDate from 'components/LongDate'
import { render } from '@testing-library/react'

describe('<LongDate />', () => {
  it('uses the provided timeZone', async () => {
    const { getByText } = render(<LongDate datetime="2012-09-21" timeZone="UTC"/>)
    expect(getByText('Sep 21, 2012')).toBeInTheDocument()
  })

  it('handles invalid dates', async () => {
    const { container } = render(<LongDate datetime="foo"/>)
    expect(container).toBeEmpty()
  })
})
