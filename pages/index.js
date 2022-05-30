import ScoreCard from "../components/ScoreCard/ScoreCard"
import Head from "next/head"
import NewGameButton from "../components/NewGameButton/NewGameButton"
import GameBoard from "../components/GameBoard/GameBoard"

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

export default function Home() {
  return (
    <>
      <Head>
        <title>2048</title>
      </Head>

      <div className="bg-[#FAF8EF] min-h-screen">
        <div className="mx-auto max-w-[500px] lg:px-0 px-24 pt-4 pb-40">
          <div className="flex justify-between items-end lg:items-center mb-2 lg:mb-4">
            <h1 className="font-bold text-3xl lg:text-7xl lg:mt-8 lg:tracking-wide text-[#776E65]">
              2048
            </h1>
            <div className="flex gap-1">
              <ScoreCard title="Score" score="36"></ScoreCard>
              <ScoreCard title="Best" score="4440"></ScoreCard>
            </div>
          </div>
          <div className="flex justify-between items-end mb-4 lg:mb-10 ">
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
              <NewGameButton></NewGameButton>
            </div>
          </div>
          <div className="mb-8">
            <GameBoard></GameBoard>
          </div>
          <div>
            <GameDescription></GameDescription>
          </div>
        </div>
      </div>
    </>
  )
}
