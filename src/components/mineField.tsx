import React from 'react'
import { GameContext } from '../hooks/useGameContext'
import MineBlock from './mineblock'

const MineField = () => {
  const { state } = React.useContext(GameContext)

  return (
    <div
      className="p-5 w-full overflow-auto"
    >
      {
        state.board.map((row, y) => (
          <div
            key={y}
            className="flex items-center justify-center w-max m-auto"
          >
            {
              row.map((block, x) => (
                <MineBlock key={x} block={block} />
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

export default MineField
