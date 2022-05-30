const getFontSize = (number) => {
  number = number.toString()

  let size

  switch (number.length) {
    case 3:
      size = 3
      break
    case 4:
      size = 2
      break
    case 5:
      size = 1
      break
    default:
      size = 4
  }

  return size == 1 ? "xl" : `${size}xl`
}

const getBackgroundColour = (number) => {
  const backgroundColourMap = {
    2: "#EEE4DA",
    4: "#EEE1C9",
    8: "#F3B27A",
    16: "#F69664",
    32: "#F77C5F",
    64: "#F75F3B",
    128: "#EDD073",
    256: "#EDCC62",
    512: "#EDC850",
    1024: "#EDC53F",
    2048: "#EDC22E",
  }

  if (number >= 4096) {
    return "#000"
  }

  return backgroundColourMap[number] ?? "#CDC1B4"
}

const getTextColour = (number) => {
  return number < 8 ? "#776E65" : "#FFF"
}

export { getFontSize, getBackgroundColour, getTextColour }
