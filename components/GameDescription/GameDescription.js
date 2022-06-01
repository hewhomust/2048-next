const GameDescription = () => {
  return (
    <p className="text-lg tracking-wide">
      <strong className="font-bold uppercase text-brown-100">
        How to Play
      </strong>
      : Use your <strong className="text-brown-100">arrow keys</strong> to move
      the tiles. Tiles with the same number{" "}
      <strong className="text-brown-100">merge into one</strong> when they
      touch. Add them up to reach{" "}
      <strong className="text-brown-100">2048!</strong>
    </p>
  )
}

export default GameDescription
