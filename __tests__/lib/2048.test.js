import {
  newSquareNumber,
  initializeBoard,
  scoreDelta,
  gameOver,
  hasWon,
  takeTurn,
  isBoardEmpty,
  beforeMerged,
} from "../../lib/2048"
import flatten from "lodash/flatten"

describe("newSquareNumber()", () => {
  afterEach(() => {
    jest.spyOn(Math, "random").mockRestore()
  })

  it("receiving a random value less than 0.7 returns 2", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.6)
    expect(newSquareNumber()).toBe("2")
  })

  it("receiving a random value greater than 0.9 returns 4", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.95)
    expect(newSquareNumber()).toBe("4")
  })

  it("receiving a random value equal to 0.9 returns 4", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.9)
    expect(newSquareNumber()).toBe("4")
  })
})

describe("takeTurn()", () => {
  describe("given a direction not in UP,DOWN,LEFT,RIGHT", () => {
    it("throws an error", () => {
      const startingBoard = [
        { id: 1, value: 2, index: 2 },
        { id: 2, value: 8, index: 3 },
        { id: 3, value: 2, index: 6 },
      ]

      expect(() => takeTurn(startingBoard, "DIRECTION")).toThrow(
        "DIRECTION is not UP, DOWN, LEFT or RIGHT"
      )
    })
  })
  describe("no merges", () => {
    test("move left", () => {
      const startingBoard = [
        { id: 1, value: 2, index: 2 },
        { id: 2, value: 8, index: 3 },
        { id: 3, value: 2, index: 6 },
      ]

      const afterMerged = [
        { id: 1, value: 2, index: 0 },
        { id: 2, value: 8, index: 1 },
        { id: 3, value: 2, index: 4 },
      ]

      const beforeMerged = [
        { id: 1, value: 2, index: 0 },
        { id: 2, value: 8, index: 1 },
        { id: 3, value: 2, index: 4 },
      ]

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "LEFT")).toEqual(expected)
    })

    test("move right", () => {
      const startingBoard = [
        { id: 1, value: 2, index: 6 },
        { id: 2, value: 8, index: 7 },
      ]

      const afterMerged = [
        { id: 1, value: 2, index: 6 },
        { id: 2, value: 8, index: 7 },
      ]

      const beforeMerged = [
        { id: 1, value: 2, index: 6 },
        { id: 2, value: 8, index: 7 },
      ]

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "RIGHT")).toEqual(expected)
    })

    test("move up", () => {
      const startingBoard = [
        { id: 1, value: 2, index: 3 },
        { id: 2, value: 4, index: 7 },
        { id: 3, value: 2, index: 15 },
      ]

      const afterMerged = [
        { id: 1, value: 2, index: 3 },
        { id: 2, value: 4, index: 7 },
        { id: 3, value: 2, index: 11 },
      ]

      const beforeMerged = afterMerged

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "UP")).toEqual(expected)
    })

    test("move down", () => {
      const startingBoard = [
        { id: 1, value: 2, index: 6 },
        { id: 2, value: 2, index: 7 },
      ]

      const afterMerged = [
        { id: 1, value: 2, index: 14 },
        { id: 2, value: 2, index: 15 },
      ]

      const beforeMerged = afterMerged

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "DOWN")).toEqual(expected)
    })
  })

  describe("single merge", () => {
    test("move left", () => {
      const startingBoard = [
        { id: 1, value: 2, index: 2 },
        { id: 2, value: 8, index: 3 },
        { id: 3, value: 2, index: 6 },
        { id: 4, value: 2, index: 7 },
      ]

      const afterMerged = [
        { id: 1, value: 2, index: 0 },
        { id: 2, value: 8, index: 1 },
        { id: 3, value: 4, index: 4 },
      ]

      const beforeMerged = [
        { id: 1, value: 2, index: 0 },
        { id: 2, value: 8, index: 1 },
        { id: 3, value: 2, index: 4 },
        { id: 4, value: 2, index: 4 },
      ]

      const expected = {
        beforeMerged,
        afterMerged,
      }

      expect(takeTurn(startingBoard, "LEFT")).toEqual(expected)
    })

    test("move right", () => {
      const startingBoard = [
        { id: 1, value: 2, index: 6 },
        { id: 2, value: 2, index: 7 },
      ]

      const afterMerged = [{ id: 1, value: 4, index: 7 }]

      const beforeMerged = [
        { id: 1, value: 2, index: 7 },
        { id: 2, value: 2, index: 7 },
      ]

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "RIGHT")).toEqual(expected)
    })

    test("move up", () => {
      const startingBoard = [
        { id: 1, value: 8, index: 6 },
        { id: 2, value: 8, index: 10 },
      ]

      const afterMerged = [{ id: 1, value: 16, index: 2 }]
      const beforeMerged = [
        { id: 1, value: 8, index: 2 },
        { id: 2, value: 8, index: 2 },
      ]

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "UP")).toEqual(expected)
    })

    test("move down", () => {
      const startingBoard = [
        { id: 1, value: 4, index: 6 },
        { id: 2, value: 4, index: 10 },
      ]

      const afterMerged = [{ id: 1, value: 8, index: 14 }]
      const beforeMerged = [
        { id: 1, value: 4, index: 14 },
        { id: 2, value: 4, index: 14 },
      ]

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "DOWN")).toEqual(expected)
    })
  })

  describe("multiple merges", () => {
    test("move left", () => {
      const startingBoard = [
        { id: 1, value: 2, index: 0 },
        { id: 2, value: 2, index: 1 },
        { id: 3, value: 4, index: 2 },
        { id: 4, value: 4, index: 3 },
      ]

      const afterMerged = [
        { id: 1, value: 4, index: 0 },
        { id: 3, value: 8, index: 1 },
      ]

      const beforeMerged = [
        { id: 1, value: 2, index: 0 },
        { id: 2, value: 2, index: 0 },
        { id: 3, value: 4, index: 1 },
        { id: 4, value: 4, index: 1 },
      ]

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "LEFT")).toEqual(expected)
    })

    test("move right", () => {
      const startingBoard = [
        { id: 1, value: 2, index: 4 },
        { id: 2, value: 2, index: 5 },
        { id: 3, value: 4, index: 6 },
        { id: 4, value: 4, index: 7 },
      ]

      const afterMerged = [
        { id: 1, value: 4, index: 6 },
        { id: 3, value: 8, index: 7 },
      ]

      const beforeMerged = [
        { id: 1, value: 2, index: 6 },
        { id: 2, value: 2, index: 6 },

        { id: 3, value: 4, index: 7 },
        { id: 4, value: 4, index: 7 },
      ]

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "RIGHT")).toEqual(expected)
    })

    test("move up", () => {
      const startingBoard = [
        { id: 1, value: 2, index: 2 },
        { id: 2, value: 2, index: 6 },
        { id: 3, value: 8, index: 10 },
        { id: 4, value: 8, index: 14 },
      ]

      const afterMerged = [
        { id: 1, value: 4, index: 2 },
        { id: 3, value: 16, index: 6 },
      ]

      const beforeMerged = [
        { id: 1, value: 2, index: 2 },
        { id: 2, value: 2, index: 2 },
        { id: 3, value: 8, index: 6 },
        { id: 4, value: 8, index: 6 },
      ]

      const expected = {
        beforeMerged,
        afterMerged,
      }

      expect(takeTurn(startingBoard, "UP")).toEqual(expected)
    })

    test("move down", () => {
      const startingBoard = [
        { id: 1, value: 4, index: 2 },
        { id: 2, value: 4, index: 6 },
        { id: 3, value: 8, index: 10 },
        { id: 4, value: 8, index: 14 },
      ]

      const afterMerged = [
        { id: 1, value: 8, index: 10 },
        { id: 3, value: 16, index: 14 },
      ]

      const beforeMerged = [
        { id: 1, value: 4, index: 10 },
        { id: 2, value: 4, index: 10 },
        { id: 3, value: 8, index: 14 },
        { id: 4, value: 8, index: 14 },
      ]

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "DOWN")).toEqual(expected)
    })
  })

  describe("single merge three connected same numbers", () => {
    test("move left", () => {
      const startingBoard = [
        { id: 1, value: 2, index: 0 },
        { id: 2, value: 2, index: 1 },
        { id: 3, value: 2, index: 2 },
      ]

      const afterMerged = [
        { id: 1, value: 4, index: 0 },
        { id: 3, value: 2, index: 1 },
      ]

      const beforeMerged = [
        { id: 1, value: 2, index: 0 },
        { id: 2, value: 2, index: 0 },
        { id: 3, value: 2, index: 1 },
      ]

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "LEFT")).toEqual(expected)
    })

    test("move right", () => {
      const startingBoard = [
        { id: 1, value: 2, index: 4 },
        { id: 2, value: 2, index: 5 },
        { id: 3, value: 2, index: 6 },
      ]

      const afterMerged = [
        { id: 1, value: 2, index: 6 },
        { id: 2, value: 4, index: 7 },
      ]

      const beforeMerged = [
        { id: 1, value: 2, index: 6 },
        { id: 2, value: 2, index: 7 },
        { id: 3, value: 2, index: 7 },
      ]

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "RIGHT")).toEqual(expected)
    })

    test("move up", () => {
      const startingBoard = [
        { id: 1, value: 2, index: 2 },
        { id: 2, value: 2, index: 6 },
        { id: 3, value: 2, index: 10 },
      ]

      const afterMerged = [
        { id: 1, value: 4, index: 2 },
        { id: 3, value: 2, index: 6 },
      ]

      const beforeMerged = [
        { id: 1, value: 2, index: 2 },
        { id: 2, value: 2, index: 2 },
        { id: 3, value: 2, index: 6 },
      ]

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "UP")).toEqual(expected)
    })

    test("move down", () => {
      const startingBoard = [
        { id: 1, value: 4, index: 2 },
        { id: 2, value: 4, index: 6 },
        { id: 3, value: 4, index: 10 },
      ]

      const afterMerged = [
        { id: 1, value: 4, index: 10 },
        { id: 2, value: 8, index: 14 },
      ]

      const beforeMerged = [
        { id: 1, value: 4, index: 10 },
        { id: 2, value: 4, index: 14 },
        { id: 3, value: 4, index: 14 },
      ]

      const expected = {
        afterMerged,
        beforeMerged,
      }

      expect(takeTurn(startingBoard, "DOWN")).toEqual(expected)
    })
  })
})

