import React from 'react'
import SearchResultsPaging from 'components/search/SearchResultsPaging'
import { renderWithRedux, createReduxStore } from 'testUtils'
import { fireEvent } from '@testing-library/react'

describe('<SearchResultsPaging />', () => {
  const mockChangePage = jest.fn()

  beforeEach(() => mockChangePage.mockClear())

  it('does not render when no results', () => {
    const store = createReduxStore({ selectorReducer: { search: { totalResults: 0 } } })
    const { queryByText } = renderWithRedux(
      <SearchResultsPaging changePage={jest.fn()} />, store,
    )
    expect(queryByText('First')).not.toBeInTheDocument()
  })

  it('does not render when less than a page of results', () => {
    const store = createReduxStore({ selectorReducer: { search: { totalResults: 5, resultsPerPage: 5 } } })
    const { queryByText } = renderWithRedux(
      <SearchResultsPaging changePage={jest.fn()} />, store,
    )
    expect(queryByText('First')).not.toBeInTheDocument()
  })

  it('renders pages and selects first', () => {
    const store = createReduxStore({ selectorReducer: { search: { totalResults: 25, resultsPerPage: 5, startOfRange: 0 } } })
    const { container, getByText, getByLabelText } = renderWithRedux(
      <SearchResultsPaging changePage={jest.fn()} />, store,
    )
    expect(getByLabelText('first', { selector: 'li:nth-child(1) > button' })).toBeInTheDocument()
    expect(getByLabelText('previous', { selector: 'li:nth-child(2) > button' })).toBeInTheDocument()
    expect(getByText('1', { selector: 'li:nth-child(3) > button' })).toBeInTheDocument()
    expect(getByText('2', { selector: 'li:nth-child(4) > button' })).toBeInTheDocument()
    expect(getByText('3', { selector: 'li:nth-child(5) > button' })).toBeInTheDocument()
    expect(getByText('4', { selector: 'li:nth-child(6) > button' })).toBeInTheDocument()
    expect(getByText('5', { selector: 'li:nth-child(7) > button' })).toBeInTheDocument()
    expect(getByLabelText('next', { selector: 'li:nth-child(8) > button' })).toBeInTheDocument()
    expect(getByLabelText('last', { selector: 'li:nth-child(9) > button' })).toBeInTheDocument()

    expect(container.querySelector('li:nth-child(3)')).toHaveClass('active')
  })
  it('correct page is active', () => {
    const store = createReduxStore({ selectorReducer: { search: { totalResults: 25, resultsPerPage: 5, startOfRange: 12 } } })
    const { container } = renderWithRedux(
      <SearchResultsPaging changePage={jest.fn()} />, store,
    )
    // 3rd page
    expect(container.querySelector('li:nth-child(5)')).toHaveClass('active')
  })
  it('add elipsis at the end of long lists', () => {
    const store = createReduxStore({ selectorReducer: { search: { totalResults: 100, resultsPerPage: 5, startOfRange: 0 } } })
    const { container, getByText, getByLabelText } = renderWithRedux(
      <SearchResultsPaging changePage={jest.fn()} />, store,
    )
    // const pageItems = container.querySelector('ul')
    expect(getByLabelText('first', { selector: 'li:nth-child(1) > button' })).toBeInTheDocument()
    expect(getByLabelText('previous', { selector: 'li:nth-child(2) > button' })).toBeInTheDocument()
    expect(getByText('1', { selector: 'li:nth-child(3) > button' })).toBeInTheDocument()
    expect(getByText('2', { selector: 'li:nth-child(4) > button' })).toBeInTheDocument()
    expect(getByText('3', { selector: 'li:nth-child(5) > button' })).toBeInTheDocument()
    expect(getByText('4', { selector: 'li:nth-child(6) > button' })).toBeInTheDocument()
    expect(getByText('5', { selector: 'li:nth-child(7) > button' })).toBeInTheDocument()
    expect(getByText('6', { selector: 'li:nth-child(8) > button' })).toBeInTheDocument()
    expect(getByText('...', { selector: 'li:nth-child(9)' })).toBeInTheDocument()
    expect(getByText('20', { selector: 'li:nth-child(10) > button' })).toBeInTheDocument()
    expect(getByLabelText('next', { selector: 'li:nth-child(11) > button' })).toBeInTheDocument()
    expect(getByLabelText('last', { selector: 'li:nth-child(12) > button' })).toBeInTheDocument()

    expect(container.querySelector('li:nth-child(3)')).toHaveClass('active')
  })
  it('add elipsis at the beginning of long lists', () => {
    const store = createReduxStore({ selectorReducer: { search: { totalResults: 100, resultsPerPage: 5, startOfRange: 99 } } })
    const { container, getByText, getByLabelText } = renderWithRedux(
      <SearchResultsPaging changePage={jest.fn()} />, store,
    )
    expect(getByLabelText('first', { selector: 'li:nth-child(1) > button' })).toBeInTheDocument()
    expect(getByLabelText('previous', { selector: 'li:nth-child(2) > button' })).toBeInTheDocument()
    expect(getByText('1', { selector: 'li:nth-child(3) > button' })).toBeInTheDocument()
    expect(getByText('...', { selector: 'li:nth-child(4)' })).toBeInTheDocument()
    expect(getByText('15', { selector: 'li:nth-child(5) > button' })).toBeInTheDocument()
    expect(getByText('16', { selector: 'li:nth-child(6) > button' })).toBeInTheDocument()
    expect(getByText('17', { selector: 'li:nth-child(7) > button' })).toBeInTheDocument()
    expect(getByText('18', { selector: 'li:nth-child(8) > button' })).toBeInTheDocument()
    expect(getByText('19', { selector: 'li:nth-child(9) > button' })).toBeInTheDocument()
    expect(getByText('20', { selector: 'li:nth-child(10) > button' })).toBeInTheDocument()
    expect(getByLabelText('next', { selector: 'li:nth-child(11) > button' })).toBeInTheDocument()
    expect(getByLabelText('last', { selector: 'li:nth-child(12) > button' })).toBeInTheDocument()

    expect(container.querySelector('li:nth-child(10)')).toHaveClass('active')
  })
  it('clicking a page goes to page', () => {
    const store = createReduxStore({ selectorReducer: { search: { totalResults: 25, resultsPerPage: 5, startOfRange: 0 } } })
    const { getByText } = renderWithRedux(
      <SearchResultsPaging changePage={mockChangePage} />, store,
    )
    fireEvent.click(getByText('3', { selector: 'li:nth-child(5) > button' }))
    expect(mockChangePage).toHaveBeenCalledWith(10)
  })
  it('clicking first goes to first page', () => {
    const store = createReduxStore({ selectorReducer: { search: { totalResults: 25, resultsPerPage: 5, startOfRange: 10 } } })
    const { getByLabelText } = renderWithRedux(
      <SearchResultsPaging changePage={mockChangePage} />, store,
    )
    fireEvent.click(getByLabelText('first'))
    expect(mockChangePage).toHaveBeenCalledWith(0)
  })
  it('clicking last goes to last page', () => {
    const store = createReduxStore({ selectorReducer: { search: { totalResults: 25, resultsPerPage: 5, startOfRange: 10 } } })
    const { getByLabelText } = renderWithRedux(
      <SearchResultsPaging changePage={mockChangePage} />, store,
    )
    fireEvent.click(getByLabelText('last'))
    expect(mockChangePage).toHaveBeenCalledWith(20)
  })
  it('clicking previous goes to previous page', () => {
    const store = createReduxStore({ selectorReducer: { search: { totalResults: 25, resultsPerPage: 5, startOfRange: 10 } } })
    const { getByLabelText } = renderWithRedux(
      <SearchResultsPaging changePage={mockChangePage} />, store,
    )
    fireEvent.click(getByLabelText('previous'))
    expect(mockChangePage).toHaveBeenCalledWith(5)
  })
  it('clicking next goes to next page', () => {
    const store = createReduxStore({ selectorReducer: { search: { totalResults: 25, resultsPerPage: 5, startOfRange: 10 } } })
    const { getByLabelText } = renderWithRedux(
      <SearchResultsPaging changePage={mockChangePage} />, store,
    )
    fireEvent.click(getByLabelText('next'))
    expect(mockChangePage).toHaveBeenCalledWith(15)
  })
})
