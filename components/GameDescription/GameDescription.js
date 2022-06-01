const GameDescription = () => {
  return (
    <p className="text-lg tracking-wide">
      <strong className="uppercase font-bold text-[#776e65]">
        How to Play
      </strong>
      : Use your <strong className="text-[#776e65]">arrow keys</strong> to move
      the tiles. Tiles with the same number{" "}
      <strong className="text-[#776e65]">merge into one</strong> when they
      touch. Add them up to reach{" "}
      <strong className="text-[#776e65]">2048!</strong>
    </p>
  )
}

export default GameDescription