describe("initializeBoard()", () => {
  afterEach(() => {
    jest.spyOn(Math, "random").mockRestore()
  })

  test("new board has two filled tiles", () => {
    const board = initializeBoard()

    expect(board.length).toBe(2)
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
        outcomes[tile.value] = true
      })
    }

    expect(outcomes).toEqual({ 2: true, 4: true })
  })
})

describe("scoreDelta()", () => {
  test("given the same initial and next board returns 0", () => {
    const startingBoard = [
      { id: 1, value: 2, index: 0 },
      { id: 2, value: 2, index: 1 },
      { id: 3, value: 2, index: 2 },
      { id: 4, value: 3, index: 3 },
    ]

    const endingBoard = [
      { id: 1, value: 2, index: 0 },
      { id: 2, value: 2, index: 1 },
      { id: 3, value: 2, index: 2 },
      { id: 4, value: 3, index: 3 },
    ]

    expect(scoreDelta(startingBoard, endingBoard)).toBe(0)
  })

  test("given a new 4 in the endingBoard return 4", () => {
    const startingBoard = [
      { id: 1, value: 2, index: 2 },
      { id: 2, value: 8, index: 3 },
      { id: 3, value: 2, index: 6 },
    ]

    const endingBoard = [
      { id: 1, value: 4, index: 2 },
      { id: 2, value: 8, index: 3 },
    ]

    expect(scoreDelta(startingBoard, endingBoard)).toBe(4)
  })

  test("given a new 4 and a new 8 in the endingBoard return 12", () => {
    const startingBoard = [
      { id: 1, value: 2, index: 1 },
      { id: 2, value: 2, index: 2 },
      { id: 3, value: 4, index: 3 },
      { id: 4, value: 2, index: 6 },
      { id: 5, value: 4, index: 7 },
    ]

    const endingBoard = [
      { id: 1, value: 2, index: 1 },
      { id: 2, value: 4, index: 2 },
      { id: 3, value: 8, index: 3 },
    ]

    expect(scoreDelta(startingBoard, endingBoard)).toBe(12)
  })
})

