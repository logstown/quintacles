import { getTmdbImageUrl } from '../../lib/random'
import { Image } from "@heroui/image"
import { Card } from "@heroui/card"
import NextImage from 'next/image'
import { Skeleton } from "@heroui/skeleton"
import React from 'react'
import { EpisodeThumbnailFooter } from '../EpisodeThumbnailFooter'

// export function PosterCollageGallery({
//   posterPaths,
//   cardWidth,
// }: {
//   posterPaths: (string | undefined)[]
//   cardWidth: number
// }) {
//   const startingWidth = cardWidth / 1.71428

//   return (
//     <div className='flex gap-3'>
//       <Image
//         className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
//         key={posterPaths[0]}
//         alt='poster'
//         height={500}
//         width={startingWidth}
//         src={getTmdbImageUrl(posterPaths[0], 'w300')}
//       />
//       <div className='flex flex-col gap-2'>
//         <Image
//           className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
//           key={posterPaths[1]}
//           alt='poster'
//           height={500}
//           width={startingWidth * 0.6 - 12}
//           src={getTmdbImageUrl(posterPaths[1], 'w300')}
//         />
//         <div className='flex gap-1'>
//           <Image
//             className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
//             key={posterPaths[2]}
//             alt='poster'
//             height={500}
//             width={startingWidth * 0.4 - 3}
//             src={getTmdbImageUrl(posterPaths[2], 'w300')}
//           />
//           <div className='flex flex-col gap-1'>
//             <Image
//               className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
//               key={posterPaths[3]}
//               alt='poster'
//               height={500}
//               width={startingWidth * 0.2 - 2}
//               src={getTmdbImageUrl(posterPaths[3], 'w300')}
//             />
//             <Image
//               className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
//               key={posterPaths[4]}
//               alt='poster'
//               height={500}
//               width={startingWidth * 0.2 - 2}
//               src={getTmdbImageUrl(posterPaths[4], 'w300')}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export function PosterItem({
//   posterPath,
//   height,
//   width,
// }: {
//   posterPath: string | undefined
//   height: number
//   width: number
// }) {
//   return (
//     <Image
//       className='rounded-xl border-2 border-zinc-300 drop-shadow-xl'
//       height={height}
//       alt='poster'
//       style={{ minWidth: `${width}px`, height: `${height}px` }}
//       width={width}
//       src={getTmdbImageUrl(posterPath, 'w185')}
//     />
//   )
// }

// export function PosterCollageBigFirstRight({
//   posterPaths,
//   cardWidth,
// }: {
//   posterPaths: (string | undefined)[]
//   cardWidth: number
// }) {
//   const startingWidth = cardWidth / 2 - 22
//   const smallerWidth = startingWidth / 2 - 3
//   const startingHeight = startingWidth * 1.5
//   const smallerHeight = smallerWidth * 1.5

//   return (
//     <div className='flex gap-2 contrast-[.9]'>
//       <PosterItem
//         posterPath={posterPaths[0]}
//         height={startingHeight}
//         width={startingWidth}
//       />
//       <div className='flex flex-col gap-2'>
//         <div className='flex gap-2'>
//           <PosterItem
//             posterPath={posterPaths[1]}
//             height={smallerHeight}
//             width={smallerWidth}
//           />
//           <PosterItem
//             posterPath={posterPaths[2]}
//             height={smallerHeight}
//             width={smallerWidth}
//           />
//         </div>
//         <div className='flex gap-2'>
//           <PosterItem
//             posterPath={posterPaths[3]}
//             height={smallerHeight}
//             width={smallerWidth}
//           />
//           <PosterItem
//             posterPath={posterPaths[4]}
//             height={smallerHeight}
//             width={smallerWidth}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export function PosterCollageStackedRight({
//   posterPaths,
// }: {
//   posterPaths: (string | undefined)[]
// }) {
//   return (
//     <div className='h-[225px] w-[425px]'>
//       {posterPaths.map((p, i) => (
//         <Image
//           key={i}
//           className='rounded-xl border-3 border-zinc-300 drop-shadow-xl'
//           classNames={{
//             wrapper: 'absolute h-[225px] w-[150px]',
//           }}
//           style={{
//             zIndex: 5 - i + 10,
//             left: i * 50,
//           }}
//           alt='poster'
//           src={getTmdbImageUrl(p, 'w185')}
//         />
//       ))}
//     </div>
//   )
// }

