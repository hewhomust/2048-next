function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x)
}

function transposeArray(array, arrayLength) {
  var newArray = []
  for (var i = 0; i < array.length; i++) {
    newArray.push([])
  }

  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < arrayLength; j++) {
      newArray[j].push(array[i][j])
    }
  }

  return newArray
}

function padArrayStart(arr, len, padding) {
  return Array(len - arr.length)
    .fill(padding)
    .concat(arr)
}

function padArrayEnd(arr, len, padding) {
  return arr.concat(Array(len - arr.length).fill(padding))
}

export { getBaseLog, transposeArray, padArrayStart, padArrayEnd }
