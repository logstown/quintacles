import NotFoundPage from '@/components/404'
import { ItemOverview } from '@/components/ItemOverview'
import { UserListButtons } from '@/components/UserListButtons'
import { UserTime } from '@/components/UserTime'
import { ListTitleBase } from '@/components/list-title-base'
import prisma from '@/lib/db'
import { getTmdbImageUrl } from '@/lib/random'
import { Divider } from '@nextui-org/divider'
import { Image } from '@nextui-org/image'
import NextImage from 'next/image'
import { ListItem, MediaType } from '@prisma/client'
import { format } from 'date-fns'
import { clamp, includes } from 'lodash'
import Vibrant from 'node-vibrant'
import Link from 'next/link'
import { mediaTypes } from '@/lib/mediaTypes'

export interface ListItemUI extends ListItem {
  bgColor: string
  textColor: string
  rgb: number[]
  backdropUrl: string
  tmdbHref: string
}

export async function ListDetail(
  props: { id: number } | { username: string; slug: string },
) {
  const isForUser = 'username' in props
  const include = {
    item1: true,
    item2: true,
    item3: true,
    item4: true,
    item5: true,
    _count: {
      select: { users: true },
    },
    Restrictions: {
      include: {
        Person: true,
        EpisodesTvShow: true,
      },
    },
  }

  const userList = isForUser
    ? await prisma.userList.findFirst({
        where: {
          users: {
            some: { username: props.username },
          },
          Restrictions: { slug: props.slug },
        },
        include: {
          ...include,
          users: {
            where: { username: props.username },
          },
        },
      })
    : await prisma.userList.findUnique({
        where: { id: props.id },
        include: {
          ...include,
          users: true,
        },
      })

  if (!userList) {
    return <NotFoundPage />
  }

  const { Restrictions: restrictions } = userList
  const isEpisodes = restrictions.mediaType === MediaType.TvEpisode

  const getBetterHSL = (
    hsl: [number, number, number] | undefined,
    lower: number,
    upper: number,
  ) => {
    if (!hsl) return
    const trans = clamp(hsl[2] * 100, lower, upper)
    return `hsl(${hsl[0] * 360}, ${hsl[1] * 100}%, ${trans}%)`
  }

  const addColorToListItem = async (item: ListItem) => {
    let bgColor = 'black'
    let rgb = [0, 0, 0]
    let textColor = 'white'
    let backdropUrl = '/movieBackdrop.jpeg'

    if (item.backdropPath) {
      const { vibrantSize, bgSize } = isEpisodes
        ? { vibrantSize: 'original', bgSize: 'original' }
        : { vibrantSize: 'w300', bgSize: 'w1280' }
      const color = await Vibrant.from(
        getTmdbImageUrl(item.backdropPath, vibrantSize),
      ).getPalette()
      bgColor = getBetterHSL(color.DarkMuted?.hsl, 0, 25) ?? bgColor
      rgb = color.DarkMuted?.rgb ?? rgb
      textColor = getBetterHSL(color.LightVibrant?.hsl, 75, 100) ?? textColor
      backdropUrl = getTmdbImageUrl(item.backdropPath, bgSize)
    }

    const baseUrl = `https://www.themoviedb.org`
    const tmdbHref = isEpisodes
      ? `${baseUrl}/${mediaTypes[MediaType.TvShow].url}/${restrictions.EpisodesTvShow.id}/season/${item.seasonNum}/episode/${item.episodeNum}`
      : `${baseUrl}/${mediaTypes[restrictions.mediaType].url}/${item.tmdbId}`

    return {
      ...item,
      bgColor,
      rgb,
      textColor,
      backdropUrl,
      tmdbHref,
    } as ListItemUI
  }

  const listItemPromises = [
    userList.item1,
    userList.item2,
    userList.item3,
    userList.item4,
    userList.item5,
  ]
    .map(item => addColorToListItem(item))
    .reverse()

  const listItemsReverse = await Promise.all(listItemPromises)
  const userListUsernames = userList.users.map(user => user.username)

  console.log(isForUser, userList.users.length)

  return (
    <div>
      <div className='flex flex-col items-center gap-4 px-8 md:gap-8 md:px-12'>
        <h1 className='text-center text-4xl font-semibold capitalize tracking-tight sm:text-6xl lg:text-7xl'>
          <ListTitleBase restrictions={restrictions} includeMediaType={true} />
        </h1>
        <div className='flex flex-col items-center gap-2'>
          <div className='flex flex-wrap items-center justify-center space-x-4'>
            <UserTime
              users={userList.users}
              actualUserCount={userList._count.users}
              lastUserAddedAt={userList.lastUserAddedAt}
              userListId={userList.id}
            />
            <Divider className='h-6' orientation='vertical' />
            <UserListButtons
              userListId={userList.id}
              usernames={userListUsernames}
              Restrictions={restrictions}
            />
          </div>
        </div>
      </div>
      <div className='mx-auto mt-4 flex max-w-screen-2xl flex-col items-center gap-16 md:mt-8'>
        {listItemsReverse.map((item: ListItemUI, i) => (
          <div
            className='group mx-4 flex flex-col items-stretch rounded-xl shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] lg:mx-0 lg:w-full lg:flex-row'
            style={{
              backgroundColor: item.bgColor,
            }}
            key={item.tmdbId}
          >
            <div className='order-last flex w-full items-center justify-center px-8 pb-10 pt-7 sm:gap-10 sm:pt-10 sm:shadow-none md:px-14 lg:w-2/5 lg:px-10 lg:pb-0 lg:pt-0 lg:group-odd:order-first lg:group-odd:pr-10 lg:group-even:pl-10 xl:gap-12'>
              <div className='text-neutral-300'>
                <div className='flex items-start gap-4'>
                  <h1 className='text-xl font-bold underline underline-offset-4 sm:text-xl sm:font-normal sm:underline-offset-8 md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl'>
                    {5 - i}
                  </h1>
                  <div
                    className='flex flex-col gap-2 sm:gap-3 lg:gap-2 xl:gap-3'
                    style={{
                      color: item.textColor,
                    }}
                  >
                    <Link href={item.tmdbHref} target='_blank'>
                      <h1 className='text-balance text-3xl font-extrabold leading-none tracking-tight sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl'>
                        {item.name}{' '}
                        {!isEpisodes && (
                          <small className='text-[50%] font-medium'>
                            ({new Date(item.date).getFullYear()})
                          </small>
                        )}
                      </h1>
                    </Link>
                    {isEpisodes && (
                      <h3 className='flex items-baseline gap-4 sm:text-xl md:text-2xl lg:text-base xl:text-2xl'>
                        Season {item.seasonNum} · Episode {item.episodeNum}
                        <Divider
                          className='h-4'
                          orientation='vertical'
                          style={{
                            backgroundColor: item.textColor,
                          }}
                        />
                        <p className='text-tiny sm:text-sm md:text-base lg:text-tiny xl:text-base'>
                          {format(new Date(item.date), 'MMM d, yyyy')}
                        </p>
                      </h3>
                    )}
                  </div>
                </div>
                <div className='mt-6 font-light xl:text-lg 2xl:text-xl'>
                  <ItemOverview overview={item.overview ?? ''} />
                </div>
              </div>
            </div>
            <div className='relative flex w-full items-center lg:w-3/5'>
              <NextImage
                className='lg:group-odd:fade-img-left fade-img-down lg:group-even:fade-img-right aspect-video rounded-xl object-cover'
                src={item.backdropUrl}
                alt='Robot Group'
                width={1280}
                height={720}
              />
              {!includes(item.backdropUrl, 'tmdb') && (
                <div className='absolute left-20 z-20'>
                  <Image
                    isBlurred
                    alt='dude'
                    as={NextImage}
                    height={277.5}
                    width={185}
                    src={getTmdbImageUrl(item.posterPath, 'w185')}
                  />
                </div>
              )}
              {/* {item.tagline && (
                <div
                  style={{
                    background: `rgba(${item.rgb[0]}, ${item.rgb[1]}, ${item.rgb[2]}, .7)`
                  }}
                  className='absolute bottom-10 z-10 hidden max-w-[75%] overflow-hidden p-4 shadow-small lg:block lg:group-odd:right-10 lg:group-even:left-10'
                >
                  <p
                    className={`text-2xl text-white/80 drop-shadow-lg ${dosis.className}`}
                  >
                    {item.tagline}
                  </p>
                </div>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
