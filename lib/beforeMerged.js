import { fromNullable } from "../utils"
import * as RA from "ramda-adjunct"
import { map, flatten } from "ramda"
import produce from "immer"
import { List } from "immutable"

const mergedTiles = (board, merges) =>
  List(merges)
    .map((merge) =>
      RA.Identity.of(merge)
        .map((merge) => board.find((tile) => tile.id === merge.end.id))
        .map((mergedTile) =>
          produce(merge, (draft) => {
            draft.start.index = mergedTile.index
            draft.end.index = mergedTile.index
          })
        )
        .map((merge) => [merge.start, merge.end])
        .get()
    )
    .chain((x) => x)
    .toJS()

const beforeMergedTiles = (board, mergedTiles) =>
  RA.Identity.of(mergedTiles)
    .map((mergedTiles) =>
      board.filter(
        (tile) =>
          !mergedTiles.find((preMergedTile) => tile.id == preMergedTile.id)
      )
    )
    .map((nonMergedTiles) =>
      mergedTiles
        .concat(nonMergedTiles)
        .sort((a, b) => Number(a.id) - Number(b.id))
    )
    .get()

const beforeMerged = (board, merges) =>
  fromNullable(merges[0])
    .map(() => mergedTiles(board, merges))
    .map((mergedTiles) => beforeMergedTiles(board, mergedTiles))
    .cata(
      () => board,
      (beforeMerged) => beforeMerged
    )

export { beforeMerged }
