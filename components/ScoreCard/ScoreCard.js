const ScoreCard = ({ title, score }) => {
  return (
    <div className="bg-[#BBADA0] px-3 pt-2 lg:px-6 pb-1 flex flex-col items-center text-white rounded-md">
      <div className="uppercase text-[#eee4da] text-sm font-semibold">
        {title}
      </div>
      <div className="font-bold text-2xl leading-none">{score}</div>
    </div>
  )
}

export default ScoreCard
