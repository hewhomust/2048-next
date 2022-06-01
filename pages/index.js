import ScoreCard from "../components/ScoreCard/ScoreCard"
import Head from "next/head"
import NewGameButton from "../components/NewGameButton/NewGameButton"
import GameBoard from "../components/GameBoard/GameBoard"
import GameDescription from "../components/GameDescription/GameDescription"
import use2048 from "../hooks/use2048"

export default function Home() {
  const { board, newGame, score, gameOver, bestScore } = use2048()

  return (
    <>
      <Head>
        <title>2048</title>
      </Head>

      <div className="bg-[#FAF8EF] min-h-screen">
        <div className="mx-auto max-w-[500px] lg:px-0 px-10  pt-4 pb-40">
          <div className="flex items-end justify-between mb-2 lg:items-center lg:mb-4">
            <h1 className="font-bold text-3xl lg:text-7xl lg:mt-8 lg:tracking-wide text-[#776E65]">
              2048
            </h1>
            <div className="flex gap-1">
              <ScoreCard title="Score" score={score}></ScoreCard>
              <ScoreCard title="Best" score={bestScore}></ScoreCard>
            </div>
          </div>
          <div className="flex items-end justify-between mb-4 lg:mb-10 ">
            <div className="text-sm text-[15px] leading-relaxed">
              <p className="">
                Join the tiles, get to{" "}
                <span className="font-bold text-[#776e65]">2048!</span>
              </p>
              <p className="underline font-bold text-[#776e65]">
                How to play →
              </p>
            </div>
            <div>
              <NewGameButton newGameHandler={newGame}></NewGameButton>
            </div>
          </div>
          <div className="mb-8">
            <GameBoard board={board} gameOver={gameOver}></GameBoard>
          </div>
          <div>
            <GameDescription></GameDescription>
          </div>
        </div>
      </div>
    </>
  )
}
