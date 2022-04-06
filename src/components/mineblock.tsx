import React, { useContext, useEffect } from 'react'
import { GameContext } from '../hooks/useGameContext'
import useStateRef from '../hooks/useStateRef'
import type { BlockState, GameStatus } from '../types'
import { FlagStatus } from '../types'
import { autoExpand, expandZero, generateMines } from '../utils'

interface MineBlockProps {
  block: BlockState
}

const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500',
]

const getBlockClass = (block: BlockState) => {
  if (block.flag !== 0)
    return 'bg-gray-500/10'

  if (!block.isOpen)
    return 'bg-gray-500/10 text-transparent shadow-inner shadow-white hover:bg-gray-500/20'
  return block.isMine ? 'bg-red-500/10' : numberColors[block.adjacentMines ?? 0]
}
const renderInnerContent = (block: BlockState) => {
  if (block.flag === FlagStatus.Flag) {
    return (
      <div>
        <i className="iconfont icon-flag text-red-400"/>
      </div>
    )
  }
  else if (block.flag === FlagStatus.Question) {
    return (
      <div>
        <i className="iconfont icon-question" />
      </div>
    )
  }
  if (block.isOpen === true) {
    if (block.isMine) {
      return (
        <div>
          <i className="iconfont icon-boom" />
        </div>
      )
    }
    else {
      return block.adjacentMines
    }
  }
}

const MineBlock: React.FC<MineBlockProps> = (props: MineBlockProps) => {
  const block = props.block
  const { state, dispatch } = useContext(GameContext)
  const { board, mines, minesGenerated, status } = state
  const [mouseClick, setMouseClick, isActive] = useStateRef(false)
  const [tipBlock, setTipBlock, blockRef] = useStateRef<BlockState[]>([])

  useEffect(() => {
    blockRef.current.forEach((b) => {
      const { x, y } = b
      const selector = `#root #block_${x}_${y}`
      const button = document.querySelector<HTMLButtonElement>(selector)
      if (isActive.current)
        button?.classList.add('shadow-none', 'bg-gray-400/5')
      else
        button?.classList.remove('shadow-none', 'bg-gray-400/5')
    })
  }, [mouseClick, tipBlock])

  const onGameOver = React.useCallback((status: GameStatus) => {
    board.flat().forEach((b) => {
      b.isOpen = true
    })
    dispatch({ type: 'setBoard', payload: board })
    dispatch({ type: 'setStatus', payload: status })
  }, [board])

  const onClick = React.useCallback(() => {
    if (status !== 'playing' && status !== 'ready') return
    if (block.flag !== 0 || block.isOpen) return
    if (status === 'ready')
      dispatch({ type: 'setStatus', payload: 'playing' })

    if (!state.minesGenerated) {
      generateMines(board, mines, block)
      dispatch({ type: 'setMinesGenerated', payload: true })
    }
    block.isOpen = true
    if (block.isMine) {
      onGameOver('lost')
      return
    }
    expandZero(board, block)
    dispatch({ type: 'setBoard', payload: board })
  }, [block, minesGenerated, mines])

  const onRClick = React.useCallback(() => {
    if (status !== 'playing') return
    if (block.isOpen) return
    block.flag = (block.flag + 1) % 3
    dispatch({ type: 'setBoard', payload: board })
  }, [block, status])

  const onRLClick = React.useCallback(() => {
    if (status !== 'playing') return
    if (!block.isOpen) return
    autoExpand(board, block).then((blocks) => {
      setTipBlock(blocks)
      dispatch({ type: 'setBoard', payload: board })
    }).catch(() => {
      onGameOver('lost')
    })
  }, [block, status])

  return <button
    id = {`block_${block.x}_${block.y}`}
    className={
      'flex justify-center items-center w-8 h-8 m-0.5 border border-0.5 border-gray-400/10'
        + ` ${getBlockClass(block)}`
    }
    onClick={(e) => {
      e.preventDefault()
      onClick()
    }}
    onContextMenu={(e) => {
      e.preventDefault()
      onRClick()
    }}
    onMouseDown = {(e) => {
      setMouseClick(true)
      if (e.buttons === 3) {
        e.preventDefault()
        onRLClick()
      }
    }}
    onMouseUp = {() => {
      setMouseClick(false)
    }}
  >
    {renderInnerContent(block)}
  </button>
}

export default MineBlock
