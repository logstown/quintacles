import { Tooltip } from '@heroui/tooltip'
import { ListItemUI } from './ListDetail'
import { ListItemLink } from './ListItemLink'
import { MediaType } from '@prisma/client'
import { format } from 'date-fns'
import { includes } from 'lodash'
import { Image } from '@heroui/image'
import NextImage from 'next/image'
import { getTmdbImageUrl } from '@/lib/random'
import { ItemOverview } from '@/components/ItemOverview'
import { RestrictionsUI, TvShowLiteUI } from '@/lib/models'

export function ListDetailItem({
  item,
  i,
  isEpisodes,
  isModal,
  restrictions,
}: {
  item: ListItemUI
  i: number
  isEpisodes: boolean
  isModal?: boolean
  restrictions: RestrictionsUI & { EpisodesTvShow: TvShowLiteUI }
}) {
  return (
    <div
      className={`relative w-full border border-neutral-800/50 shadow-[0_2.8px_2.2px_rgba(0,0,0,0.034),0_6.7px_5.3px_rgba(0,0,0,0.048),0_12.5px_10px_rgba(0,0,0,0.06),0_22.3px_17.9px_rgba(0,0,0,0.072),0_41.8px_33.4px_rgba(0,0,0,0.086),0_100px_80px_rgba(0,0,0,0.12)] ${isModal ? 'lg:rounded-xl' : 'rounded-xl'}`}
    >
      <div className='from-foreground-100 to-foreground-300 absolute -top-4 -left-4 z-10 flex size-16 items-center justify-center rounded-full bg-linear-to-br shadow-[0_4px_12px_rgba(0,0,0,0.4),0_0_0_2px_rgba(255,255,255,0.1)] sm:size-20'>
        <span className='text-foreground-900 font-mono text-3xl leading-none font-extrabold tracking-tight sm:text-4xl'>
          {5 - i}
        </span>
      </div>
      <div
        className={`flex aspect-video w-full flex-col items-center justify-end bg-cover bg-center px-12 ${isModal ? 'lg:rounded-t-xl' : 'rounded-t-xl'} `}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), ${item.bgColor}),url(${item.backdropUrl})`,
        }}
      >
        <div className='-mb-52 flex max-w-prose flex-col gap-6'>
          <div
            className={`flex justify-center gap-6 sm:gap-10 lg:gap-12 ${item.logoPath ? 'items-center' : isEpisodes ? 'items-center' : 'items-end'}`}
          >
            <div
              style={{ color: item.textColor }}
              className='flex flex-col items-center justify-center gap-3 truncate'
            >
              <ListItemLink
                mediaType={restrictions.mediaType}
                tvShowId={restrictions.EpisodesTvShow.id}
                item={item}
              >
                <Tooltip content={item.name} delay={1000}>
                  {item.logoPath ? (
                    <img
                      className='max-h-52 w-full'
                      style={{
                        filter: 'drop-shadow(8px 8px 16px rgba(0, 0, 0, 0.5))',
                      }}
                      src={item.logoPath}
                    />
                  ) : (
                    <span
                      className={`line-clamp-4 pb-1.5 text-center text-4xl leading-none font-extrabold tracking-tight text-balance drop-shadow-2xl sm:text-6xl`}
                    >
                      {item.name}{' '}
                      {!isEpisodes &&
                        (restrictions.mediaType === MediaType.TvShow ||
                          !restrictions.year ||
                          restrictions.year > 10000) && (
                          <small className='text-[40%] font-medium'>
                            {new Date(item.date).getFullYear()}
                          </small>
                        )}
                    </span>
                  )}
                </Tooltip>
              </ListItemLink>
              {isEpisodes && (
                <h3 className='flex flex-col flex-wrap items-baseline gap-2 sm:flex-row sm:gap-4 sm:text-xl md:text-2xl'>
                  <p className='leading-[.8]'>
                    Season <span className='font-bold'>{item.seasonNum}</span> ·
                    Episode <span className='font-bold'>{item.episodeNum}</span>
                  </p>
                  <p className='text-tiny lg:text-tiny leading-[.8] sm:text-sm md:text-base xl:text-base'>
                    {format(new Date(item.date), 'MMM d, yyyy')}
                  </p>
                </h3>
              )}
            </div>
            {!includes(item.backdropUrl, 'tmdb') && (
              <Image
                unoptimized
                isBlurred
                alt={`${item.name} poster`}
                classNames={{
                  img: 'max-h-[150px] max-w-[100px] sm:max-h-[277.5px] sm:max-w-[185px]',
                  blurredImg:
                    'max-h-[150px] max-w-[100px] sm:max-h-[277.5px] sm:max-w-[185px]',
                }}
                as={NextImage}
                height={513}
                width={342}
                src={getTmdbImageUrl(item.posterPath, 'w342')}
              />
            )}
          </div>
          <div className='font-light text-white sm:text-lg'>
            <ItemOverview omitNoOverview overview={item.overview ?? ''} />
          </div>
        </div>
      </div>
      <div
        style={{ backgroundColor: item.bgColor }}
        className={`h-64 w-full ${isModal ? 'lg:rounded-b-xl' : 'rounded-b-xl'}`}
      ></div>
    </div>
  )
}
