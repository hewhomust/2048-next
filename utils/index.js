import { curry } from "ramda"
import * as RA from "ramda-adjunct"
import { Either } from "monet"
import * as R from "ramda"

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

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

const longerThan = curry((length, l) => {
  return l.length > length
})

const maxNumber = (l) => Math.max(...l)

function trampoline(f) {
  return function trampolined(...args) {
    let result = f.bind(null, ...args)

    while (typeof result === "function") result = result()

    return result
  }
}

const fromNullable = (x) => {
  return RA.isNull(x) || RA.isUndefined(x) ? Either.Left(null) : Either.Right(x)
}

const indexedMap = R.addIndex(R.map)

export {
  getBaseLog,
  transposeArray,
  padArrayStart,
  padArrayEnd,
  getRandomInt,
  longerThan,
  maxNumber,
  trampoline,
  fromNullable,
  indexedMap,
}
