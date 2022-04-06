import React from 'react'
import GameProvider from './gameProvider'
import MineHeader from './mineHeader'
import MineField from './mineField'
import GameStatus from './gameStatus'
const Game: React.FunctionComponent = () => {
  return (
    <GameProvider>
      <GameStatus />
      <MineHeader/>
      <MineField/>
    </GameProvider>
  )
}

export default Game
