import useStore from "../stores/2048"
import { hasWon } from "../lib/2048"
import { useMemo } from "react"

const useWon = () => {
  const board = useStore((state) => state.board)
  const keepPlaying = useStore((state) => state.keepPlaying)

  const won = useMemo(() => {
    return hasWon(board) && !keepPlaying
  }, [board, keepPlaying])

  return { won }
}

export default useWon
