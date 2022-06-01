import { useCallback, useEffect, useState } from "react"
import { DIRECTIONS } from "../lib/2048"

const useMoveTiles = () => {
  const [moveDirection, setMoveDirection] = useState()
  const [moveCount, setMoveCount] = useState(0)

  const handleKeydown = useCallback((e) => {
    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault()
      setMoveDirection(
        (prev) => DIRECTIONS[e.key.split("Arrow")[1].toUpperCase()]
      )

      setMoveCount((prev) => prev + 1)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown)

    return () => {
      document.removeEventListener("keydown", handleKeydown)
    }
  }, [handleKeydown])

  return { moveDirection, moveCount }
}

export default useMoveTiles
