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
} from "../lib/2048"

export const LOCAL_STORAGE_KEY = "2048_GAME_STATE"

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
        return state
      })

      set((state) => {
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
            state.board = newTile(afterMerged, maxID(nextBoard))

            state.moving = false

            return state
          })
        }, get().animationDuration)

        state.board = nextBoard
        return state
      })
    },
    initializeBoard: () => {
      set((prev) => {
        const localStorageState =
          localStorage.getItem(LOCAL_STORAGE_KEY) &&
          JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))

        prev.initialized = true

        if (
          localStorageState &&
          !isBoardEmpty(localStorageState.board) &&
          localStorageState.board[0].id
        ) {
          const gameState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))

          prev.board = gameState.board
          prev.score = gameState.score
          prev.keepPlaying = gameState.keepPlaying

          return prev
        }

        prev.board = initializeBoardState(1)
        return prev
      })
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
        state.board = initializeBoardState(1)
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
