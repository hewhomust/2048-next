import { useRef, useEffect } from "react"

const usePrevProps = (value) => {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}

export default usePrevProps
