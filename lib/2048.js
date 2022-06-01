import flatten from "lodash/flatten"
import { cloneDeep } from "lodash"
import { compare } from "js-deep-equals"

import {
  transposeArray,
  padArrayEnd,
  padArrayStart,
  getRandomInt,
  isArrayEqual,
} from "../utils"
import { reverse } from "lodash"
import produce from "immer"

export const EMPTY_BOARD = [
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
]

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

  return random < 0.9 ? "2" : "4"
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

  const newBoard =
    direction === HORIZONTAL_DIRECTION_MAP[direction]
      ? board.map((row) => {
          return moveLineTiles(row, direction)
        })
      : getBoardFromColumns(
          getColumnsFromBoard(board).map((row) => {
            return moveLineTiles(row, HORIZONTAL_DIRECTION_MAP[direction])
          })
        )

  return newBoard
}

const scoreDelta = (oldBoard, newBoard) => {
  const newGroupedTileValues = groupTileValues(newBoard)
  const oldGroupedTileValues = groupTileValues(oldBoard)

  let zipped = Object.keys(newGroupedTileValues)
    .concat(Object.keys(oldGroupedTileValues))
    .reduce((accum, el) => {
      return produce(accum, (draft) => {
        if (!draft[el]) {
          draft[el] = {}
        }

        draft[el]["old"] = oldGroupedTileValues[el] ?? 0
        draft[el]["new"] = newGroupedTileValues[el] ?? 0
      })
    }, {})

  return Object.keys(zipped).reduce(
    (accum, el, index, array) => {
      let zipped = accum.zipped

      if (index === array.length - 1) {
        return accum
      }

      const presentTile = el
      const { old: oldTileAmount, new: newTileAmount } = zipped[presentTile]
      const nextTile = array[index + 1]

      if (newTileAmount >= oldTileAmount) {
        return accum
      }

      const numberOfMerges = Math.abs((newTileAmount - oldTileAmount) / 2)

      accum.zipped[nextTile]["new"] =
        accum.zipped[nextTile]["new"] - numberOfMerges
      accum.sum += numberOfMerges * Number(nextTile)

      return accum
    },
    { sum: 0, zipped: cloneDeep(zipped) }
  ).sum
}

const boardsEqual = (board1, board2) => {
  return compare(board1, board2)
}

const takeTurn = (board, direction) => {
  const newBoard = moveTiles(board, direction)

  if (boardsEqual(board, newBoard)) {
    return { board: newBoard, score: 0 }
  }

  const score = scoreDelta(board, newBoard)

  const { row, column } = findRandomEmptySquare(newBoard)

  newBoard[row][column] = newSquareNumber()

  return { board: newBoard, score: score }
}

const buildMergedTiles = (tiles) => {
  const stack = []
  const mergedTiles = []

  tiles.forEach((tile, index, array) => {
    const prev = stack.pop()

    if (tile === prev) {
      mergedTiles.push(Number(tile) + Number(prev))
    } else if (prev && index !== array.length - 1) {
      stack.push(tile)
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
  const board = cloneDeep(EMPTY_BOARD)

  while (flatten(board).filter((tile) => tile).length < 2) {
    const { row, column } = findRandomEmptySquare(board)
    board[row][column] = newSquareNumber()
  }

  return board
}

const findRandomEmptySquare = (board) => {
  let emptySquare = null

  while (!emptySquare) {
    const randomInt = getRandomInt(Math.pow(board.length, 2))
    const row = Math.floor(randomInt / board.length)
    const column = randomInt % board.length

    if (board[row][column]) {
      continue
    }

    emptySquare = { row, column }
  }

  return emptySquare
}

const groupTileValues = (board) => {
  return flatten(board).reduce((accum, el) => {
    return produce(accum, (draft) => {
      if (!el) {
        return
      }

      if (!draft[el]) {
        draft[el] = 0
      }

      draft[el] += 1
    })
  }, {})
}

const gameOver = (board) => {
  return (
    Object.keys(DIRECTIONS).filter((direction) => {
      return !boardsEqual(board, moveTiles(board, direction))
    }).length == 0
  )
}

const hasWon = (board) => {
  return flatten(board).filter((tile) => tile === "2048").length > 0
}

export {
  newSquareNumber,
  moveTiles,
  initializeBoard,
  takeTurn,
  scoreDelta,
  gameOver,
  hasWon,
}
