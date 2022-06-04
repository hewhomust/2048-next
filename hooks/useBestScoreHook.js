import { useEffect, useState } from "react"
import useStore from "../stores/2048"

export const LOCAL_STORAGE_KEY = "2048_BEST_SCORE"

const useBestScore = () => {
  const [bestScore, setBestScoreOriginal] = useState(0)
  const score = useStore((state) => state.score)

  useEffect(() => {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, 0)
    }

    const localStorageScore = localStorage.getItem(LOCAL_STORAGE_KEY)

    const bestScore = score >= localStorageScore ? score : localStorageScore
    localStorage.setItem(LOCAL_STORAGE_KEY, bestScore)

    setBestScoreOriginal((prev) => bestScore)
  }, [score])

  return {
    bestScore,
  }
}

export default useBestScore
