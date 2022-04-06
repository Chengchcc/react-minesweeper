import type { Dispatch } from 'react'
import { createContext } from 'react'
import type { GameConfig, GameStatus } from '../types'
import { checkIfWon, generateBlock } from '../utils'

const defaultGameConfig: GameConfig = {
  height: 9,
  width: 9,
  mines: 10,
}

export const initialState = {
  board: generateBlock(defaultGameConfig),
  status: 'ready' as GameStatus,
  minesGenerated: false,
  elapsedTime: 0,
  ...defaultGameConfig,
}

type GameState = typeof initialState
type GameAction = 'setBoard' | 'setStatus' | 'setMinesGenerated' | 'reset' | 'setElapsedTime' | 'init'
export const gameReducer = (state: GameState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'init':
      return { ...state, ...action.payload }
    case 'setBoard': {
      const isWon = checkIfWon(state.board)
      let status = state.status
      if (state.minesGenerated && status === 'playing' && isWon)
        status = 'won'

      return { ...state, board: action.payload, status }
    }
    case 'setStatus':
      return { ...state, status: action.payload }
    case 'setMinesGenerated':
      return { ...state, minesGenerated: action.payload }
    case 'setElapsedTime':
      return { ...state, elapsedTime: action.payload }
    case 'reset': {
      const { height = state.height, width = state.width, mines = state.width } = (action.payload || defaultGameConfig) as GameConfig
      const board = generateBlock({ height, width, mines })
      return {
        ...state,
        ...action.payload,
        minesGenerated: false,
        status: 'ready',
        board,
      }
    }
    default:
      return state
  }
}

export const GameContext = createContext<{
  state: GameState
  dispatch: Dispatch<{ type: GameAction; payload?: any }>
}>({} as any)
