import type { BlockState, GameConfig } from '../types'
import { FlagStatus } from '../types'

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]

function getBlockSiblings(board: BlockState[][], block: BlockState) {
  const [height, width] = [board.length, board[0].length]
  return directions.map(([dx, dy]) => {
    const [x, y] = [block.x + dx, block.y + dy]
    if (x < 0 || x >= width || y < 0 || y >= height)
      return undefined
    else
      return board[y][x]
  }).filter(Boolean) as BlockState[]
}

export function generateBlock(config: GameConfig): BlockState[][] {
  return Array.from({ length: config.height }, (_, y) =>
    Array.from({ length: config.width }, (_, x) => ({
      y,
      x,
      isMine: false,
      isOpen: false,
      flag: FlagStatus.None,
      adjacentMines: 0,
    }),
    ))
}

export function generateMines(board: BlockState[][], mines: number, initialBlock: BlockState) {
  const [height, width] = [board.length, board[0].length]
  const minesToGenerate = mines
  let minesGenerated = 0
  while (minesGenerated < minesToGenerate) {
    const randomY = Math.floor(Math.random() * height)
    const randomX = Math.floor(Math.random() * width)
    if (Math.abs(randomY - initialBlock.y) > 1 || Math.abs(randomX - initialBlock.x) > 1) {
      if (!board[randomY][randomX].isMine) {
        board[randomY][randomX].isMine = true
        minesGenerated++
      }
    }
  }
  return updateAdjacentMines(board)
}

export function updateAdjacentMines(board: BlockState[][]) {
  board.forEach((row) => {
    row.forEach((block) => {
      if (block.isMine)
        return
      getBlockSiblings(board, block).forEach((b) => {
        if (b.isMine)
          block.adjacentMines++
      })
    })
  })
  return board
}

export function expandZero(board: BlockState[][], block: BlockState) {
  if (block.adjacentMines)
    return

  getBlockSiblings(board, block).forEach((b) => {
    if (!b.isOpen) {
      if (b.flag === FlagStatus.None)
        b.isOpen = true
      expandZero(board, b)
    }
  })
  return board
}

export async function autoExpand(board: BlockState[][], block: BlockState) {
  return new Promise<BlockState[]>((resolve, reject) => {
    if (block.flag !== FlagStatus.None)
      return resolve([])
    const siblings = getBlockSiblings(board, block)
    const flags = siblings.filter(b => b.flag === FlagStatus.Flag).length
    if (flags === block.adjacentMines) {
      siblings.forEach((b) => {
        if (b.flag !== FlagStatus.None || b.isOpen)
          return
        b.isOpen = true
        expandZero(board, b)
        if (b.isMine) {
        // boom !!!
          return reject(b)
        }
      })
    }

    const notOpened = siblings.filter(b => !b.isOpen && b.flag === FlagStatus.None)
    return resolve(notOpened)
  })
}

export function checkIfWon(board: BlockState[][]) {
  const blocks = board.flat()
  return !blocks.some(block => !block.isMine && !block.isOpen)
}
