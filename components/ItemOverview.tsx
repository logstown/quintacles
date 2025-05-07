'use client'

import { Link } from "@heroui/link"
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
            className={`text-pretty text-justify ${isShowingMore ? '' : 'line-clamp-3'}`}
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
    const { offsetHeight, scrollHeight } = ref?.current || {}

    if (offsetHeight && scrollHeight && offsetHeight < scrollHeight) {
      setIsTruncated(true)
    } else {
      setIsTruncated(false)
    }
  }, [ref])

  const toggleIsShowingMore = () => setIsShowingMore(prev => !prev)

  return {
    isTruncated,
    isShowingMore,
    toggleIsShowingMore,
  }
}
