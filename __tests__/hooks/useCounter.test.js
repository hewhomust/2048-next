import { renderHook, act } from "@testing-library/react"
import useCounter from "../../hooks/useCounter"

describe("useCounter", () => {
  const { result } = renderHook(() => useCounter())

  test("initializes as 0", () => {
    expect(result.current.counter).toBe(0)
  })

  test("can increment", () => {
    const { result } = renderHook(() => useCounter())

    act(() => {
      result.current.increment()
    })

    expect(result.current.counter).toBe(1)
  })

  test("can decrement", () => {
    const { result } = renderHook(() => useCounter())

    act(() => {
      result.current.decrement()
    })

    expect(result.current.counter).toBe(-1)
  })
})
