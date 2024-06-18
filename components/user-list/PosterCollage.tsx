import { getTmdbImageUrl } from '../../lib/random'
import { clone } from 'lodash'
import { Image } from '@nextui-org/image'
import { Card, CardFooter } from '@nextui-org/card'
import NextImage from 'next/image'
import { Skeleton } from '@nextui-org/skeleton'

export function PosterCollageGallery({
  posterPaths,
  cardWidth,
}: {
  posterPaths: (string | undefined)[]
  cardWidth: number
}) {
  const startingWidth = cardWidth / 1.71428

  return (
    <div className='flex gap-3'>
      <Image
        className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
        key={posterPaths[0]}
        alt='bullcrap'
        height={500}
        width={startingWidth}
        src={getTmdbImageUrl(posterPaths[0], 'w300')}
      />
      <div className='flex flex-col gap-2'>
        <Image
          className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
          key={posterPaths[1]}
          alt='bullcrap'
          height={500}
          width={startingWidth * 0.6 - 12}
          src={getTmdbImageUrl(posterPaths[1], 'w300')}
        />
        <div className='flex gap-1'>
          <Image
            className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
            key={posterPaths[2]}
            alt='bullcrap'
            height={500}
            width={startingWidth * 0.4 - 3}
            src={getTmdbImageUrl(posterPaths[2], 'w300')}
          />
          <div className='flex flex-col gap-1'>
            <Image
              className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
              key={posterPaths[3]}
              alt='bullcrap'
              height={500}
              width={startingWidth * 0.2 - 2}
              src={getTmdbImageUrl(posterPaths[3], 'w300')}
            />
            <Image
              className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
              key={posterPaths[4]}
              alt='bullcrap'
              height={500}
              width={startingWidth * 0.2 - 2}
              src={getTmdbImageUrl(posterPaths[4], 'w300')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PosterItem({
  posterPath,
  height,
  width,
}: {
  posterPath: string | undefined
  height: number
  width: number
}) {
  return (
    <Image
      className='rounded-xl border-2 border-zinc-300 drop-shadow-xl'
      height={height}
      alt='bullcrap'
      style={{ minWidth: `${width}px`, height: `${height}px` }}
      width={width}
      src={getTmdbImageUrl(posterPath, 'w185')}
    />
  )
}

export function PosterCollageBigFirstRight({
  posterPaths,
  cardWidth,
}: {
  posterPaths: (string | undefined)[]
  cardWidth: number
}) {
  const startingWidth = cardWidth / 2 - 22
  const smallerWidth = startingWidth / 2 - 3
  const startingHeight = startingWidth * 1.5
  const smallerHeight = smallerWidth * 1.5

  return (
    <div className='flex gap-2 contrast-[.9]'>
      <PosterItem
        posterPath={posterPaths[0]}
        height={startingHeight}
        width={startingWidth}
      />
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2'>
          <PosterItem
            posterPath={posterPaths[1]}
            height={smallerHeight}
            width={smallerWidth}
          />
          <PosterItem
            posterPath={posterPaths[2]}
            height={smallerHeight}
            width={smallerWidth}
          />
        </div>
        <div className='flex gap-2'>
          <PosterItem
            posterPath={posterPaths[3]}
            height={smallerHeight}
            width={smallerWidth}
          />
          <PosterItem
            posterPath={posterPaths[4]}
            height={smallerHeight}
            width={smallerWidth}
          />
        </div>
      </div>
    </div>
  )
}

export function PosterCollageStackedRight({
  posterPaths,
}: {
  posterPaths: (string | undefined)[]
}) {
  return (
    <div className='h-[225px] w-[425px]'>
      {posterPaths.map((p, i) => (
        <Image
          key={i}
          className='rounded-xl border-3 border-zinc-300 drop-shadow-xl'
          classNames={{
            wrapper: 'absolute h-[225px] w-[150px]',
          }}
          style={{
            zIndex: 5 - i + 10,
            left: i * 50,
          }}
          src={getTmdbImageUrl(p, 'w185')}
        />
      ))}
    </div>
  )
}

export function PosterCollageStackedDown({
  posterPaths,
}: {
  posterPaths: (string | undefined)[]
}) {
  const newPaths = clone(posterPaths).reverse()
  return (
    <div className='h-[375px] w-[300px]'>
      {newPaths.map((p, i) => (
        <Card
          key={i}
          style={{
            zIndex: i + 10,
            top: i * 30,
            // transform: `translate(${i * 20}px)`
          }}
          isFooterBlurred
          className='absolute'
        >
          {/* <CardFooter className='absolute right-3 top-3 z-30 ml-1 w-auto overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10'>
            <p className='drop-drop-shadow-lg text-tiny text-white/80'>
              Here is an episode title now
            </p>
          </CardFooter> */}
          <Image
            className='rounded-xl border-3 border-zinc-300 object-cover drop-shadow-xl'
            src={getTmdbImageUrl(p, 'w300')}
          />
        </Card>
      ))}
    </div>
  )
}

export function PosterCollageBigFirstRightGrid({
  posters,
  cardWidth,
}: {
  posters: { tmdbId: number; posterPath: string | null; id: string }[]
  cardWidth: number
}) {
  return (
    <div
      style={{
        gridTemplateRows: `repeat(2, ${(cardWidth * 3) / 8 - 2}px)`,
        gridTemplateColumns: `repeat(4, ${cardWidth / 4}px)`,
      }}
      className='grid'
    >
      {posters.map((p, i) => (
        <Image
          key={i}
          classNames={{
            wrapper: i == 0 ? 'col-span-2 row-span-2 p-2' : 'p-2',
          }}
          className='rounded-xl border-2 border-zinc-300 drop-shadow-xl'
          alt='bullcrap'
          src={getTmdbImageUrl(p.posterPath, 'w342')}
        />
      ))}
    </div>
  )
}

export function PosterCollageBigFirstDown({
  posters,
  cardWidth,
}: {
  posters: { tmdbId: number; posterPath: string }[]
  cardWidth: number
}) {
  const startingWidth = cardWidth - 50

  return (
    <div className='flex flex-col gap-6'>
      <Image
        className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
        key={posters[0].tmdbId}
        alt='bullcrap'
        height={500}
        width={startingWidth}
        src={getTmdbImageUrl(posters[0].posterPath, 'w300')}
      />
      <div className='flex flex-col gap-6'>
        <div className='flex gap-6'>
          <Image
            className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
            key={posters[1].tmdbId}
            alt='bullcrap'
            height={500}
            width={startingWidth / 2}
            src={getTmdbImageUrl(posters[1].posterPath, 'w300')}
          />
          <Image
            className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
            key={posters[2].tmdbId}
            alt='bullcrap'
            height={500}
            width={startingWidth / 2}
            src={getTmdbImageUrl(posters[2].posterPath, 'w300')}
          />
        </div>
        <div className='flex gap-6'>
          <Image
            className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
            key={posters[3].tmdbId}
            alt='bullcrap'
            height={500}
            width={startingWidth / 2}
            src={getTmdbImageUrl(posters[3].posterPath, 'w300')}
          />
          <Image
            className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
            key={posters[4].tmdbId}
            alt='bullcrap'
            height={500}
            width={startingWidth / 2}
            src={getTmdbImageUrl(posters[4].posterPath, 'w300')}
          />
        </div>
      </div>
    </div>
  )
}

export function BackdropCollageBigFirstDown({
  posters,
  cardWidth,
}: {
  posters: {
    tmdbId: number
    posterPath: string
    backdropPath: string | null
    name: string
  }[]
  cardWidth: number
}) {
  const startingWidth = cardWidth
  const littleWidth = startingWidth / 2 - 4

  return (
    <div className='flex flex-col gap-6'>
      <BackdropCard item={posters[0]} width={startingWidth} />
      <div className='flex flex-col gap-6'>
        <div className='flex gap-6'>
          <BackdropCard item={posters[1]} width={littleWidth} />
          <BackdropCard item={posters[2]} width={littleWidth} />
        </div>
        <div className='flex gap-6'>
          <BackdropCard item={posters[3]} width={littleWidth} />
          <BackdropCard item={posters[4]} width={littleWidth} />
        </div>
      </div>
    </div>
  )
}

export function BackdropCard({
  item,
  width,
}: {
  item: {
    tmdbId: number
    posterPath: string
    backdropPath: string | null
    name: string
  }
  width: number
}) {
  return (
    <Card radius='lg' isFooterBlurred className='border-none drop-shadow-md'>
      <Image
        className='object-cover'
        key={item.tmdbId}
        alt='bullcrap'
        height={500}
        width={width}
        src={getTmdbImageUrl(item.backdropPath, 'w780')}
      />
      <CardFooter className='absolute top-1 z-10 ml-1 w-auto overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10'>
        <p className='drop-drop-shadow-lg text-tiny text-white/80'>{item.name}</p>
      </CardFooter>
    </Card>
  )
}

export function PosterCollageCardDec({
  posters,
  cardWidth,
}: {
  posters: { tmdbId: number; posterPath: string }[]
  cardWidth: number
}) {
  const startingWidth = cardWidth / 5

  return (
    <div className='h-[360px] overflow-hidden'>
      <div className='relative ml-12 mt-12'>
        {posters.reverse().map((poster, i) => (
          <Image
            style={{
              transform: `translate(${(4 - i) * 60}px ) rotate(${10 - i * 5}deg)`,
              transformOrigin: `50% 100%`,
            }}
            className='absolute rounded-xl border-2 border-zinc-300 drop-shadow-lg'
            key={poster.tmdbId}
            alt='bullcrap'
            height={500}
            width={startingWidth}
            src={getTmdbImageUrl(poster.posterPath, 'w300')}
          />
        ))}
      </div>
    </div>
  )
}

export function PosterCollageStraight({
  posterLites,
}: {
  posterLites?: {
    name: string
    posterPath: string | null
    backdropPath: string | null
  }[]
}) {
  const isSkeleton = !posterLites
  const posters = isSkeleton ? Array(5).fill(0) : posterLites

  return (
    <div className='flex gap-1 sm:gap-4 md:gap-8'>
      {posters.map((lite, i) => (
        <div key={i} className='flex flex-col items-center gap-2'>
          {isSkeleton ? (
            <Skeleton className='rounded-xl drop-shadow-lg'>
              <img alt='bullcrap' src='/dummyPoster.jpeg' />
            </Skeleton>
          ) : (
            <Image
              as={NextImage}
              isBlurred
              width={342}
              height={513}
              className='drop-shadow-lg'
              alt='bullcrap'
              src={getTmdbImageUrl(lite.posterPath, 'w342')}
            />
          )}
          <p className='text-sm font-semibold text-neutral-400 md:text-base'>
            {i + 1}
          </p>
        </div>
      ))}
    </div>
  )
}

export function BackdropCollageStraight({
  backdropLites,
}: {
  backdropLites?: {
    name: string
    posterPath: string | null
    backdropPath: string | null
  }[]
}) {
  const isSkeleton = !backdropLites
  const backdrops = isSkeleton ? Array(5).fill(0) : backdropLites

  return (
    <div className='flex flex-col gap-8'>
      {backdrops.map((lite, i) => (
        <div key={i} className='flex items-center gap-2'>
          {isSkeleton ? (
            <Skeleton className='aspect-video w-[300px] rounded-xl drop-shadow-lg' />
          ) : (
            <Card
              isFooterBlurred
              className='aspect-video border-none drop-shadow-xl'
            >
              <Image
                as={NextImage}
                width={300}
                height={169}
                className='max-w-[282px] object-cover brightness-90'
                src={getTmdbImageUrl(lite.backdropPath, 'w300')}
                alt='NextUI hero Image'
              />
              <CardFooter className='absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] items-baseline gap-2 overflow-hidden rounded-large border-1 border-white/20 py-1 text-white/80 shadow-md'>
                <p className='font-bold'>{i + 1}</p>
                <p>·</p>
                <p>{lite.name}</p>
              </CardFooter>
            </Card>
          )}
        </div>
      ))}
    </div>
  )
}
