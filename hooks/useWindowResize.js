import { useEffect, useState } from "react"

const useWindowResize = () => {
  const [dimensions, setDimensions] = useState()

  const handleDimensionChange = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEffect(() => {
    window.addEventListener("resize", handleDimensionChange)

    return () => {}
  }, [])

  return { dimensions }
}

export default useWindowResize
