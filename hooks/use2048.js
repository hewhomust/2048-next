import usePlayerInput from "./usePlayerInput"
import {
  EMPTY_BOARD,
  initializeBoard,
  DIRECTIONS,
  takeTurn,
  hasWon,
  isBoardEmpty,
} from "../lib/2048"
import { useState, useEffect, useMemo, useCallback } from "react"
import produce from "immer"
import { gameOver as isGameOver } from "../lib/2048"
import useBestScoreHook from "./useBestScoreHook"

const initialState = {
  board: EMPTY_BOARD,
  score: 0,
  keepPlaying: false,
}

const LOCAL_STORAGE_KEY = "2048_GAME_STATE"

const use2048 = () => {
  const { moveDirection, moveCount, addSwipe } = usePlayerInput()
  const [gameState, setState] = useState(initialState)
  const { bestScore, setBestScore } = useBestScoreHook()
  const [initialized, setInitialized] = useState(false)
  const board = useMemo(() => gameState.board, [gameState.board])
  const score = useMemo(() => gameState.score, [gameState.score])
  const keepPlaying = useMemo(
    () => gameState.keepPlaying,
    [gameState.keepPlaying]
  )

  useEffect(() => {
    setState((prev) => {
      const localStorageState =
        localStorage.getItem(LOCAL_STORAGE_KEY) &&
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))

      setInitialized(true)

      if (localStorageState && !isBoardEmpty(localStorageState.board)) {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
      }

      return produce(prev, (draft) => {
        draft.board = aboard
        draft.score = 0
        draft.keepPlaying = false
      })
    })
  }, [])

  useEffect(() => {
    if (!initialized) {
      return
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState))
  }, [gameState, initialized])

  useEffect(() => {
    if (DIRECTIONS[moveDirection]) {
      setState((prev) => {
        const { board, score } = takeTurn(prev.board, moveDirection)
        return produce(prev, (draft) => {
          draft.board = board
          draft.score += score
        })
      })
    }
  }, [moveDirection, moveCount])

  const gameOver = useMemo(() => {
    return isGameOver(board)
  }, [board])

  useEffect(() => {
    setBestScore(score)
  }, [score, setBestScore])

  const setKeepPlaying = useCallback((keepPlaying) => {
    return setState((prev) => {
      return produce(prev, (draft) => {
        draft.keepPlaying = keepPlaying
      })
    })
  }, [])

  const won = useMemo(() => {
    return hasWon(board) && !keepPlaying
  }, [board, keepPlaying])

  const newGame = useCallback(() => {
    setState((prev) => {
      return produce(prev, (draft) => {
        draft.board = initializeBoard()
        draft.keepPlaying = false
        draft.score = 0
      })
    })
  }, [])

  return {
    board,
    newGame,
    score,
    gameOver,
    bestScore,
    won,
    setKeepPlaying,
    addSwipe,
  }
}

export default use2048
