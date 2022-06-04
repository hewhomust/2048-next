import { motion } from "framer-motion"
import { useEffect } from "react"

const variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 0.8,
    transition: {
      duration: 1,
      delayChildren: 1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 1,
    },
  },
  scaleButton: {
    scale: 1.1,
  },
}

const GameWonModal = ({ keepPlaying }) => {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="absolute top-0 left-0 z-[100000] grid w-full h-full bg-green-400 opacity-80 place-items-center"
    >
      <div
        role="dialog"
        className="flex flex-col items-center text-4xl font-bold text-white opacity-100 gap-y-4"
      >
        <h2 data-testid="gameWonText">You win!!!</h2>
        <motion.button
          data-testid="keepPlayingButton"
          onClick={() => keepPlaying(true)}
          variants={variants}
          initial="initial"
          animate="enter"
          whileHover="scaleButton"
          className="p-4 bg-green-600 rounded-lg"
        >
          Keep Playing?
        </motion.button>
      </div>
    </motion.div>
  )
}

export default GameWonModal
