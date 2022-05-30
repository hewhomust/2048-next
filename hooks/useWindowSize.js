import { useEffect, useState } from "react"

const useWindowSize = () => {
  console.log(document.documentElement.clientWidth)

  const [windowSize, setWindowSize] = useState({})

  const handleResize = () => {
    console.log(3)
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return { windowSize }
}

export default useWindowSize
