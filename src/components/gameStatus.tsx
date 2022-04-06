import React, { useContext, useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { GameContext } from '@/hooks/useGameContext'
function congrats() {
  const defaults = {
    colors: [
      '#5D8C7B',
      '#F2D091',
      '#F2A679',
      '#D9695F',
      '#8C4646',
    ],
    shapes: ['square'],
    ticks: 500,
  } as confetti.Options
  confetti({
    ...defaults,
    particleCount: 80,
    spread: 100,
    origin: { y: 0 },
  })
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 50,
      angle: 60,
      spread: 80,
      origin: { x: 0 },
    })
  }, 250)
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 50,
      angle: 120,
      spread: 80,
      origin: { x: 1 },
    })
  }, 400)
}

const gameStatus = () => {
  const { state } = useContext(GameContext)
  const [showAlert, setShowAlert] = useState(false)
  const [msg, setMsg] = useState('')

  const { status } = state

  useEffect(() => {
    if (status === 'lost') {
      setShowAlert(true)
      setMsg('boom!!!! you lose')
    }
    else if (status === 'won') {
      setShowAlert(true)
      setMsg('you win')
      setTimeout(congrats, 300)
    }
    else {
      setShowAlert(false)
    }
  }, [status])

  function getClass() {
    let className = ''
    className += (showAlert ? 'top-0 ' : '-top-60 ')
    className += (status === 'won' ? 'bg-teal-500' : 'bg-red-500')
    return className
  }

  return (

    <div
      className={
        `${getClass()} alert`
      }
    >
      <span className="text-xl inline-block mr-5 align-middle">
        <i className="fa-solid fa-info"></i>
      </span>
      <span className="inline-block align-middle mr-8">
        {msg}
      </span>
      <button
        className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
        onClick={() => setShowAlert(false)}
      >
        <span>×</span>
      </button>
    </div>
  )
}

export default gameStatus
