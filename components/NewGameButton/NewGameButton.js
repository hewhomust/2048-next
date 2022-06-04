import { motion } from "framer-motion"
import useStore from "../../stores/2048"

const variants = {
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.5,
    },
  },
}

const NewGameButton = () => {
  const newGame = useStore((state) => state.newGame)

  return (
    <motion.button
      whileHover="hover"
      role="button"
      variants={variants}
      onClick={newGame}
      className="bg-[#8f7a66] text-white capitalize p-2 text-sm font-bold rounded-md lg:text-lg lg:px-5"
    >
      New Game
    </motion.button>
  )
}

export default NewGameButton
