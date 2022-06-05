import { flatten, reverse, clone, pipe, compose } from "ramda"
import { compare } from "js-deep-equals"

import { transposeArray, padArrayEnd, getRandomInt } from "../utils"
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

const newTile = (board, maxID) => {
  let nextID = maxID ? maxID + 1 : 1

  const newBoard = listToGrid(board)

  const { row, column } = findRandomEmptySquare(newBoard)

  newBoard[row][column] = {
    id: nextID,
    value: Number(newSquareNumber()),
    index: 0,
  }

  return gridToList(newBoard)
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

const listToGrid = (list) => {
  const grid = [...Array(4).keys()].map((key) =>
    [...Array(4).keys()].map((key) => "0")
  )

  return list.reduce((accum, tile) => {
    const [row, col] = indexToCoords(tile.index)
    accum[row][col] = tile
    return accum
  }, grid)
}

const gridToList = (grid) => {
  grid = clone(grid)

  return flatten(grid)
    .map((tile, index) => {
      if (tile.value) {
        tile.index = index
      }

      return tile
    })
    .filter((tile) => tile.value)
    .sort((a, b) => {
      return Number(a.id) - Number(b.id)
    })
}

const indexToCoords = (index) => {
  return [Math.floor(index / 4), index % 4]
}

const moveRec = (line, f = [], merges = []) => {
  line = line.filter((tile) => tile.value)
  if (line.length === 0) {
    return { line: f, merges }
  }

  if (line.length === 1) {
    return moveRec([], f.concat([line[0]]), merges)
  }

  if (line[0].value && line[0].value === line[1].value) {
    const lowerIndexTile =
      Number(line[0].id) < Number(line[1].id) ? line[0] : line[1]
    const higherIndexTile =
      Number(line[0].id) > Number(line[1].id) ? line[0] : line[1]
    merges.push({
      start: clone(higherIndexTile),
      end: clone(lowerIndexTile),
    })
    lowerIndexTile.value = Number(line[0].value) + Number(line[1].value)

    return moveRec(line.slice(2), f.concat([lowerIndexTile]), merges)
  } else {
    return moveRec(line.slice(1), f.concat(line[0]), merges)
  }
}

const moveLine = (line, direction) => {
  line = direction === "RIGHT" ? reverse(line) : line
  const { line: newLine, merges } = moveRec(line)
  const moved = padArrayEnd(newLine, 4, 0)
  return direction === "RIGHT"
    ? { line: reverse(moved), merges }
    : { line: moved, merges }
}

const moveTiles = (board, direction) => {
  if (!["UP", "LEFT", "DOWN", "RIGHT"].includes(direction)) {
    throw new Error("DIRECTION is not UP, DOWN, LEFT or RIGHT")
  }

  board = clone(board)

  const grid = listToGrid(board)

  let move
  let merges
  let newBoard

  switch (direction) {
    case "LEFT":
    case "RIGHT":
      move = grid.map((row) => {
        return moveLine(row, direction)
      })

      merges = flatten(move.map((b) => b.merges))
      newBoard = move.map((b) => b.line)
      newBoard = gridToList(newBoard)

      return {
        beforeMerged: beforeMerged(newBoard, merges),
        afterMerged: newBoard,
      }

    case "UP":
    case "DOWN":
      move = getColumnsFromBoard(grid).map((row) => {
        return moveLine(row, direction === "UP" ? "LEFT" : "RIGHT")
      })

      merges = flatten(move.map((b) => b.merges))
      newBoard = move.map((b) => b.line)
      newBoard = gridToList(getBoardFromColumns(newBoard))

      return {
        beforeMerged: beforeMerged(newBoard, merges),
        afterMerged: newBoard,
      }
  }
}

const scoreDelta = (oldBoard, newBoard) => {
  oldBoard = flatten(listToGrid(oldBoard)).map((tile) =>
    tile.value ? tile.value : tile
  )
  newBoard = flatten(listToGrid(newBoard)).map((tile) =>
    tile.value ? tile.value : tile
  )

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
    { sum: 0, zipped: clone(zipped) }
  ).sum
}

const boardsEqual = (board1, board2) => {
  return compare(board1, board2)
}

const takeTurn = (board, direction) => {
  let newBoard = moveTiles(clone(board), direction)

  return newBoard
}

const initializeBoard = (startID) => {
  let board = []

  board = newTile(board, startID ?? 1)
  board = newTile(board, maxID(board))

  return board
}

const findRandomEmptySquare = (board) => {
  let emptySquare = null

  while (!emptySquare) {
    const randomInt = getRandomInt(Math.pow(board.length, 2))
    const row = Math.floor(randomInt / board.length)
    const column = randomInt % board.length

    if (board[row][column].id) {
      continue
    }

    emptySquare = { row, column }
  }

  return emptySquare
}

const groupTileValues = (board) => {
  return flatten(board).reduce((accum, el) => {
    return produce(accum, (draft) => {
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
      return !boardsEqual(board, moveTiles(board, direction).afterMerged)
    }).length == 0
  )
}

const hasWon = (board) => {
  return flatten(board).filter((tile) => tile.value === 2048).length > 0
}

const isBoardEmpty = (board) => {
  return !flatten(board).some((tile) => tile)
}

const beforeMerged = (board, merges) => {
  if (!merges || !merges.length) {
    return board
  }

  const mergedTiles = flatten(
    merges.map((merge) => {
      const mergedTile = board.find((tile) => tile.id === merge.end.id)
      merge = produce(merge, (draft) => {
        draft.start.index = mergedTile.index
        draft.end.index = mergedTile.index
      })

      return [merge.start, merge.end]
    })
  )

  const nonMergedTiles = board.filter(
    (tile) => !mergedTiles.find((preMergedTile) => tile.id === preMergedTile.id)
  )

  return mergedTiles
    .concat(nonMergedTiles)
    .sort((a, b) => Number(a.id) - Number(b.id))
}

const maxID = (board) => {
  return Math.max(...board.map((tile) => tile.id))
}

export {
  newSquareNumber,
  moveTiles,
  initializeBoard,
  takeTurn,
  scoreDelta,
  gameOver,
  hasWon,
  isBoardEmpty,
  gridToList,
  listToGrid,
  indexToCoords,
  boardsEqual,
  newTile,
  beforeMerged,
  maxID,
}
