import ScoreCard from "../components/ScoreCard/ScoreCard"
import Head from "next/head"
import NewGameButton from "../components/NewGameButton/NewGameButton"
import GameBoard from "../components/GameBoard/GameBoard"
import GameDescription from "../components/GameDescription/GameDescription"
import useStoreGameState from "../hooks/useStoreGameState"
import useStore from "../stores/2048"
import { useEffect } from "react"
import usePlayerInput from "../hooks/usePlayerInput"
import useBestScore from "../hooks/useBestScoreHook"

export default function Home() {
  const initializeBoard = useStore((state) => state.initializeBoard)
  const { moveDirection, moveCount, addSwipe } = usePlayerInput()
  const score = useStore((state) => state.score)
  const { bestScore } = useBestScore()

  const move = useStore((state) => state.move)
  useStoreGameState()

  useEffect(() => {
    initializeBoard()
  }, [initializeBoard])

  useEffect(() => {
    if (!moveDirection) {
      return
    }

    move(moveDirection)
  }, [moveDirection, moveCount, move])

  return (
    <>
      <Head>
        <title>2048</title>
      </Head>

      <div {...addSwipe} className="bg-[#FAF8EF] min-h-screen">
        <div className="mx-auto max-w-[500px] lg:px-0 px-10  pt-4 pb-40">
          <div className="flex items-end justify-between mb-6 lg:items-center">
            <h1
              data-testid="gameTitle"
              className="text-3xl font-bold lg:text-7xl lg:mt-8 lg:tracking-wide text-brown-100"
            >
              2048
            </h1>
            <div className="flex gap-1">
              <ScoreCard
                data-testid="score"
                title="Score"
                score={score}
              ></ScoreCard>
              <ScoreCard
                data-testid="bestScore"
                title="Best"
                score={bestScore}
              ></ScoreCard>
            </div>
          </div>
          <div className="flex items-end justify-between mb-4 lg:mb-10 ">
            <div className="text-sm text-[15px] leading-relaxed">
              <p className="text-lg lg:text-xl">
                Join the tiles, get to{" "}
                <span className="font-bold text-brown-100">2048!</span>
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