describe("gameOver()", () => {
  test("given a board with available moves returns false", () => {
    const board = [
      { id: 1, value: 2, index: 1 },
      { id: 2, value: 2, index: 2 },
      { id: 3, value: 3, index: 3 },
      { id: 4, value: 2, index: 6 },
      { id: 5, value: 4, index: 7 },
    ]

    expect(gameOver(board)).toBe(false)
  })

  test("given a board with no moves returns true", () => {
    const board = [
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
    ]

    expect(gameOver(board)).toBe(true)
  })
})

describe("hasWon()", () => {
  test("given a board without a 2048 tile returns false", () => {
    const board = [
      ["", "2", "2", "4"],
      ["", "", "2", "4"],
      ["", "", "", ""],
      ["", "", "", ""],
    ]

    expect(hasWon(board)).toBe(false)
  })
})

describe("hasWon()", () => {
  test("given a board with a 2048 tile returns true", () => {
    const board = [
      {
        id: 1,
        index: 0,
        value: 2048,
      },
    ]

    expect(hasWon(board)).toBe(true)
  })
})

describe("isBoardEmpty()", () => {
  test("given an empty board returns true", () => {
    const board = []

    expect(isBoardEmpty(board)).toBe(true)
  })

  test("given a non empty board returns false", () => {
    const board = [
      {
        id: 1,
        value: 2,
        index: 0,
      },
    ]

    expect(isBoardEmpty(board)).toBe(false)
  })
})

