import { motion, AnimatePresence } from "framer-motion"

const variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeInOut",
    },
  },
}

const ScoreCard = ({ title, score }) => {
  return (
    <motion.div className="bg-[#BBADA0] px-3 pt-2 lg:px-6 lg:pb-2 pb-1 flex flex-col items-center text-white rounded-md">
      <motion.div className="uppercase text-[#eee4da] text-sm font-semibold">
        {title}
      </motion.div>
      <motion.p
        key={score}
        variants={variants}
        initial="initial"
        animate="animate"
        className="text-2xl font-bold leading-none"
      >
        {score}
      </motion.p>
    </motion.div>
  )
}

export default ScoreCard
