const range = require("lodash/range")
import flatten from "lodash/flatten"

import {
  transposeArray,
  padArrayEnd,
  padArrayStart,
  getRandomInt,
} from "../utils"
import { reverse } from "lodash"

export const DIRECTIONS = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  UP: "UP",
  DOWN: "DOWN",
}

const HORIZONTAL_DIRECTION_MAP = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  UP: "LEFT",
  DOWN: "RIGHT",
}

const newSquareNumber = () => {
  const random = Math.random()

  return random < 0.7 ? "2" : "4"
}

const getColumnsFromBoard = (board) => {
  return transposeArray(board, board.length)
}

const getBoardFromColumns = (columns) => {
  return transposeArray(columns, columns.length)
}

const moveTiles = (board, direction) => {
  direction = direction.toUpperCase()

  if (!["UP", "DOWN", "LEFT", "RIGHT"].includes(direction)) {
    throw new Error(`${direction} is not UP, DOWN, LEFT or RIGHT`)
  }

  return direction === HORIZONTAL_DIRECTION_MAP[direction]
    ? board.map((row) => {
        return moveLineTiles(row, direction)
      })
    : getBoardFromColumns(
        getColumnsFromBoard(board).map((row) => {
          return moveLineTiles(row, HORIZONTAL_DIRECTION_MAP[direction])
        })
      )
}

const buildMergedTiles = (tiles) => {
  const stack = []
  const mergedTiles = []

  tiles.forEach((tile, index, array) => {
    const prev = stack.pop()

    if (tile === prev) {
      mergedTiles.push(Number(tile) + Number(prev))
    } else if (prev && index !== array.length - 1) {
      mergedTiles.push(prev)
    } else if (prev && index === array.length - 1) {
      mergedTiles.push(prev)
      mergedTiles.push(tile)
    } else if (index !== array.length - 1) {
      stack.push(tile)
    } else {
      mergedTiles.push(tile)
    }
  })

  return mergedTiles.map((tile) => tile.toString())
}

const moveLineTiles = (line, direction) => {
  if (!["LEFT", "RIGHT"].includes(direction.toUpperCase())) {
    throw new Error(`${direction} is not LEFT or RIGHT`)
  }

  const padFunction = direction === "LEFT" ? padArrayEnd : padArrayStart

  let numberedTiles = line.filter((tile) => tile)
  numberedTiles = direction === "LEFT" ? numberedTiles : reverse(numberedTiles)
  let mergedTiles = buildMergedTiles(numberedTiles)

  mergedTiles = direction === "LEFT" ? mergedTiles : reverse(mergedTiles)

  return padFunction(mergedTiles, 4, "")
}

const initializeBoard = () => {
  const squares = 16

  const board = [
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ]

  while (flatten(board).filter((tile) => tile).length < 2) {
    const randomInt = getRandomInt(squares)
    const row = Math.floor(randomInt / Math.pow(squares, 0.5))
    const column = randomInt % Math.pow(squares, 0.5)

    if (board[row][column]) {
      continue
    }

    board[row][column] = newSquareNumber()
  }

  return board
}

export { newSquareNumber, moveTiles, initializeBoard }