describe("beforeMerged()", () => {
  test("no merges", () => {
    const board = [{ id: 1, value: 2, index: 0 }]
    const merges = []

    const result = board

    expect(beforeMerged(board, merges)).toEqual(result)
  })

  test("single merge", () => {
    const board = [
      { id: 1, value: 2, index: 0 },
      { id: 2, value: 8, index: 1 },
      { id: 3, value: 4, index: 4 },
    ]
    const merges = [
      {
        start: { id: 4, value: 2, index: 7 },
        end: { id: 3, value: 2, index: 6 },
      },
    ]

    const result = [
      { id: 1, value: 2, index: 0 },
      { id: 2, value: 8, index: 1 },
      { id: 3, value: 2, index: 4 },
      { id: 4, value: 2, index: 4 },
    ]

    expect(beforeMerged(board, merges)).toEqual(result)
  })

  test("two merges", () => {
    const board = [
      { id: 1, value: 8, index: 10 },
      { id: 3, value: 16, index: 14 },
    ]
    const merges = [
      {
        start: { id: 4, value: 8, index: 14 },
        end: { id: 3, value: 8, index: 10 },
      },
      {
        start: { id: 2, value: 4, index: 6 },
        end: { id: 1, value: 4, index: 2 },
      },
    ]

    const result = [
      {
        id: 1,
        value: 4,
        index: 10,
      },
      {
        id: 2,
        value: 4,
        index: 10,
      },
      {
        id: 3,
        value: 8,
        index: 14,
      },
      {
        id: 4,
        value: 8,
        index: 14,
      },
    ]

    expect(beforeMerged(board, merges)).toEqual(result)
  })
})
