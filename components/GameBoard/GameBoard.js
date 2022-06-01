import GameTile from "../GameTile/GameTile"
import { useMemo } from "react"
import flatten from "lodash/flatten"
import { AnimatePresence, motion } from "framer-motion"
import GameOverModal from "../GameOverModal/GameOverModal"
import GameTileContainer from "../GameTile/GameTile"

const variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  enter: {
    scale: [0, 1.1, 1],
    opacity: 1,
    transition: {
      duration: 1.2,
    },
  },
}

const GameBoard = ({ board, gameOver }) => {
  const squares = useMemo(() => {
    return flatten(board)
  }, [board])

  return (
    <>
      <motion.div className="bg-[#BBADA0] rounded-md relative p-[0.6rem] lg:p-[0.9rem] grid grid-cols-4 gap-[0.6rem] lg:gap-[1rem] elevation-2">
        <AnimatePresence>
          {gameOver && <GameOverModal></GameOverModal>}
        </AnimatePresence>
        {squares.map((square, index) => {
          return (
            <GameTileContainer key={index} number={square}></GameTileContainer>
          )
        })}
      </motion.div>
    </>
  )
}

export default GameBoard
