import { useCallback, useEffect, useState } from "react"

const LOCAL_STORAGE_KEY = "2048_BEST_SCORE"

const useBestScore = () => {
  const [bestScore, setBestScoreOriginal] = useState(0)

  return {
    bestScore,
    setBestScore: useCallback((score) => {
      if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, 0)
      }

      const localStorageScore = localStorage.getItem(LOCAL_STORAGE_KEY)
      const bestScore = score >= localStorageScore ? score : localStorageScore
      localStorage.setItem(LOCAL_STORAGE_KEY, bestScore)

      setBestScoreOriginal((prev) => bestScore)
    }, []),
  }
}

export default useBestScore
