import { getFontSize, getBackgroundColour, getTextColour } from "./utils"
import { motion, AnimatePresence } from "framer-motion"
import useStore from "../../stores/2048"

const GameTile = ({ tile }) => {
  const number = tile.value
  const fontSize = getFontSize(number, true)
  const backgroundColour = getBackgroundColour(parseInt(number, 10))
  const textColour = getTextColour(parseInt(number, 10))
  const fontSizeDigit = Number(fontSize.split("xl")[0])
  const tileHeight = useStore((state) => state.tileHeight)
  const tilePositions = useStore((state) => state.tilePositions)
  const animationDuration = useStore((state) => state.animationDuration)

  const { top, left } = tilePositions[tile.index]

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
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        top: top,
        scale: [0, 1.2, 1],
        left: left,
        transition: {
          duration: animationDuration / 1000,
        },
      }}
      className={`absolute pointer-events-none select-none aspect-square rounded-md elevation-2 grid place-items-center lg:text-${
        fontSizeDigit + 2
      }xl text-${fontSize} font-bold`}
    >
      {number}
    </motion.div>
  )
}

export default GameTile
