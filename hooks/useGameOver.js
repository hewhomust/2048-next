import useStore from "../stores/2048"
import { useMemo } from "react"
import { gameOver as isGameOver } from "../lib/2048"

const useGameOver = () => {
  const board = useStore((state) => state.board)
  const gameOver = useMemo(() => {
    return isGameOver(board)
  }, [board])

  return {
    gameOver,
  }
}

export default useGameOver
