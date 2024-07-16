'use client'

import { smallFont } from '@/config/fonts'
import { Link } from '@nextui-org/link'
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
        <div className={smallFont.className}>
          <p
            ref={ref}
            className={isShowingMore ? 'text-pretty' : 'line-clamp-4 text-pretty'}
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
