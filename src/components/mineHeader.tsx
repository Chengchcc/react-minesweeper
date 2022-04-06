import React, { useContext, useEffect } from 'react'
import { useDeepCompareEffect } from '../hooks/useDeepCompareEffect'
import { GameContext } from '../hooks/useGameContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useTimer } from '../hooks/useTimer'
import { FlagStatus } from '../types'

function getConfig(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return { height: 9, width: 9, mines: 10 }
    case 'medium':
      return { height: 16, width: 16, mines: 40 }
    case 'hard':
      return { height: 16, width: 30, mines: 99 }
    default:
      return {}
  }
}

const mineHeader = () => {
  const { state, dispatch } = useContext(GameContext)
  const { board, minesGenerated, mines, status } = state
  const [storedState, saveState] = useLocalStorage('minesweeper', state)

  const timer = useTimer({
    onProgress: (time) => {
      dispatch({ type: 'setElapsedTime', payload: time })
    },
  })

  const mineRest = () => {
    if (!minesGenerated)
      return mines
    return board.flat().reduce((a, b) => a - (b.flag === FlagStatus.Flag ? 1 : 0), mines)
  }

  useDeepCompareEffect(() => {
    saveState(state)
  }, state)

  useEffect(() => {
    if (status === 'ready')
      timer.reset()
    else if (status === 'playing')
      timer.start()
    else
      timer.stop()
  }, [status])

  useEffect(() => {
    dispatch({ type: 'init', payload: storedState })
    timer.setTime(storedState.elapsedTime || 0)
  }, [])

  const onReset = React.useCallback((difficulty: string) => {
    const config = getConfig(difficulty)
    dispatch({ type: 'reset', payload: config })
  }, [])
  return <div className="text-center p-4 pb-0">
      Mine Sweeper

    <div className="flex gap-1 justify-center p-4 m-auto">
      <button className="btn btn-green" onClick={() => onReset('')}>New Game</button>
      <button className="btn btn-green" onClick={() => onReset('easy')}>Easy</button>
      <button className="btn btn-green" onClick={() => onReset('medium')}>Medium</button>
      <button className="btn btn-green" onClick={() => onReset('hard')}>Hard</button>
    </div>

    <div className="flex gap-10 justify-center">
      <div className="font-mono text-2xl flex gap-1">
        <i className="iconfont icon-clock  mr-1" />
        {timer.time}
      </div>
      <div className="font-mono text-2xl flex gap-1">
        <i className="iconfont icon-boom  mr-1" />
        {mineRest()}
      </div>
    </div>
  </div>
}

export default mineHeader
