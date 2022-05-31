import { newSquareNumber, moveTiles, initializeBoard } from "../../lib/2048"
import flatten from "lodash/flatten"

describe("newSquareNumber()", () => {
  afterEach(() => {
    jest.spyOn(Math, "random").mockRestore()
  })

  it("receiving a random value less than 0.7 returns 2", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.6)
    expect(newSquareNumber()).toBe("2")
  })

  it("receiving a random value greater than 0.7 returns 4", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.8)
    expect(newSquareNumber()).toBe("4")
  })

  it("receiving a random value equal to 0.7 returns 4", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.7)
    expect(newSquareNumber()).toBe("4")
  })
})

describe("moveTiles()", () => {
  describe("given a direction not in UP,DOWN,LEFT,RIGHT", () => {
    it("throws an error", () => {
      const startingBoard = [
        ["", "", "2", "8"],
        ["", "", "2", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["2", "8", "", ""],
        ["2", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      expect(() => moveTiles(startingBoard, "DIRECTION")).toThrow(
        "DIRECTION is not UP, DOWN, LEFT or RIGHT"
      )
    })
  })
  describe("no collisions", () => {
    test("move left", () => {
      const startingBoard = [
        ["", "", "2", "8"],
        ["", "", "2", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["2", "8", "", ""],
        ["2", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      expect(moveTiles(startingBoard, "LEFT")).toEqual(endingBoard)
    })

    test("move right", () => {
      const startingBoard = [
        ["", "", "", ""],
        ["", "", "2", "8"],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["", "", "", ""],
        ["", "", "2", "8"],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      expect(moveTiles(startingBoard, "RIGHT")).toEqual(endingBoard)
    })

    test("move up", () => {
      const startingBoard = [
        ["", "", "", ""],
        ["", "", "2", "2"],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["", "", "2", "2"],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      expect(moveTiles(startingBoard, "UP")).toEqual(endingBoard)
    })

    test("move down", () => {
      const startingBoard = [
        ["", "", "", ""],
        ["", "", "2", "2"],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "2", "2"],
      ]

      expect(moveTiles(startingBoard, "DOWN")).toEqual(endingBoard)
    })
  })

  describe("single collision", () => {
    test("move left", () => {
      const startingBoard = [
        ["", "", "2", "8"],
        ["", "", "2", "2"],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["2", "8", "", ""],
        ["4", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      expect(moveTiles(startingBoard, "LEFT")).toEqual(endingBoard)
    })

    test("move right", () => {
      const startingBoard = [
        ["", "", "", ""],
        ["", "", "2", "2"],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["", "", "", ""],
        ["", "", "", "4"],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      expect(moveTiles(startingBoard, "RIGHT")).toEqual(endingBoard)
    })

    test("move up", () => {
      const startingBoard = [
        ["", "", "", ""],
        ["", "", "8", ""],
        ["", "", "8", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["", "", "16", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      expect(moveTiles(startingBoard, "UP")).toEqual(endingBoard)
    })

    test("move down", () => {
      const startingBoard = [
        ["", "", "", ""],
        ["", "", "4", ""],
        ["", "", "4", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "8", ""],
      ]

      expect(moveTiles(startingBoard, "DOWN")).toEqual(endingBoard)
    })
  })

  describe("multiple collisions", () => {
    test("move left", () => {
      const startingBoard = [
        ["2", "2", "4", "4"],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["4", "8", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      expect(moveTiles(startingBoard, "LEFT")).toEqual(endingBoard)
    })

    test("move right", () => {
      const startingBoard = [
        ["", "", "", ""],
        ["2", "2", "4", "4"],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["", "", "", ""],
        ["", "", "4", "8"],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      expect(moveTiles(startingBoard, "RIGHT")).toEqual(endingBoard)
    })

    test("move up", () => {
      const startingBoard = [
        ["", "", "2", ""],
        ["", "", "2", ""],
        ["", "", "8", ""],
        ["", "", "8", ""],
      ]

      const endingBoard = [
        ["", "", "4", ""],
        ["", "", "16", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      expect(moveTiles(startingBoard, "UP")).toEqual(endingBoard)
    })

    test("move down", () => {
      const startingBoard = [
        ["", "", "4", ""],
        ["", "", "4", ""],
        ["", "", "8", ""],
        ["", "", "8", ""],
      ]

      const endingBoard = [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "8", ""],
        ["", "", "16", ""],
      ]

      expect(moveTiles(startingBoard, "DOWN")).toEqual(endingBoard)
    })
  })

  describe("single collision three connected same numbers", () => {
    test("move left", () => {
      const startingBoard = [
        ["2", "2", "2", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["4", "2", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      expect(moveTiles(startingBoard, "LEFT")).toEqual(endingBoard)
    })

    test("move right", () => {
      const startingBoard = [
        ["", "", "", ""],
        ["2", "2", "2", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["", "", "", ""],
        ["", "", "2", "4"],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      expect(moveTiles(startingBoard, "RIGHT")).toEqual(endingBoard)
    })

    test("move up", () => {
      const startingBoard = [
        ["", "", "2", ""],
        ["", "", "2", ""],
        ["", "", "2", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["", "", "4", ""],
        ["", "", "2", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]

      expect(moveTiles(startingBoard, "UP")).toEqual(endingBoard)
    })

    test("move down", () => {
      const startingBoard = [
        ["", "", "4", ""],
        ["", "", "4", ""],
        ["", "", "4", ""],
        ["", "", "", ""],
      ]

      const endingBoard = [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "4", ""],
        ["", "", "8", ""],
      ]

      expect(moveTiles(startingBoard, "DOWN")).toEqual(endingBoard)
    })
  })
})

describe("initializeBoard()", () => {
  afterEach(() => {
    jest.spyOn(Math, "random").mockRestore()
  })

  test("returns a 4x4 array of strings", () => {
    const board = initializeBoard()

    expect(board).toHaveLength(4)
    expect(Array.isArray(board)).toBe(true)

    board.forEach((row) => {
      expect(Array.isArray(row)).toBe(true)
      expect(row).toHaveLength(4)

      row.forEach((col) => {
        expect(typeof col).toBe("string")
      })
    })
  })

  test("new board has two filled tiles", () => {
    const board = initializeBoard()

    const filledTiles = flatten(board).filter((tile) => tile)

    expect(filledTiles.length).toBe(2)
  })

  test("filled board tiles are either 2 or 4", () => {
    const trials = 1000
    const outcomes = {}

    for (let i = 0; i < trials; i++) {
      const board = initializeBoard()
      const filledTiles = flatten(board).filter((tile) => {
        return tile
      })

      filledTiles.forEach((tile) => {
        outcomes[tile] = true
      })
    }

    expect(outcomes).toEqual({ 2: true, 4: true })
  })
})
