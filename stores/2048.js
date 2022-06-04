import create from "zustand"
import { immer } from "zustand/middleware/immer"
import {
  initializeBoard,
  takeTurn,
  boardsEqual,
  newTile,
  scoreDelta,
  beforeMerged,
  maxID,
} from "../lib/2048"

const LOCAL_STORAGE_KEY = "2048_GAME_STATE"

const useStore = create(
  immer((set, get) => ({
    board: [],
    number: 0,
    tileHeight: 0,
    tileGap: 0,
    animationDuration: 300,
    tilePositions: {},
    score: 0,
    bestScore: 0,
    keepPlaying: false,
    won: false,
    moving: false,
    gameOver: false,
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
        prev.board = initializeBoard()
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
    newGame: () => {},
    setKeepPlaying: () => {},
  }))
)

export default useStore
