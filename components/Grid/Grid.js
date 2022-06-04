import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import useWindowResize from "../../hooks/useWindowResize"
import useStore from "../../stores/2048"

const TileContainer = ({ index }) => {
  const ref = useRef()
  const setTileHeight = useStore((state) => state.setTileHeight)
  const setTilePositions = useStore((state) => state.setTilePositions)
  const { dimensions } = useWindowResize()

  useEffect(() => {
    setTileHeight(ref.current.clientWidth)
    setTilePositions(index, ref.current.offsetLeft, ref.current.offsetTop)
  }, [index, setTileHeight, setTilePositions, dimensions])

  return (
    <motion.div
      ref={ref}
      className={`bg-[#CDC1B4] pointer-events-none select-none aspect-square rounded-md elevation-1 grid place-items-center`}
    ></motion.div>
  )
}

const Grid = () => {
  const numbers = [...Array(16).keys()]

  return (
    <div className="grid grid-cols-4 gap-[0.6rem] lg:gap-[1rem] ">
      {numbers.map((number) => {
        return <TileContainer index={number} key={number}></TileContainer>
      })}
    </div>
  )
}

export default Grid
