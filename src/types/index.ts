export enum FlagStatus {
  None = 0,
  Flag = 1,
  Question = 2,
}

export interface BlockState {
  x: number
  y: number
  isMine: boolean
  isOpen: boolean
  flag: FlagStatus // 0: no flag, 1: flag, 2: question mark
  adjacentMines: number
}

export interface GameConfig {
  height: number
  width: number
  mines: number
}

export type GameStatus = 'ready' | 'playing' | 'lost' | 'won'
