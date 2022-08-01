import React from "react"
import SearchResultsPaging from "components/search/SearchResultsPaging"
import { fireEvent, screen } from "@testing-library/react"
import { renderComponent } from "testUtils"

/* eslint-disable testing-library/no-node-access */
describe("<SearchResultsPaging />", () => {
  const mockChangePage = jest.fn()

  beforeEach(() => mockChangePage.mockClear())

  it("does not render when no results", () => {
    renderComponent(
      <SearchResultsPaging
        changePage={jest.fn()}
        searchType="resource"
        totalResults={0}
        resultsPerPage={5}
        startOfRange={0}
      />
    )
    expect(screen.queryByText("First")).not.toBeInTheDocument()
  })

  it("does not render when less than a page of results", () => {
    renderComponent(
      <SearchResultsPaging
        changePage={jest.fn()}
        searchType="resource"
        totalResults={5}
        resultsPerPage={5}
        startOfRange={0}
      />
    )
    expect(screen.queryByText("First")).not.toBeInTheDocument()
  })

  it("renders pages and selects first", () => {
    renderComponent(
      <SearchResultsPaging
        changePage={jest.fn()}
        searchType="resource"
        totalResults={25}
        resultsPerPage={5}
        startOfRange={0}
      />
    )
    screen.getByLabelText("first", { selector: "li:nth-child(1) > button" })
    screen.getByLabelText("previous", { selector: "li:nth-child(2) > button" })
    screen.getByText("1", { selector: "li:nth-child(3) > button" })
    screen.getByText("2", { selector: "li:nth-child(4) > button" })
    screen.getByText("3", { selector: "li:nth-child(5) > button" })
    screen.getByText("4", { selector: "li:nth-child(6) > button" })
    screen.getByText("5", { selector: "li:nth-child(7) > button" })
    screen.getByLabelText("next", { selector: "li:nth-child(8) > button" })
    screen.getByLabelText("last", { selector: "li:nth-child(9) > button" })

    expect(document.querySelector("li:nth-child(3)")).toHaveClass("active")
  })
  it("correct page is active", () => {
    renderComponent(
      <SearchResultsPaging
        changePage={jest.fn()}
        searchType="resource"
        totalResults={25}
        resultsPerPage={5}
        startOfRange={12}
      />
    )
    // 3rd page
    expect(document.querySelector("li:nth-child(5)")).toHaveClass("active")
  })
  it("add elipsis at the end of long lists", () => {
    renderComponent(
      <SearchResultsPaging
        changePage={jest.fn()}
        searchType="resource"
        totalResults={100}
        resultsPerPage={5}
        startOfRange={0}
      />
    )
    screen.getByLabelText("first", { selector: "li:nth-child(1) > button" })
    screen.getByLabelText("previous", { selector: "li:nth-child(2) > button" })
    screen.getByText("1", { selector: "li:nth-child(3) > button" })
    screen.getByText("2", { selector: "li:nth-child(4) > button" })
    screen.getByText("3", { selector: "li:nth-child(5) > button" })
    screen.getByText("4", { selector: "li:nth-child(6) > button" })
    screen.getByText("5", { selector: "li:nth-child(7) > button" })
    screen.getByText("6", { selector: "li:nth-child(8) > button" })
    screen.getByText("...", { selector: "li:nth-child(9)" })
    screen.getByText("20", { selector: "li:nth-child(10) > button" })
    screen.getByLabelText("next", { selector: "li:nth-child(11) > button" })
    screen.getByLabelText("last", { selector: "li:nth-child(12) > button" })

    expect(document.querySelector("li:nth-child(3)")).toHaveClass("active")
  })
  it("add elipsis at the beginning of long lists", () => {
    renderComponent(
      <SearchResultsPaging
        changePage={jest.fn()}
        searchType="resource"
        totalResults={100}
        resultsPerPage={5}
        startOfRange={99}
      />
    )
    screen.getByLabelText("first", { selector: "li:nth-child(1) > button" })
    screen.getByLabelText("previous", { selector: "li:nth-child(2) > button" })
    screen.getByText("1", { selector: "li:nth-child(3) > button" })
    screen.getByText("...", { selector: "li:nth-child(4)" })
    screen.getByText("15", { selector: "li:nth-child(5) > button" })
    screen.getByText("16", { selector: "li:nth-child(6) > button" })
    screen.getByText("17", { selector: "li:nth-child(7) > button" })
    screen.getByText("18", { selector: "li:nth-child(8) > button" })
    screen.getByText("19", { selector: "li:nth-child(9) > button" })
    screen.getByText("20", { selector: "li:nth-child(10) > button" })
    screen.getByLabelText("next", { selector: "li:nth-child(11) > button" })
    screen.getByLabelText("last", { selector: "li:nth-child(12) > button" })

    expect(document.querySelector("li:nth-child(10)")).toHaveClass("active")
  })
  it("clicking a page goes to page", () => {
    renderComponent(
      <SearchResultsPaging
        changePage={mockChangePage}
        searchType="resource"
        totalResults={25}
        resultsPerPage={5}
        startOfRange={0}
      />
    )
    fireEvent.click(
      screen.getByText("3", { selector: "li:nth-child(5) > button" })
    )
    expect(mockChangePage).toHaveBeenCalledWith(10)
  })
  it("clicking first goes to first page", () => {
    renderComponent(
      <SearchResultsPaging
        changePage={mockChangePage}
        searchType="resource"
        totalResults={25}
        resultsPerPage={5}
        startOfRange={10}
      />
    )
    fireEvent.click(screen.getByLabelText("first"))
    expect(mockChangePage).toHaveBeenCalledWith(0)
  })
  it("clicking last goes to last page", () => {
    renderComponent(
      <SearchResultsPaging
        changePage={mockChangePage}
        searchType="resource"
        totalResults={25}
        resultsPerPage={5}
        startOfRange={10}
      />
    )

    fireEvent.click(screen.getByLabelText("last"))
    expect(mockChangePage).toHaveBeenCalledWith(20)
  })
  it("clicking previous goes to previous page", () => {
    renderComponent(
      <SearchResultsPaging
        changePage={mockChangePage}
        searchType="resource"
        totalResults={25}
        resultsPerPage={5}
        startOfRange={10}
      />
    )
    fireEvent.click(screen.getByLabelText("previous"))
    expect(mockChangePage).toHaveBeenCalledWith(5)
  })
  it("clicking next goes to next page", () => {
    renderComponent(
      <SearchResultsPaging
        changePage={mockChangePage}
        searchType="resource"
        totalResults={25}
        resultsPerPage={5}
        startOfRange={10}
      />
    )
    fireEvent.click(screen.getByLabelText("next"))
    expect(mockChangePage).toHaveBeenCalledWith(15)
  })
})
