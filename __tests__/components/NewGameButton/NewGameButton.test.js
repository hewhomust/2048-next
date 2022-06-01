import { fireEvent, render, screen } from "@testing-library/react"
import NewGameButton from "../../../components/NewGameButton/NewGameButton"
import "@testing-library/jest-dom"

describe("NewGameButton", () => {
  test("renders with text content New Game", () => {
    const newGameHandlerMock = jest.fn()
    render(<NewGameButton newGameHandler={newGameHandlerMock}></NewGameButton>)
    const newGameButton = screen.getByRole("button")
    expect(newGameButton).toHaveTextContent("New Game")
  })

  test("calls newGameHandler when clicked", () => {
    const newGameHandlerMock = jest.fn()
    render(<NewGameButton newGameHandler={newGameHandlerMock}></NewGameButton>)
    const newGameButton = screen.getByRole("button")
    fireEvent(
      newGameButton,
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    )

    expect(newGameHandlerMock).toHaveBeenCalledTimes(1)
  })
})
