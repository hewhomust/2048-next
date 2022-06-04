import { LOCAL_STORAGE_KEY } from "../stores/2048"
import useStore from "../stores/2048"
import { useEffect } from "react"

const useStoreGameState = () => {
  const gameState = useStore((state) => {
    return {
      board: state.board,
      score: state.score,
      keepPlaying: state.keepPlaying,
    }
  })
  const initialized = useStore((state) => state.initialized)

  useEffect(() => {
    if (!initialized) {
      return
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState))
  }, [gameState, initialized])

  return {}
}

export default useStoreGameState
