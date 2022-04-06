
import React from 'react'
import { GameContext, gameReducer, initialState } from '../hooks/useGameContext'
const GameProvider: React.FunctionComponent = (props) => {
  const [state, dispatch] = React.useReducer(gameReducer, initialState)
  return <GameContext.Provider value={{ state, dispatch }}>
    {props.children}
  </GameContext.Provider>
}

export default GameProvider
