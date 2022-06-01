import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import GameWonModal from "../../../components/GameWonModal/GameWonModal"
import "@testing-library/jest-dom"

describe("GameWonModal", () => {
  test("to have text You win!!!", () => {
    const newGameHandlerMock = jest.fn()
    render(<GameWonModal newGameHandler={newGameHandlerMock}></GameWonModal>)
    const dialog = screen.getByRole("dialog")
    const keepPlayingButton = screen.getByTestId("gameWonText")

    waitFor(() => expect(dialog).toBeVisible())
    expect(keepPlayingButton).toHaveTextContent("You win!!!")
  })

  test("calls keepPlaying prop with true when clicked", () => {
    const keepPlayingMock = jest.fn()
    render(<GameWonModal keepPlaying={keepPlayingMock}></GameWonModal>)
    const keepPlayingButton = screen.getByTestId("keepPlayingButton")

    fireEvent(
      keepPlayingButton,
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    )

    expect(keepPlayingMock).toHaveBeenCalledWith(true)
  })

  test("keep playing button has text Keep Playing?", () => {
    const keepPlayingMock = jest.fn()
    render(<GameWonModal keepPlaying={keepPlayingMock}></GameWonModal>)
    const keepPlayingButton = screen.getByTestId("keepPlayingButton")

    expect(keepPlayingButton).toHaveTextContent("Keep Playing?")
  })
})
