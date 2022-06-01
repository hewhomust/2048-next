import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react"
import ScoreCard from "../../../components/ScoreCard/ScoreCard"
import "@testing-library/jest-dom"

describe("ScoreCard", () => {
  test("displays given score and title", () => {
    render(<ScoreCard score={20} title={"score"}></ScoreCard>)
    const { getByText } = within(screen.getByTestId("scoreCard"))

    waitFor(() => expect(getByText("20")).toBeVisible())
    waitFor(() => expect(getByText("score")).toBeVisible())
  })
})
