import { useCallback, useEffect, useState } from "react"
import { DIRECTIONS } from "../lib/2048"
import { useSwipeable } from "react-swipeable"

const usePlayerInput = () => {
  const [moveDirection, setMoveDirection] = useState()
  const [moveCount, setMoveCount] = useState(0)

  const handleInput = (direction) => {
    setMoveDirection(direction)
    setMoveCount((count) => count + 1)
  }

  const handleKeydown = useCallback((e) => {
    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault()
      handleInput(DIRECTIONS[e.key.split("Arrow")[1].toUpperCase()])
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown)

    return () => {
      document.removeEventListener("keydown", handleKeydown)
    }
  }, [handleKeydown])

  const handleSwipe = useCallback((e) => {
    handleInput(e.dir.toUpperCase())
  }, [])

  const addSwipe = useSwipeable({
    onSwiped: handleSwipe,
    preventScrollOnSwipe: true,
    swipeDuration: 500,
  })

  return { moveDirection, moveCount, addSwipe }
}

export default usePlayerInput
