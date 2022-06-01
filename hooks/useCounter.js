import { useCallback, useState } from "react"

const useCounter = () => {
  const [counter, setCounter] = useState(0)

  const increment = useCallback(() => {
    setCounter((prev) => prev + 1)
  }, [setCounter])

  const decrement = useCallback(() => {
    setCounter((prev) => prev - 1)
  }, [setCounter])

  return {
    counter,
    increment,
    decrement,
  }
}

export default useCounter