// export function PosterCollageStackedDown({
//   posterPaths,
// }: {
//   posterPaths: (string | undefined)[]
// }) {
//   const newPaths = clone(posterPaths).reverse()
//   return (
//     <div className='h-[375px] w-[300px]'>
//       {newPaths.map((p, i) => (
//         <Card
//           key={i}
//           style={{
//             zIndex: i + 10,
//             top: i * 30,
//             // transform: `translate(${i * 20}px)`
//           }}
//           isFooterBlurred
//           className='absolute'
//         >
//           {/* <CardFooter className='absolute right-3 top-3 z-30 ml-1 w-auto overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10'>
//             <p className='drop-drop-shadow-lg text-tiny text-white/80'>
//               Here is an episode title now
//             </p>
//           </CardFooter> */}
//           <Image
//             className='rounded-xl border-3 border-zinc-300 object-cover drop-shadow-xl'
//             src={getTmdbImageUrl(p, 'w300')}
//           />
//         </Card>
//       ))}
//     </div>
//   )
// }

// export function PosterCollageBigFirstRightGrid({
//   posters,
//   cardWidth,
// }: {
//   posters: { tmdbId: number; posterPath: string | null; id: string }[]
//   cardWidth: number
// }) {
//   return (
//     <div
//       style={{
//         gridTemplateRows: `repeat(2, ${(cardWidth * 3) / 8 - 2}px)`,
//         gridTemplateColumns: `repeat(4, ${cardWidth / 4}px)`,
//       }}
//       className='grid'
//     >
//       {posters.map((p, i) => (
//         <Image
//           key={i}
//           classNames={{
//             wrapper: i == 0 ? 'col-span-2 row-span-2 p-2' : 'p-2',
//           }}
//           className='rounded-xl border-2 border-zinc-300 drop-shadow-xl'
//           alt='poster'
//           src={getTmdbImageUrl(p.posterPath, 'w342')}
//         />
//       ))}
//     </div>
//   )
// }

// export function PosterCollageBigFirstDown({
//   posters,
//   cardWidth,
// }: {
//   posters: { tmdbId: number; posterPath: string }[]
//   cardWidth: number
// }) {
//   const startingWidth = cardWidth - 50

//   return (
//     <div className='flex flex-col gap-6'>
//       <Image
//         className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
//         key={posters[0].tmdbId}
//         alt='poster'
//         height={500}
//         width={startingWidth}
//         src={getTmdbImageUrl(posters[0].posterPath, 'w300')}
//       />
//       <div className='flex flex-col gap-6'>
//         <div className='flex gap-6'>
//           <Image
//             className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
//             key={posters[1].tmdbId}
//             alt='poster'
//             height={500}
//             width={startingWidth / 2}
//             src={getTmdbImageUrl(posters[1].posterPath, 'w300')}
//           />
//           <Image
//             className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
//             key={posters[2].tmdbId}
//             alt='poster'
//             height={500}
//             width={startingWidth / 2}
//             src={getTmdbImageUrl(posters[2].posterPath, 'w300')}
//           />
//         </div>
//         <div className='flex gap-6'>
//           <Image
//             className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
//             key={posters[3].tmdbId}
//             alt='poster'
//             height={500}
//             width={startingWidth / 2}
//             src={getTmdbImageUrl(posters[3].posterPath, 'w300')}
//           />
//           <Image
//             className='rounded-xl border-2 border-zinc-300 drop-shadow-lg'
//             key={posters[4].tmdbId}
//             alt='poster'
//             height={500}
//             width={startingWidth / 2}
//             src={getTmdbImageUrl(posters[4].posterPath, 'w300')}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export function BackdropCollageBigFirstDown({
//   posters,
//   cardWidth,
// }: {
//   posters: {
//     tmdbId: number
//     posterPath: string
//     backdropPath: string | null
//     name: string
//   }[]
//   cardWidth: number
// }) {
//   const startingWidth = cardWidth
//   const littleWidth = startingWidth / 2 - 4

//   return (
//     <div className='flex flex-col gap-6'>
//       <BackdropCard item={posters[0]} width={startingWidth} />
//       <div className='flex flex-col gap-6'>
//         <div className='flex gap-6'>
//           <BackdropCard item={posters[1]} width={littleWidth} />
//           <BackdropCard item={posters[2]} width={littleWidth} />
//         </div>
//         <div className='flex gap-6'>
//           <BackdropCard item={posters[3]} width={littleWidth} />
//           <BackdropCard item={posters[4]} width={littleWidth} />
//         </div>
//       </div>
//     </div>
//   )
// }

