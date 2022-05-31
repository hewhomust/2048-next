import { getRandomInt } from "../../utils"

describe("getRandomInt()", () => {
  test("returns ints up to max", () => {
    const max = 16
    const numbers = {}

    for (let i = 0; i < Infinity; i++) {
      const randomInt = getRandomInt(max)
      numbers[randomInt] = true

      if (Object.keys(numbers).length == max) {
        break
      }
    }

    expect(Object.keys(numbers).length).toBe(max)
  })

  test("works with negative maxes", () => {
    const max = -16
    const numbers = {}

    for (let i = 0; i < Infinity; i++) {
      const randomInt = getRandomInt(max)
      numbers[randomInt] = true

      if (Object.keys(numbers).length == Math.abs(max)) {
        break
      }
    }

    expect(Object.keys(numbers).length).toBe(Math.abs(max))
  })
})
