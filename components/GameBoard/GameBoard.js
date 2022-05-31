import GameTile from "../GameTile/GameSquare"
import { useState } from "react"

const GameBoard = () => {
  const [number, setNumber] = useState(2)
  const squares = [...Array(16).keys()]

  const increment = () => {
    setNumber((prev) => {
      return prev * 2
    })
  }

  const decrement = () => {
    setNumber((prev) => {
      return prev / 2
    })
  }

  return (
    <>
      <div className="bg-[#BBADA0] rounded-md p-[0.6rem] lg:p-[0.9rem] grid grid-cols-4 gap-[0.6rem] lg:gap-[1rem] elevation-2">
        {squares.map((square) => {
          return <GameTile key={square} number={number}></GameTile>
        })}
      </div>
    </>
  )
}

export default GameBoard
