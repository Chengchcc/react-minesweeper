import { useEffect, useState } from 'react'

interface TimerOption {
  initial?: number
  step?: number
  onProgress?: (time: number) => void
}

export const useTimer = (options: TimerOption) => {
  const [time, setTime] = useState(options.initial || 0)
  const [isRunning, setIsRunning] = useState(false)

  const start = () => {
    setIsRunning(true)
  }

  const stop = () => {
    setIsRunning(false)
  }

  const reset = () => {
    if (typeof options.onProgress === 'function')
      options.onProgress(0)
    setTime(0)
    setIsRunning(false)
  }

  useEffect(() => {
    if (typeof options.onProgress === 'function')
      options.onProgress(time)
  }, [time])

  useEffect(() => {
    let interval = 0
    if (isRunning) {
      interval = setInterval(() => {
        setTime(time => time + 1)
      }, options.step || 1000)
    }
    else if (!isRunning && time !== 0) {
      clearInterval(interval)
    } return () => clearInterval(interval)
  }, [isRunning, time])
  return { time, start, stop, reset, setTime }
}
