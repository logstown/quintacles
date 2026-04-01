'use client'

import { Link } from '@heroui/link'
import React from 'react'
import { useLayoutEffect, useState } from 'react'

export function ItemOverview({
  overview,
  omitNoOverview,
}: {
  overview: string
  omitNoOverview?: boolean
}) {
  const ref = React.useRef(null)
  const { isTruncated, isShowingMore, toggleIsShowingMore } = useTruncatedElement({
    ref,
  })

  return (
    <>
      {overview ? (
        <div>
          <p
            ref={ref}
            className={`text-pretty ${isShowingMore ? '' : 'line-clamp-3'}`}
          >
            {overview}
          </p>
          {isTruncated && !isShowingMore && (
            <Link
              className='cursor-pointer text-neutral-400'
              onPress={toggleIsShowingMore}
            >
              Show more
            </Link>
          )}
        </div>
      ) : (
        !omitNoOverview && (
          <em className='flex items-center justify-center text-foreground-400'>
            No Overview
          </em>
        )
      )}
    </>
  )
}

const useTruncatedElement = ({ ref }: { ref: any }) => {
  const [isTruncated, setIsTruncated] = useState(false)
  const [isShowingMore, setIsShowingMore] = useState(false)

  useLayoutEffect(() => {
    const element = ref?.current as HTMLElement | null

    if (!element) {
      return
    }

    const updateIsTruncated = () => {
      const { offsetHeight, scrollHeight } = element
      setIsTruncated(offsetHeight > 0 && scrollHeight > offsetHeight)
    }

    const frameId = requestAnimationFrame(updateIsTruncated)
    const resizeObserver = new ResizeObserver(updateIsTruncated)
    resizeObserver.observe(element)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
    }
  }, [ref])

  const toggleIsShowingMore = () => setIsShowingMore(prev => !prev)

  return {
    isTruncated,
    isShowingMore,
    toggleIsShowingMore,
  }
}
