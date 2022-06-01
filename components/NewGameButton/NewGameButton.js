import { motion } from "framer-motion"

const variants = {
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.5,
    },
  },
}

const NewGameButton = ({ newGameHandler }) => {
  return (
    <motion.button
      whileHover="hover"
      variants={variants}
      onClick={newGameHandler}
      className="bg-[#8f7a66] text-white capitalize p-2 text-sm font-bold rounded-md lg:text-lg lg:px-5"
    >
      New Game
    </motion.button>
  )
}

export default NewGameButton
