import { useState } from "react"
import {
  EMPTY_BOARD,
  initializeBoard,
  DIRECTIONS,
  takeTurn,
  hasWon,
} from "../lib/2048"

const initialState = {
  board: EMPTY_BOARD,
  score: 0,
  keepPlaying: false,
}

const useGameState = () => {
  const [gameState, setGameState] = useState(initialState)

  return { gameState, setGameState }
}

export default useGameState
