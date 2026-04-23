'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface HoverRevealTextProps {
  text: string
  className?: string
  tooltipClassName?: string
  multiline?: boolean
}

export function HoverRevealText({
  text,
  className,
  tooltipClassName,
  multiline = false,
}: HoverRevealTextProps) {
  const nodeRef = useRef<HTMLSpanElement | null>(null)
  const observerRef = useRef<ResizeObserver | null>(null)
  const [isTruncated, setIsTruncated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const measure = useCallback(() => {
    const node = nodeRef.current
    if (!node) return false
    const next =
      node.scrollWidth > node.clientWidth + 1 ||
      node.scrollHeight > node.clientHeight + 1
    setIsTruncated(curr => (curr === next ? curr : next))
    return next
  }, [])

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return
    measure()
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure)
      observer.observe(node)
      observerRef.current = observer
    }
    return () => observerRef.current?.disconnect()
  }, [measure])

  return (
    <Tooltip open={isOpen && isTruncated}>
      <TooltipTrigger>
        <span
          ref={nodeRef}
          className={cn('block truncate', multiline && 'line-clamp-2', className)}
          onMouseEnter={() => { const t = measure(); setIsOpen(t) }}
          onMouseLeave={() => setIsOpen(false)}
          onFocus={() => { const t = measure(); setIsOpen(t) }}
          onBlur={() => setIsOpen(false)}
        >
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent className={cn('max-w-sm text-left leading-5', tooltipClassName)}>
        {text}
      </TooltipContent>
    </Tooltip>
  )
}