// export function BackdropCard({
//   item,
//   width,
// }: {
//   item: {
//     tmdbId: number
//     posterPath: string
//     backdropPath: string | null
//     name: string
//   }
//   width: number
// }) {
//   return (
//     <Card radius='lg' isFooterBlurred className='border-none drop-shadow-md'>
//       <Image
//         className='object-cover'
//         key={item.tmdbId}
//         alt='poster'
//         height={500}
//         width={width}
//         src={getTmdbImageUrl(item.backdropPath, 'w780')}
//       />
//       <CardFooter className='absolute top-1 z-10 ml-1 w-auto overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10'>
//         <p className='drop-drop-shadow-lg text-tiny text-white/80'>{item.name}</p>
//       </CardFooter>
//     </Card>
//   )
// }

// export function PosterCollageCardDec({
//   posters,
//   cardWidth,
// }: {
//   posters: { tmdbId: number; posterPath: string }[]
//   cardWidth: number
// }) {
//   const startingWidth = cardWidth / 5

//   return (
//     <div className='h-[360px] overflow-hidden'>
//       <div className='relative ml-12 mt-12'>
//         {posters.reverse().map((poster, i) => (
//           <Image
//             style={{
//               transform: `translate(${(4 - i) * 60}px ) rotate(${10 - i * 5}deg)`,
//               transformOrigin: `50% 100%`,
//             }}
//             className='absolute rounded-xl border-2 border-zinc-300 drop-shadow-lg'
//             key={poster.tmdbId}
//             alt='poster'
//             height={500}
//             width={startingWidth}
//             src={getTmdbImageUrl(poster.posterPath, 'w300')}
//           />
//         ))}
//       </div>
//     </div>
//   )
// }

export function PosterCollageStraight({
  posterLites,
  isSeasons,
}: {
  posterLites?: {
    name: string
    posterPath: string | null
    backdropPath: string | null
  }[]
  isSeasons?: boolean
}) {
  const isSkeleton = !posterLites
  const posters = isSkeleton ? Array(5).fill(0) : posterLites

  return (
    <div className='flex gap-1 sm:gap-3 md:gap-5'>
      {posters.map((lite, i) => (
        <div key={i} className='flex flex-col items-center gap-2'>
          {isSkeleton ? (
            <Skeleton className='rounded-xl'>
              <img alt='poster' src='/dummyPoster.jpeg' />
            </Skeleton>
          ) : (
            <MaybeSeasonFooter isSeasons={isSeasons} seasonName={lite.name}>
              {/* TODO: add NextImage back maybe */}
              <Image
                isBlurred
                width={176}
                className='aspect-[2/3] rounded-md border-1 border-foreground-200 object-cover shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] sm:rounded-xl'
                alt={`${lite.name} poster`}
                src={getTmdbImageUrl(lite.posterPath, 'w342')}
              />
            </MaybeSeasonFooter>
          )}
          <MediaRank>{i + 1}</MediaRank>
        </div>
      ))}
    </div>
  )
}

function MaybeSeasonFooter({
  children,
  seasonName,
  isSeasons,
}: {
  children: React.ReactNode
  seasonName: string
  isSeasons?: boolean
}) {
  return isSeasons ? (
    // Added aspect css. Could be trouble
    (<Card isFooterBlurred isBlurred className='aspect-[2/3] overflow-visible'>
      {children}
      <EpisodeThumbnailFooter isSeasons>{seasonName}</EpisodeThumbnailFooter>
    </Card>)
  ) : (
    <>{children}</>
  );
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
    <div className='flex flex-col gap-6'>
      {backdrops.map((lite, i) => (
        <React.Fragment key={i}>
          {isSkeleton ? (
            <Skeleton className='aspect-video w-[245px] rounded-xl' />
          ) : (
            <div className='flex items-center gap-4'>
              <MediaRank>{i + 1}</MediaRank>
              <Card isFooterBlurred className='overflow-visible border-none'>
                <Image
                  unoptimized
                  as={NextImage}
                  width={300}
                  isBlurred
                  height={169}
                  className='aspect-video max-w-[245px] object-cover brightness-90'
                  src={getTmdbImageUrl(lite.backdropPath, 'w300')}
                  alt={`${lite.name} still`}
                />
                <EpisodeThumbnailFooter>{lite.name}</EpisodeThumbnailFooter>
              </Card>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function MediaRank({ children }: { children: React.ReactNode }) {
  return (
    <p className='text-tiny font-semibold text-foreground-400 sm:text-sm md:text-base'>
      {children}
    </p>
  )
}
