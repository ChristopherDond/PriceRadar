import { useState, useCallback, useRef, useEffect } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const show = useCallback((message, emoji = '✅') => {
    clearTimeout(timer.current)
    setToast({ message, emoji })
    timer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  useEffect(() => {
    return () => clearTimeout(timer.current)
  }, [])

  return { toast, show }
}
