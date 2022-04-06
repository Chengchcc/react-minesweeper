import type React from 'react'
import { isEqual } from 'lodash-es'
import { useEffect, useRef } from 'react'

type DeepIsEqual<T = React.DependencyList> = (a: T, b: T) => boolean

export const useDeepCompareEffect = <T = React.DependencyList>(
  effect: React.EffectCallback,
  deps: T,
  compare: DeepIsEqual<T> = isEqual,
) => {
  const oldRef = useRef<T | undefined>(undefined)
  if (!oldRef.current || !compare(deps, oldRef.current))
    oldRef.current = deps
  useEffect(effect, [deps])
}
