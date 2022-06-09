import {
  flatten,
  reverse,
  clone,
  pipe,
  compose,
  reduce,
  filter,
  curry,
  map,
  not,
  any,
} from "ramda"
import * as R from "ramda"
import * as RA from "ramda-adjunct"
import { Identity } from "ramda-adjunct"
import { compare } from "js-deep-equals"
import { List, Map } from "immutable-ext"
import { trampoline } from "../utils"
import { Maybe, Either, Left } from "monet"
import { fromNullable, indexedMap } from "../utils"
import { beforeMerged } from "./beforeMerged"

import {
  transposeArray,
  padArrayEnd,
  getRandomInt,
  longerThan,
  maxNumber,
} from "../utils"
import produce from "immer"
import { cond } from "ramda"

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

const newTile = (board, maxID) =>
  Identity.of(maxID ? maxID + 1 : 1)
    .chain((nextID) =>
      Identity.of(listToGrid(board)).chain((newBoard) =>
        Identity.of(findRandomEmptySquare(newBoard))
          .map(({ row, column }) =>
            produce(newBoard, (draft) => {
              newBoard[row][column] = {
                id: nextID,
                value: Number(newSquareNumber()),
                index: 0,
              }
            })
          )
          .map((newBoard) => gridToList(newBoard))
      )
    )
    .get()

const newSquareNumber = () =>
  RA.Identity.of(Math.random())
    .map((x) => (x < 0.9 ? "2" : "4"))
    .get()

const getColumnsFromBoard = (board) => transposeArray(board, board.length)

const getBoardFromColumns = (columns) => transposeArray(columns, columns.length)

const listToGrid = (list) =>
  RA.Identity.of(
    [...Array(4).keys()].map((key) => [...Array(4).keys()].map((key) => "0"))
  )
    .map((grid) =>
      list.reduce((accum, tile) => {
        const [row, col] = indexToCoords(tile.index)
        accum[row][col] = tile
        return accum
      }, grid)
    )
    .get()

const gridToList = (grid) =>
  RA.Identity.of(flatten(grid))
    .map(
      indexedMap((tile, index) =>
        fromNullable(tile.value).cata(
          () => tile,
          () => Object.assign({}, tile, { index })
        )
      )
    )
    .map(filter((tile) => tile.value))
    .map(R.sort((a, b) => Number(a.id) - Number(b.id)))
    .get()

const indexToCoords = (index) => [Math.floor(index / 4), index % 4]

const moveRec = trampoline(function _moveRec(line, f = [], merges = []) {
  line = line.filter((tile) => tile.value)
  if (line.length === 0) {
    return { line: f, merges }
  }

  if (line.length === 1) {
    return _moveRec([], f.concat([line[0]]), merges)
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

    return _moveRec(line.slice(2), f.concat([lowerIndexTile]), merges)
  } else {
    return _moveRec(line.slice(1), f.concat(line[0]), merges)
  }
})

const moveLine = (line, direction) =>
  RA.Identity.of(direction === "RIGHT" ? reverse(line) : line)
    .map((line) => moveRec(line))
    .chain(({ line, merges }) =>
      RA.Identity.of(padArrayEnd(line, 4, 0)).map((moved) =>
        direction === "RIGHT"
          ? { line: reverse(moved), merges }
          : { line: moved, merges }
      )
    )
    .get()

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

const boardsEqual = (board1, board2) => compare(board1, board2)

const takeTurn = (board, direction) => moveTiles(clone(board), direction)

const initializeBoard = (startID) =>
  RA.Identity.of([])
    .map((board) => newTile(board, startID ?? 1))
    .map((board) => newTile(board, maxID(board)))
    .get()

const findRandomEmptySquare = trampoline(function _findRandomEmptySquare(
  board,
  emptySquare = null
) {
  if (emptySquare) {
    return emptySquare
  }

  const randomInt = getRandomInt(Math.pow(board.length, 2))
  const row = Math.floor(randomInt / board.length)
  const column = randomInt % board.length

  if (board[row][column].id) {
    return _findRandomEmptySquare(board, emptySquare)
  }

  return _findRandomEmptySquare(board, { row, column })
})

const groupTileValues = (tiles) =>
  tiles.reduce((accum, el) => {
    return produce(accum, (draft) => {
      if (!draft[el]) {
        draft[el] = 0
      }

      draft[el] += 1
    })
  }, {})

const gameOver = (board) =>
  RA.Identity.of(DIRECTIONS)
    .map(Object.keys)
    .map(
      filter((direction) => {
        return !boardsEqual(board, moveTiles(board, direction).afterMerged)
      })
    )
    .map((x) => x.length === 0)
    .get()

const hasWon = (board) =>
  RA.Identity.of(board)
    .map(flatten)
    .map(filter((tile) => tile.value === 2048))
    .map((x) => x.length > 0)
    .get()

const isBoardEmpty = (board) =>
  RA.Identity.of(board)
    .map(flatten)
    .map(any((tile) => tile.id))
    .map((x) => !x)
    .get()

const maxID = (board) =>
  RA.Identity.of(board)
    .map(map((tile) => tile.id))
    .map(maxNumber)
    .get()

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
