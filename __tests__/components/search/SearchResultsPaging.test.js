import React from 'react'
import SearchResultsPaging from 'components/search/SearchResultsPaging'
import { fireEvent, screen } from '@testing-library/react'
import { createStore, renderComponent } from 'testUtils'
import { createState } from 'stateUtils'

describe('<SearchResultsPaging />', () => {
  const mockChangePage = jest.fn()

  beforeEach(() => mockChangePage.mockClear())

  const createInitialState = (totalResults, resultsPerPage, startOfRange) => {
    const state = createState()
    return {
      ...state,
      search: {
        resource: {
          totalResults,
          options: {
            resultsPerPage,
            startOfRange,
          },
        },
      },
    }
  }

  it('does not render when no results', () => {
    renderComponent(<SearchResultsPaging changePage={jest.fn()} searchType="resource" />)
    expect(screen.queryByText('First')).not.toBeInTheDocument()
  })

  it('does not render when less than a page of results', () => {
    const store = createStore(createInitialState(5, 5, 0))
    renderComponent(<SearchResultsPaging changePage={jest.fn()} searchType="resource" />, store)
    expect(screen.queryByText('First')).not.toBeInTheDocument()
  })

  it('renders pages and selects first', () => {
    const store = createStore(createInitialState(25, 5, 0))
    const { container } = renderComponent(
      <SearchResultsPaging changePage={jest.fn()} searchType="resource" />, store,
    )
    screen.getByLabelText('first', { selector: 'li:nth-child(1) > button' })
    screen.getByLabelText('previous', { selector: 'li:nth-child(2) > button' })
    screen.getByText('1', { selector: 'li:nth-child(3) > button' })
    screen.getByText('2', { selector: 'li:nth-child(4) > button' })
    screen.getByText('3', { selector: 'li:nth-child(5) > button' })
    screen.getByText('4', { selector: 'li:nth-child(6) > button' })
    screen.getByText('5', { selector: 'li:nth-child(7) > button' })
    screen.getByLabelText('next', { selector: 'li:nth-child(8) > button' })
    screen.getByLabelText('last', { selector: 'li:nth-child(9) > button' })

    expect(container.querySelector('li:nth-child(3)')).toHaveClass('active')
  })
  it('correct page is active', () => {
    const store = createStore(createInitialState(25, 5, 12))
    const { container } = renderComponent(
      <SearchResultsPaging changePage={jest.fn()} searchType="resource" />, store,
    )
    // 3rd page
    expect(container.querySelector('li:nth-child(5)')).toHaveClass('active')
  })
  it('add elipsis at the end of long lists', () => {
    const store = createStore(createInitialState(100, 5, 0))
    const { container } = renderComponent(
      <SearchResultsPaging changePage={jest.fn()} searchType="resource" />, store,
    )
    screen.getByLabelText('first', { selector: 'li:nth-child(1) > button' })
    screen.getByLabelText('previous', { selector: 'li:nth-child(2) > button' })
    screen.getByText('1', { selector: 'li:nth-child(3) > button' })
    screen.getByText('2', { selector: 'li:nth-child(4) > button' })
    screen.getByText('3', { selector: 'li:nth-child(5) > button' })
    screen.getByText('4', { selector: 'li:nth-child(6) > button' })
    screen.getByText('5', { selector: 'li:nth-child(7) > button' })
    screen.getByText('6', { selector: 'li:nth-child(8) > button' })
    screen.getByText('...', { selector: 'li:nth-child(9)' })
    screen.getByText('20', { selector: 'li:nth-child(10) > button' })
    screen.getByLabelText('next', { selector: 'li:nth-child(11) > button' })
    screen.getByLabelText('last', { selector: 'li:nth-child(12) > button' })

    expect(container.querySelector('li:nth-child(3)')).toHaveClass('active')
  })
  it('add elipsis at the beginning of long lists', () => {
    const store = createStore(createInitialState(100, 5, 99))
    const { container } = renderComponent(
      <SearchResultsPaging changePage={jest.fn()} searchType="resource" />, store,
    )
    screen.getByLabelText('first', { selector: 'li:nth-child(1) > button' })
    screen.getByLabelText('previous', { selector: 'li:nth-child(2) > button' })
    screen.getByText('1', { selector: 'li:nth-child(3) > button' })
    screen.getByText('...', { selector: 'li:nth-child(4)' })
    screen.getByText('15', { selector: 'li:nth-child(5) > button' })
    screen.getByText('16', { selector: 'li:nth-child(6) > button' })
    screen.getByText('17', { selector: 'li:nth-child(7) > button' })
    screen.getByText('18', { selector: 'li:nth-child(8) > button' })
    screen.getByText('19', { selector: 'li:nth-child(9) > button' })
    screen.getByText('20', { selector: 'li:nth-child(10) > button' })
    screen.getByLabelText('next', { selector: 'li:nth-child(11) > button' })
    screen.getByLabelText('last', { selector: 'li:nth-child(12) > button' })

    expect(container.querySelector('li:nth-child(10)')).toHaveClass('active')
  })
  it('clicking a page goes to page', () => {
    const store = createStore(createInitialState(25, 5, 0))
    renderComponent(
      <SearchResultsPaging changePage={mockChangePage} searchType="resource" />, store,
    )
    fireEvent.click(screen.getByText('3', { selector: 'li:nth-child(5) > button' }))
    expect(mockChangePage).toHaveBeenCalledWith(10)
  })
  it('clicking first goes to first page', () => {
    const store = createStore(createInitialState(25, 5, 10))
    renderComponent(
      <SearchResultsPaging changePage={mockChangePage} searchType="resource"/>, store,
    )
    fireEvent.click(screen.getByLabelText('first'))
    expect(mockChangePage).toHaveBeenCalledWith(0)
  })
  it('clicking last goes to last page', () => {
    const store = createStore(createInitialState(25, 5, 10))
    renderComponent(
      <SearchResultsPaging changePage={mockChangePage} searchType="resource" />, store,
    )
    fireEvent.click(screen.getByLabelText('last'))
    expect(mockChangePage).toHaveBeenCalledWith(20)
  })
  it('clicking previous goes to previous page', () => {
    const store = createStore(createInitialState(25, 5, 10))
    renderComponent(
      <SearchResultsPaging changePage={mockChangePage} searchType="resource" />, store,
    )
    fireEvent.click(screen.getByLabelText('previous'))
    expect(mockChangePage).toHaveBeenCalledWith(5)
  })
  it('clicking next goes to next page', () => {
    const store = createStore(createInitialState(25, 5, 10))
    renderComponent(
      <SearchResultsPaging changePage={mockChangePage} searchType="resource" />, store,
    )
    fireEvent.click(screen.getByLabelText('next'))
    expect(mockChangePage).toHaveBeenCalledWith(15)
  })
})
