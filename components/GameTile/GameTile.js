import { getBaseLog } from "../../utils"
import { useEffect, useState } from "react"
import { getFontSize, getBackgroundColour, getTextColour } from "./utils"
import { motion, AnimatePresence } from "framer-motion"

const variants = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
}

const GameTile = ({ number }) => {
  if (!Number.isInteger(getBaseLog(2, number)) || number < 2) {
    number = ""
  }

  const fontSize = getFontSize(number, true)
  const backgroundColour = getBackgroundColour(parseInt(number, 10))
  const textColour = getTextColour(parseInt(number, 10))
  const fontSizeDigit = Number(fontSize.split("xl")[0])

  return (
    <GameTileContainer>
      {number && (
        <motion.div
          // variants={variants}
          // initial="initial"
          // animate="animate"
          style={{ backgroundColor: backgroundColour, color: textColour }}
          className={`pointer-events-none w-full h-full select-none aspect-square rounded-md elevation-1 grid place-items-center lg:text-${
            fontSizeDigit + 2
          }xl text-${fontSize} font-bold`}
        >
          {number}
        </motion.div>
      )}
    </GameTileContainer>
  )
}

const GameTileContainer = ({ children }) => {
  return (
    <motion.div
      className={`bg-[#CDC1B4] pointer-events-none select-none aspect-square rounded-md elevation-1 grid place-items-center`}
    >
      {children}
    </motion.div>
  )
}

export default GameTile
