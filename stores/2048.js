import produce from "immer"
import { Either } from "monet"
import { identity } from "ramda"
import create from "zustand"
import { immer } from "zustand/middleware/immer"
import {
  initializeBoard as initializeBoardState,
  takeTurn,
  boardsEqual,
  newTile,
  scoreDelta,
  isBoardEmpty,
  maxID,
  newSquareNumber,
} from "../lib/2048"

import { tryCatch } from "../utils"

export const LOCAL_STORAGE_KEY = "2048_GAME_STATE"

const initializeBoard = (key) => (storage) => (prev) =>
  tryCatch(() => JSON.parse(storage.getItem(key)))
    .chain((localStorageState) =>
      isBoardEmpty(localStorageState.board) || !localStorageState.board[0].id
        ? Either.Left("")
        : Either.Right(
            produce(prev, (draft) => {
              draft.board = localStorageState.board
              draft.score = localStorageState.score
              draft.initialized = true
              draft.keepPlaying = localStorageState.keepPlaying
            })
          )
    )
    .cata(
      () =>
        produce(prev, (draft) => {
          draft.initialized = true
          draft.board = initializeBoardState(1).run()
        }),
      identity
    )

const useStore = create(
  immer((set, get) => ({
    board: [],
    tileHeight: 0,
    tileGap: 0,
    animationDuration: 300,
    tilePositions: {},
    score: 0,
    bestScore: 0,
    keepPlaying: false,
    won: false,
    moving: false,
    initialized: false,
    gameNumber: 0,
    move: (direction) => {
      if (get().moving) {
        return
      }

      set((state) => {
        state.moving = true

        const { afterMerged, beforeMerged: nextBoard } = takeTurn(
          state.board,
          direction
        )

        if (boardsEqual(nextBoard, state.board)) {
          state.moving = false
          return state
        }

        state.score += scoreDelta(state.board, afterMerged)

        setTimeout(() => {
          set((state) => {
            state.board = newTile(afterMerged, maxID(nextBoard)).run()
            state.moving = false
            return state
          })
        }, get().animationDuration)

        state.board = nextBoard
        return state
      })
    },
    initializeBoard: () => {
      set(initializeBoard(LOCAL_STORAGE_KEY)(localStorage))
    },
    setTileHeight: (tileHeight) => {
      set((state) => {
        state.tileHeight = tileHeight
      })
    },
    setTileGap: (gap) => {
      set((state) => {
        state.tileGap = Number(gap)
      })
    },
    setTilePositions: (index, left, top) => {
      set((state) => {
        state.tilePositions[index] = { top, left }

        return state
      })
    },
    newGame: () => {
      set((state) => {
        state.keepPlaying = false
        state.score = 0
        state.gameNumber += 1
        state.board = initializeBoardState(1).run()
        return state
      })
    },
    setKeepPlaying: (keepPlaying) => {
      set((state) => {
        state.keepPlaying = keepPlaying
      })
    },
  }))
)

export default useStore
