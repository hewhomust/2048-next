import { getBaseLog } from "../../utils"
import { useEffect, useState } from "react"
import { getFontSize, getBackgroundColour, getTextColour } from "./utils"

const GameSquare = ({ number }) => {
  if (!Number.isInteger(getBaseLog(2, number)) || number < 2) {
    number = ""
  }

  number = number.toString()

  const fontSize = getFontSize(number, true)
  const backgroundColour = getBackgroundColour(parseInt(number, 10))
  const textColour = getTextColour(parseInt(number, 10))
  const fontSizeDigit = Number(fontSize.split("xl")[0])

  return (
    <div
      style={{ backgroundColor: backgroundColour, color: textColour }}
      className={`pointer-events-none select-none aspect-square rounded-md elevation-1 grid place-items-center lg:text-${
        fontSizeDigit + 2
      }xl text-${fontSize} font-bold`}
    >
      {number}
    </div>
  )
}

export default GameSquare
