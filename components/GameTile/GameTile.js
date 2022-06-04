import { getFontSize, getBackgroundColour, getTextColour } from "./utils"
import { motion, AnimatePresence } from "framer-motion"
import { indexToCoords } from "../../lib/2048"
import useStore from "../../stores/2048"
import usePrevProps from "../../hooks/usePrevProps"
import { useState, useEffect } from "react"

const GameTile = ({ tile }) => {
  const prevValue = usePrevProps(tile.value)
  const [scale, setScale] = useState(1)

  const number = tile.value
  const fontSize = getFontSize(number, true)
  const backgroundColour = getBackgroundColour(parseInt(number, 10))
  const textColour = getTextColour(parseInt(number, 10))
  const fontSizeDigit = Number(fontSize.split("xl")[0])
  const tileHeight = useStore((state) => state.tileHeight)
  const tilePositions = useStore((state) => state.tilePositions)
  const animationDuration = useStore((state) => state.animationDuration)

  const { top, left } = tilePositions[tile.index]

  const newTile = !prevValue

  useEffect(() => {
    if (newTile || prevValue !== tile.value) {
      setScale(1.1)

      setTimeout(() => {
        setScale(1)
      }, animationDuration)
    }
  }, [newTile, prevValue, tile.value, animationDuration])

  return (
    <motion.div
      style={{
        backgroundColor: backgroundColour,
        color: textColour,
        top: top,
        left: left,
        width: tileHeight,
        height: tileHeight,
        zIndex: tile.id,
        scale: scale,
        transition: `top ${animationDuration}ms,left ${animationDuration}ms,scale ${animationDuration}ms`,
      }}
      className={`absolute top-0 left-0 ease-in pointer-events-none select-none aspect-square rounded-md elevation-1 grid place-items-center lg:text-${
        fontSizeDigit + 2
      }xl text-${fontSize} font-bold`}
    >
      {number}
    </motion.div>
  )
}

export default GameTile
