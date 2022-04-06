import { useEffect, useRef, useState } from 'react'

const useStateRef = <T>(initialState: T) => {
  const [state, setState] = useState(initialState)
  const ref = useRef(initialState)

  useEffect(() => {
    ref.current = state
  }, [state])

  return [state, setState, ref] as [typeof state, typeof setState, typeof ref]
}

export default useStateRef
