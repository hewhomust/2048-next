import {
  getFontSize,
  getBackgroundColour,
  getTextColour,
} from "../../../components/GameSquare/utils"

describe("getFontSize()", () => {
  it("given a one digit number returns 4xl", () => {
    expect(getFontSize(4)).toBe("4xl")
  })

  it("given a two digit number returns 4xl", () => {
    expect(getFontSize(32)).toBe("4xl")
  })

  it("given a three digit number returns 3xl", () => {
    expect(getFontSize(128)).toBe("3xl")
  })

  it("given a four digit number returns 2xl", () => {
    expect(getFontSize(1024)).toBe("2xl")
  })

  it("given a five digit number returns xl", () => {
    expect(getFontSize(16384)).toBe("xl")
  })
})

describe("getBackgroundColour()", () => {
  it("exists", () => {
    getBackgroundColour(2)
  })

  it("given the number 2 returns #EEE4DA", () => {
    expect(getBackgroundColour(2)).toBe("#EEE4DA")
  })

  it("given the number 4 returns #EEE1C9", () => {
    expect(getBackgroundColour(4)).toBe("#EEE1C9")
  })

  it("given the number 8 returns #F3B27A", () => {
    expect(getBackgroundColour(8)).toBe("#F3B27A")
  })

  it("given the number 16 returns #F69664", () => {
    expect(getBackgroundColour(16)).toBe("#F69664")
  })

  it("given the number 32 returns #F77C5F", () => {
    expect(getBackgroundColour(32)).toBe("#F77C5F")
  })

  it("given the number 64 returns #F75F3B", () => {
    expect(getBackgroundColour(64)).toBe("#F75F3B")
  })

  it("given the number 128 returns #EDD073", () => {
    expect(getBackgroundColour(128)).toBe("#EDD073")
  })

  it("given the number 256 returns #EDCC62", () => {
    expect(getBackgroundColour(256)).toBe("#EDCC62")
  })

  it("given the number 512 returns #EDC850", () => {
    expect(getBackgroundColour(512)).toBe("#EDC850")
  })

  it("given the number 1024 returns #EDC53F", () => {
    expect(getBackgroundColour(1024)).toBe("#EDC53F")
  })

  it("given the number 2048 returns #EDC22E", () => {
    expect(getBackgroundColour(2048)).toBe("#EDC22E")
  })

  it("given the number 4096 returns #000", () => {
    expect(getBackgroundColour(4096)).toBe("#000")
  })

  it("given a number greater than 4096 returns #000", () => {
    expect(getBackgroundColour(8192)).toBe("#000")
  })
})

describe("getTextColour()", () => {
  it("given a number less than 8 returns #000", () => {
    expect(getTextColour(2)).toBe("#776E65")
  })

  it("given a number greater than 8 returns #FFF", () => {
    expect(getTextColour(16)).toBe("#FFF")
  })

  it("given 8 returns #FFF", () => {
    expect(getTextColour(8)).toBe("#FFF")
  })
})
