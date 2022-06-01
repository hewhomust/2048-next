import useMoveTiles from "./useMoveTiles"
import { EMPTY_BOARD, initializeBoard, DIRECTIONS, takeTurn } from "../lib/2048"
import { useState, useEffect, useMemo, useCallback } from "react"
import produce from "immer"
import { gameOver as isGameOver } from "../lib/2048"
import useBestScoreHook from "./useBestScoreHook"

const initialState = {
  board: EMPTY_BOARD,
  score: 0,
}

const use2048 = () => {
  const { moveDirection, moveCount } = useMoveTiles()
  const [{ board, score }, setState] = useState(initialState)
  const { bestScore, setBestScore } = useBestScoreHook()

  useEffect(() => {
    setState((prev) => {
      return produce(prev, (draft) => {
        draft.board = initializeBoard()
        draft.score = 0
      })
    })
  }, [])

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

  const newGame = useCallback(() => {
    setState((prev) => {
      return produce(prev, (draft) => {
        draft.board = initializeBoard()
        draft.score = 0
      })
    })
  }, [])

  return { board, newGame, score, gameOver, bestScore }
}

export default use2048
