import produce from "immer"
import {
  newSquareNumber,
  moveTiles,
  getColumnsFromBoard,
  getBoardFromColumns,
  moveLineTiles,
} from "../../lib/2048"

describe("newSquareNumber()", () => {
  afterEach(() => {
    jest.spyOn(Math, "random").mockRestore()
  })

  it("given a random value less than 0.7 returns 2", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.6)
    expect(newSquareNumber()).toBe(2)
  })

  it("given a random value greater than 0.7 returns 4", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.8)
    expect(newSquareNumber()).toBe(4)
  })

  it("given a random value equal to 0.7 returns 4", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.7)
    expect(newSquareNumber()).toBe(4)
  })
})

describe("moveTiles()", () => {
  describe("no collisions", () => {
    test("left", () => {
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

    test("right", () => {
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

    test("up", () => {
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

    test("down", () => {
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
    test("left", () => {
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

    test("right", () => {
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

    test("up", () => {
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

    test("down", () => {
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
    test("left", () => {
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

    test("right", () => {
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

    test("up", () => {
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

    test("down", () => {
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
    test("left", () => {
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

    test("right", () => {
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

    test("up", () => {
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

    test("down", () => {
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
