import { compose } from "ramda"
import create from "zustand"
import { immer } from "zustand/middleware/immer"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import produce from "immer"

const useStore = create(
  immer((set, get) => ({
    tilePositions: {},
    tileHeight: 0,
    setTilePositions: (index, top, left) => {
      set((state) => {
        state.tilePositions[index] = { top, left }
        return state
      })
    },
    setTileHeight: (height) => {
      set((state) => {
        state.tileHeight = height
        return state
      })
    },
  }))
)

const BOARD_SIZE = 64

const indexToCoords = (index) => {
  return { row: Math.floor(index / 8), col: index % 8 }
}

const isEven = (x) => x % 2 == 0

const sumCoords = (coords) => coords.row + coords.col

const squareIsWhite = compose(isEven, sumCoords, indexToCoords)

const Piece = ({ piece }) => {
  const tilePositions = useStore((state) => state.tilePositions)
  const tileHeight = useStore((state) => state.tileHeight)
  const { top, left } = tilePositions[piece.index] ?? { top: 0, left: 0 }
  console.log(piece)

  return (
    <motion.div
      style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${tileHeight}px`,
        height: `${tileHeight}px`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 0.85,
        top: top,
        left: left,
        transition: {
          duration: 0.6,
          //   top: {
          //     duration: 0.25,
          //   },
          //   left: {
          //     delay: 0.25,
          //   },
        },
      }}
      className="absolute w-full h-full rounded-full bg-neutral-700"
    ></motion.div>
  )
}

const Square = ({ index, ...props }) => {
  const isWhite = squareIsWhite(index)
  const ref = useRef()
  const setTileHeight = useStore((state) => state.setTileHeight)
  const setTilePositions = useStore((state) => state.setTilePositions)

  useEffect(() => {
    setTileHeight(ref.current.clientWidth)
    setTilePositions(index, ref.current.offsetTop, ref.current.offsetLeft)
  }, [index, setTileHeight, setTilePositions])

  return (
    <div
      {...props}
      ref={ref}
      className={`grid place-items-center aspect-square ${
        isWhite ? "bg-white" : "bg-neutral-500"
      } `}
      key={index}
    ></div>
  )
}

const Board = () => {
  const squares = [...Array(BOARD_SIZE).keys()]

  return (
    <div className=" grid grid-cols-8 mx-auto max-w-[50rem] lg:p-10 p-2 bg-neutral-600 rounded-lg elevation-8">
      {squares.map((square) => {
        return <Square key={square} index={square}></Square>
      })}
    </div>
  )
}

const initialBoard = [
  {
    id: 1,
    index: 3,
  },
]

const Chess = () => {
  const [board1, setBoard1] = useState(initialBoard)

  const move = () => {
    console.log(3)
    setBoard1((prev) => {
      return produce(prev, (draft) => {
        draft[0].index = 10
        return draft
      })
    })
  }

  console.log(board1)

  return (
    <div className="container relative px-10 pt-10 mx-auto">
      <button
        onClick={move}
        className="p-4 text-3xl text-white bg-purple-600 rounded-lg"
      >
        Move
      </button>
      <Board></Board>
      {board1.map((piece) => {
        return <Piece key={piece.id} piece={piece}></Piece>
      })}
    </div>
  )
}

export default Chess
