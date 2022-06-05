import { motion } from "framer-motion"

const variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 0.8,
    transition: {
      duration: 1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 1,
    },
  },
}

const GameOverModal = () => {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      data-testid="gameOverModal"
      exit="exit"
      className="absolute top-0 left-0 grid w-full h-full bg-yellow-400 z-[10000] opacity-80 place-items-center"
    >
      <div className="text-4xl font-bold text-white opacity-100">Game over</div>
    </motion.div>
  )
}

export default GameOverModal
