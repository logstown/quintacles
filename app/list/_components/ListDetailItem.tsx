import { Tooltip } from '@nextui-org/tooltip'
import { ListItemUI } from './ListDetail'
import { ListItemLink } from './ListItemLink'
import { MediaType } from '@prisma/client'
import { format } from 'date-fns'
import { includes } from 'lodash'
import { Image } from '@nextui-org/image'
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
      className={`w-full border border-neutral-800/50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] ${isModal ? 'lg:rounded-xl' : 'rounded-xl'}`}
    >
      <div
        className={`flex aspect-video w-full flex-col items-center justify-end bg-cover bg-center px-6 pb-8 sm:pb-16 ${isModal ? 'lg:rounded-t-xl' : 'rounded-t-xl'} `}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),url(${item.backdropUrl})`,
        }}
      >
        <div className='-mb-60 flex max-w-prose flex-col gap-6'>
          <div
            className={`flex gap-6 sm:gap-10 lg:gap-12 ${item.logoPath ? 'items-center justify-center' : isEpisodes ? 'items-center' : 'items-end'}`}
          >
            <h2 className='text-7xl font-extrabold !leading-[.8] tracking-tight text-neutral-100 drop-shadow-[0_1px_1px_white] sm:text-9xl'>
              {5 - i}
            </h2>
            <div
              style={{ color: item.textColor }}
              className='flex flex-col justify-center gap-3'
            >
              <ListItemLink
                mediaType={restrictions.mediaType}
                tvShowId={restrictions.EpisodesTvShow.id}
                item={item}
              >
                <Tooltip content={item.name} delay={1000}>
                  {item.logoPath ? (
                    <img className='max-h-48 drop-shadow-xl' src={item.logoPath} />
                  ) : (
                    <span
                      className={`line-clamp-4 overflow-visible text-balance text-4xl font-extrabold leading-none tracking-tight drop-shadow-2xl ${isEpisodes ? 'sm:text-5xl' : 'sm:text-6xl'}`}
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
                  <p className='text-tiny leading-[.8] sm:text-sm md:text-base lg:text-tiny xl:text-base'>
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
          <div className='text-sm font-light text-white sm:text-base'>
            <ItemOverview omitNoOverview overview={item.overview ?? ''} />
          </div>
        </div>
      </div>
      <div
        className={`h-60 w-full bg-black ${isModal ? 'lg:rounded-b-xl' : 'rounded-b-xl'}`}
      ></div>
    </div>
  )
}
