import { useEffect, useMemo } from "react"
import flatten from "lodash/flatten"
import { AnimatePresence, motion } from "framer-motion"
import GameOverModal from "../GameOverModal/GameOverModal"
import GameTile from "../GameTile/GameTile"
import GameWonModal from "../GameWonModal/GameWonModal"
import Grid from "../Grid/Grid"
import useStore from "../../stores/2048"

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

const GameBoard = ({ gameOver, won, keepPlaying }) => {
  const board = useStore((state) => state.board)

  return (
    <>
      <motion.div className="bg-brown-200 rounded-md  relative p-[0.6rem] lg:p-[0.9rem] elevation-2">
        <AnimatePresence>
          {gameOver && <GameOverModal></GameOverModal>}
          {won && <GameWonModal keepPlaying={keepPlaying}></GameWonModal>}
        </AnimatePresence>
        <Grid></Grid>
        {board.map((tile) => {
          return <GameTile key={tile.id} tile={tile}></GameTile>
        })}
      </motion.div>
    </>
  )
}

export default GameBoard
