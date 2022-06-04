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

const ScoreCard = ({ title, score, ...props }) => {
  return (
    <motion.div
      {...props}
      className="flex flex-col items-center px-3 pt-2 pb-1 text-white rounded-md bg-brown-200 lg:px-6 lg:pb-2"
    >
      <motion.div
        data-testid="scoreCardTitle"
        className="uppercase text-[#eee4da] text-sm font-semibold"
      >
        {title}
      </motion.div>
      <motion.p
        key={score}
        data-testid="scoreCardScore"
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
