import {
  findByTestId,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import Home from "../../../pages"
import "@testing-library/jest-dom"
import useStore from "../../../stores/2048"
import { act } from "react-dom/test-utils"
import { LOCAL_STORAGE_KEY as LOCAL_STORAGE_SCORE_KEY } from "../../../hooks/useBestScoreHook"
import { LOCAL_STORAGE_KEY as LOCAL_STORAGE_GAME_KEY } from "../../../stores/2048"

jest.mock("framer-motion", () => {
  const FakeTransition = jest
    .fn()
    .mockImplementation(({ children }) => children)

  const FakeAnimatePresence = jest
    .fn()
    .mockImplementation(({ children }) => (
      <FakeTransition>{children}</FakeTransition>
    ))

  const motion = {
    a: jest
      .fn()
      .mockImplementation(({ children, ...rest }) => (
        <a {...rest}>{children}</a>
      )),
    li: jest
      .fn()
      .mockImplementation(({ children, ...rest }) => (
        <li {...rest}>children</li>
      )),
    span: jest
      .fn()
      .mockImplementation(({ children, ...rest }) => (
        <span {...rest}>children</span>
      )),
    small: jest
      .fn()
      .mockImplementation(({ children, ...rest }) => (
        <small {...rest}>{children}</small>
      )),
    h4: jest
      .fn()
      .mockImplementation(({ children, ...rest }) => (
        <h4 {...rest}>{children}</h4>
      )),
    h2: jest
      .fn()
      .mockImplementation(({ children, ...rest }) => (
        <h2 {...rest}>{children}</h2>
      )),
    p: jest
      .fn()
      .mockImplementation(({ children, ...rest }) => (
        <p {...rest}>{children}</p>
      )),
    div: require("react").forwardRef(({ children, ...rest }, ref) => {
      const { whileTap, animate, initial, variants, whileHover, ...divProps } =
        rest
      return (
        <div {...divProps} ref={ref}>
          {children}
        </div>
      )
    }),
    button: jest
      .fn()
      .mockImplementation(({ children, ...rest }) => (
        <button {...rest}>{children}</button>
      )),
    custom: jest.fn().mockImplementation((props) => props),
  }

  return {
    __esModule: true,
    motion: motion,
    AnimatePresence: FakeAnimatePresence,
    default: jest.fn(),
  }
})

const initialStoreState = useStore.getState()

let setItemSpy, getItemSpy
let mockStorage = {}

beforeEach(() => {
  setItemSpy = jest
    .spyOn(global.Storage.prototype, "setItem")
    .mockImplementation((key, value) => {
      mockStorage[key] = value
    })
  getItemSpy = jest
    .spyOn(global.Storage.prototype, "getItem")
    .mockImplementation((key) => mockStorage[key])
})

beforeEach(() => {
  mockStorage = {}
  useStore.setState(initialStoreState)
})

afterEach(() => {
  getItemSpy.mockRestore()
  setItemSpy.mockRestore()
})

describe("2048", () => {
  test("score and bestscore render correctly", async () => {
    act(() => {
      useStore.setState({ score: 35 })
    })

    render(<Home></Home>)

    const scoreTile = screen.getByTestId("score")

    expect(scoreTile).toBeVisible()
    expect(within(scoreTile).getByTestId("scoreCardTitle")).toBeVisible()
    expect(within(scoreTile).getByTestId("scoreCardTitle")).toHaveTextContent(
      "Score"
    )
    await waitFor(() =>
      expect(within(scoreTile).getByTestId("scoreCardScore")).toBeVisible()
    )
    await waitFor(() =>
      expect(within(scoreTile).getByTestId("scoreCardScore")).toHaveTextContent(
        "35"
      )
    )

    const bestScoreTile = screen.getByTestId("bestScore")

    expect(bestScoreTile).toBeVisible()
    expect(within(bestScoreTile).getByTestId("scoreCardTitle")).toBeVisible()
    expect(
      within(bestScoreTile).getByTestId("scoreCardTitle")
    ).toHaveTextContent("Best")
    await waitFor(() =>
      expect(within(bestScoreTile).getByTestId("scoreCardScore")).toBeVisible()
    )
    await waitFor(() =>
      expect(
        within(bestScoreTile).getByTestId("scoreCardScore")
      ).toHaveTextContent("35")
    )
  })

  test("given score stored in localStorage is greater than score stored in state render best score with score from localStorage", async () => {
    mockStorage[LOCAL_STORAGE_SCORE_KEY] = 1000

    act(() => {
      useStore.setState({ score: 35 })
    })

    render(<Home></Home>)

    const bestScoreTile = screen.getByTestId("bestScore")

    expect(bestScoreTile).toBeVisible()
    expect(within(bestScoreTile).getByTestId("scoreCardTitle")).toBeVisible()
    expect(
      within(bestScoreTile).getByTestId("scoreCardTitle")
    ).toHaveTextContent("Best")
    await waitFor(() =>
      expect(within(bestScoreTile).getByTestId("scoreCardScore")).toBeVisible()
    )
    await waitFor(() =>
      expect(
        within(bestScoreTile).getByTestId("scoreCardScore")
      ).toHaveTextContent("1000")
    )
  })

  test("given score stored in localStorage is the same as the score stored in state render best score with score from state", async () => {
    mockStorage[LOCAL_STORAGE_SCORE_KEY] = 35

    act(() => {
      useStore.setState({ score: 35 })
    })

    render(<Home></Home>)

    const bestScoreTile = screen.getByTestId("bestScore")

    expect(bestScoreTile).toBeVisible()
    expect(within(bestScoreTile).getByTestId("scoreCardTitle")).toBeVisible()
    expect(
      within(bestScoreTile).getByTestId("scoreCardTitle")
    ).toHaveTextContent("Best")
    await waitFor(() =>
      expect(within(bestScoreTile).getByTestId("scoreCardScore")).toBeVisible()
    )
    await waitFor(() =>
      expect(
        within(bestScoreTile).getByTestId("scoreCardScore")
      ).toHaveTextContent("35")
    )
  })

  test("given score stored in state is greater than the score stored in localstorage set localStorage with score from state", () => {
    mockStorage[LOCAL_STORAGE_SCORE_KEY] = 0

    act(() => {
      useStore.setState({ score: 35 })
    })

    render(<Home></Home>)

    expect(setItemSpy).toHaveBeenCalled()
    expect(setItemSpy).toHaveBeenCalledWith(LOCAL_STORAGE_SCORE_KEY, 35)
  })

  test("given a board state with no more available moves the game over modal is shown", async () => {
    act(() => {
      useStore.setState({
        board: [
          { id: 1, value: 4, index: 0 },
          { id: 2, value: 2, index: 1 },
          { id: 3, value: 4, index: 2 },
          { id: 4, value: 2, index: 3 },
          { id: 5, value: 2, index: 4 },
          { id: 6, value: 4, index: 5 },
          { id: 7, value: 2, index: 6 },
          { id: 8, value: 4, index: 7 },
          { id: 9, value: 4, index: 8 },
          { id: 10, value: 2, index: 9 },
          { id: 11, value: 4, index: 10 },
          { id: 12, value: 2, index: 11 },
          { id: 13, value: 2, index: 12 },
          { id: 14, value: 4, index: 13 },
          { id: 15, value: 2, index: 14 },
          { id: 16, value: 4, index: 15 },
        ],
        // If this isn't here then the game will initialize the board and overwrite the board state above
        initializeBoard: () => {},
      })
    })

    render(<Home></Home>)

    const modal = await screen.findByTestId("gameOverModal")

    await waitFor(() => expect(modal).toBeVisible())
  })

  test("given a board state with the tile 2048 the game won modal is shown", async () => {
    act(() => {
      useStore.setState({
        board: [{ id: 1, value: 2048, index: 0 }],
        // If this isn't here then the game will initialize the board and overwrite the board state above
        initializeBoard: () => {},
      })
    })

    render(<Home></Home>)

    const modal = await screen.findByTestId("gameWonModal")

    await waitFor(() => expect(modal).toBeVisible())
  })

  test("given a game state exists in localStorage then the game will be initialized with that state", async () => {
    const state = {
      board: [
        { id: 17, value: 4, index: 15 },
        { id: 18, value: 4, index: 11 },
        { id: 20, value: 2, index: 10 },
        { id: 21, value: 4, index: 12 },
      ],
      score: 4,
      keepPlaying: false,
    }

    mockStorage[LOCAL_STORAGE_GAME_KEY] = JSON.stringify(state)

    render(<Home></Home>)

    const tiles = screen.getAllByTestId("gameTile")
    const scoreCard = screen.getByTestId("score")

    expect(tiles.length).toBe(4)

    state.board.forEach((tile, index) => {
      expect(tiles[index]).toHaveTextContent(tile.value.toString())
      expect(tiles[index]).toHaveAttribute("data-index", tile.index.toString())
    })

    expect(within(scoreCard).getByTestId("scoreCardScore")).toHaveTextContent(
      "4"
    )
  })

  test("given no game state exists in localStorage then the game will be initialized with a new board", async () => {
    render(<Home></Home>)

    const tiles = screen.getAllByTestId("gameTile")

    expect(tiles.length).toBe(2)
  })

  describe("Tile movement", () => {
    test("can move tiles up", async () => {
      jest.useFakeTimers()

      const startingBoard = [
        { id: 1, value: 2, index: 2 },
        { id: 2, value: 2, index: 6 },
        { id: 3, value: 8, index: 10 },
        { id: 4, value: 8, index: 14 },
      ]

      act(() => {
        useStore.setState({
          board: startingBoard,
          initializeBoard: () => {},
        })
      })

      render(<Home></Home>)

      fireEvent.keyDown(document, {
        key: "ArrowUp",
      })

      act(() => {
        jest.runAllTimers()
      })

      const tiles = await screen.findAllByTestId("gameTile")

      // Merged tiles + new tile
      expect(tiles.length).toBe(3)

      expect(tiles[0]).toHaveTextContent("4")
      expect(tiles[0]).toHaveAttribute("data-index", "2")

      expect(tiles[1]).toHaveTextContent("16")
      expect(tiles[1]).toHaveAttribute("data-index", "6")

      // Needs to be either a 2 or a 4 tile
      try {
        expect(tiles[2]).toHaveTextContent("2")
      } catch (error) {
        expect(tiles[2]).toHaveTextContent("4")
      }
    })

    test("can move tiles left", async () => {
      jest.useFakeTimers()

      const startingBoard = [
        { id: 1, value: 2, index: 2 },
        { id: 2, value: 2, index: 6 },
        { id: 3, value: 8, index: 10 },
        { id: 4, value: 8, index: 14 },
      ]

      act(() => {
        useStore.setState({
          board: startingBoard,
          initializeBoard: () => {},
        })
      })

      render(<Home></Home>)

      fireEvent.keyDown(document, {
        key: "ArrowLeft",
      })

      act(() => {
        jest.runAllTimers()
      })

      const tiles = await screen.findAllByTestId("gameTile")

      // Merged tiles + new tile
      expect(tiles.length).toBe(5)

      expect(tiles[0]).toHaveTextContent("2")
      expect(tiles[0]).toHaveAttribute("data-index", "0")

      expect(tiles[1]).toHaveTextContent("2")
      expect(tiles[1]).toHaveAttribute("data-index", "4")

      expect(tiles[2]).toHaveTextContent("8")
      expect(tiles[2]).toHaveAttribute("data-index", "8")

      expect(tiles[3]).toHaveTextContent("8")
      expect(tiles[3]).toHaveAttribute("data-index", "12")

      // Needs to be either a 2 or a 4 tile
      try {
        expect(tiles[4]).toHaveTextContent("2")
      } catch (error) {
        expect(tiles[4]).toHaveTextContent("4")
      }
    })

    test("can move tiles right", async () => {
      jest.useFakeTimers()

      const startingBoard = [
        { id: 1, value: 2, index: 2 },
        { id: 2, value: 2, index: 6 },
        { id: 3, value: 8, index: 10 },
        { id: 4, value: 8, index: 14 },
      ]

      act(() => {
        useStore.setState({
          board: startingBoard,
          initializeBoard: () => {},
        })
      })

      render(<Home></Home>)

      fireEvent.keyDown(document, {
        key: "ArrowRight",
      })

      act(() => {
        jest.runAllTimers()
      })

      const tiles = await screen.findAllByTestId("gameTile")

      // Merged tiles + new tile
      expect(tiles.length).toBe(5)

      expect(tiles[0]).toHaveTextContent("2")
      expect(tiles[0]).toHaveAttribute("data-index", "3")

      expect(tiles[1]).toHaveTextContent("2")
      expect(tiles[1]).toHaveAttribute("data-index", "7")

      expect(tiles[2]).toHaveTextContent("8")
      expect(tiles[2]).toHaveAttribute("data-index", "11")

      expect(tiles[3]).toHaveTextContent("8")
      expect(tiles[3]).toHaveAttribute("data-index", "15")

      // Needs to be either a 2 or a 4 tile
      try {
        expect(tiles[4]).toHaveTextContent("2")
      } catch (error) {
        expect(tiles[4]).toHaveTextContent("4")
      }
    })

    test("can move tiles down", async () => {
      jest.useFakeTimers()

      const startingBoard = [
        { id: 1, value: 2, index: 2 },
        { id: 2, value: 2, index: 6 },
        { id: 3, value: 8, index: 10 },
        { id: 4, value: 8, index: 14 },
      ]

      act(() => {
        useStore.setState({
          board: startingBoard,
          initializeBoard: () => {},
        })
      })

      render(<Home></Home>)

      fireEvent.keyDown(document, {
        key: "ArrowDown",
      })

      act(() => {
        jest.runAllTimers()
      })

      const tiles = await screen.findAllByTestId("gameTile")

      // Merged tiles + new tile
      expect(tiles.length).toBe(3)

      expect(tiles[0]).toHaveTextContent("4")
      expect(tiles[0]).toHaveAttribute("data-index", "10")

      expect(tiles[1]).toHaveTextContent("16")
      expect(tiles[1]).toHaveAttribute("data-index", "14")

      // Needs to be either a 2 or a 4 tile
      try {
        expect(tiles[2]).toHaveTextContent("2")
      } catch (error) {
        expect(tiles[2]).toHaveTextContent("4")
      }
    })
  })

  test("can start new game with new game button", async () => {
    const startingBoard = [
      { id: 1, value: 2, index: 2 },
      { id: 2, value: 2, index: 6 },
      { id: 3, value: 8, index: 10 },
      { id: 4, value: 8, index: 14 },
    ]

    act(() => {
      useStore.setState({
        board: startingBoard,
        initializeBoard: () => {},
      })
    })

    render(<Home></Home>)

    let tiles = await screen.findAllByTestId("gameTile")
    const newGameButton = screen.getByText("New Game")

    expect(tiles.length).toBe(4)

    tiles.forEach((tile, index) => {
      expect(tile).toHaveTextContent(startingBoard[index].value.toString())
      expect(tile).toHaveAttribute(
        "data-index",
        startingBoard[index].index.toString()
      )
    })

    fireEvent.click(newGameButton)

    tiles = await screen.findAllByTestId("gameTile")

    expect(tiles.length).toBe(2)

    // new tiles should be 2 or 4
    tiles.forEach((tile) => {
      try {
        expect(tile).toHaveTextContent("2")
      } catch (error) {
        expect(tile).toHaveTextContent("4")
      }
    })

    const scoreCard = screen.getByTestId("score")

    expect(within(scoreCard).getByTestId("scoreCardScore")).toHaveTextContent(
      "0"
    )
  })

  test("keep playing button keeps game state but removes game won modal", async () => {
    const startingBoard = [
      { id: 1, value: 2048, index: 0 },
      { id: 2, value: 2, index: 1 },
    ]

    act(() => {
      useStore.setState({
        board: startingBoard,
        // If this isn't here then the game will initialize the board and overwrite the board state above
        initializeBoard: () => {},
        score: 100,
      })
    })

    render(<Home></Home>)

    let tiles = await screen.findAllByTestId("gameTile")

    let scoreTile = screen.getByTestId("score")

    expect(scoreTile).toBeVisible()
    expect(within(scoreTile).getByTestId("scoreCardTitle")).toBeVisible()
    expect(within(scoreTile).getByTestId("scoreCardTitle")).toHaveTextContent(
      "Score"
    )
    await waitFor(() =>
      expect(within(scoreTile).getByTestId("scoreCardScore")).toBeVisible()
    )
    await waitFor(() =>
      expect(within(scoreTile).getByTestId("scoreCardScore")).toHaveTextContent(
        "100"
      )
    )

    expect(tiles.length).toBe(2)

    tiles.forEach((tile, index) => {
      expect(tile).toHaveTextContent(startingBoard[index].value.toString())
      expect(tile).toHaveAttribute(
        "data-index",
        startingBoard[index].index.toString()
      )
    })

    let modal = await screen.findByTestId("gameWonModal")

    await waitFor(() => expect(modal).toBeVisible())

    const keepPlayingButton = await screen.findByTestId("keepPlayingButton")

    fireEvent.click(keepPlayingButton)

    expect(screen.queryByTestId("gameWonModal")).toBe(null)

    tiles = await screen.findAllByTestId("gameTile")
    scoreTile = screen.getByTestId("score")

    expect(tiles.length).toBe(2)

    tiles.forEach((tile, index) => {
      expect(tile).toHaveTextContent(startingBoard[index].value.toString())
      expect(tile).toHaveAttribute(
        "data-index",
        startingBoard[index].index.toString()
      )
    })

    expect(scoreTile).toBeVisible()
    expect(within(scoreTile).getByTestId("scoreCardTitle")).toBeVisible()
    expect(within(scoreTile).getByTestId("scoreCardTitle")).toHaveTextContent(
      "Score"
    )
    await waitFor(() =>
      expect(within(scoreTile).getByTestId("scoreCardScore")).toBeVisible()
    )
    await waitFor(() =>
      expect(within(scoreTile).getByTestId("scoreCardScore")).toHaveTextContent(
        "100"
      )
    )
  })
})
