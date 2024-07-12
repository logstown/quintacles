import { ItemOverview } from '@/components/ItemOverview'
import { UserListButtons } from '@/components/UserListButtons'
import { UserTime } from '@/components/UserTime'
import { ListTitleBase } from '@/components/list-title-base'
import prisma from '@/lib/db'
import { getTmdbImageUrl } from '@/lib/random'
import { Divider } from '@nextui-org/divider'
import { Image } from '@nextui-org/image'
import NextImage from 'next/image'
import { MediaType } from '@prisma/client'
import { format } from 'date-fns'
import { clamp, includes } from 'lodash'
import Vibrant from 'node-vibrant'
import Link from 'next/link'
import { mediaTypes } from '@/lib/mediaTypes'
import { Tooltip } from '@nextui-org/tooltip'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { UsersIcon } from 'lucide-react'

type ListDetailProps = { id: number } | { username: string; slug: string }

export async function ListDetail(props: ListDetailProps) {
  const { userList, userListUsers, userAddedAt } = await getUserListData(props)

  if (!userList || !userAddedAt) {
    notFound()
  }

  const { Restrictions: restrictions } = userList
  const isEpisodes = restrictions.mediaType === MediaType.TvEpisode
  const isForUser = 'username' in props

  const listItemPromises = [
    userList.item1,
    userList.item2,
    userList.item3,
    userList.item4,
    userList.item5,
  ]
    .map(async item => {
      let bgColor = '#2e2609'
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
      }
    })
    .reverse()

  const listItemsReverse = await Promise.all(listItemPromises)

  return (
    <div>
      <div className='flex flex-col items-center gap-4 px-8 md:gap-8 md:px-12'>
        <h1 className='text-center text-5xl font-semibold capitalize tracking-tight drop-shadow-2xl sm:text-6xl lg:text-7xl'>
          <ListTitleBase restrictions={restrictions} includeMediaType={true} />
        </h1>
        <div className='flex flex-col items-center gap-2'>
          <div className='flex flex-wrap items-center justify-center space-x-6'>
            <UserTime
              size='lg'
              users={userListUsers}
              lastUserAddedAt={userAddedAt}
              userListId={userList.id}
            />
            <Divider className='h-6' orientation='vertical' />
            <div className='flex space-x-2'>
              <UserListButtons
                userListId={userList.id}
                usernames={userListUsers.map(user => user.username)}
                Restrictions={restrictions}
              />
              {isForUser && (
                <Tooltip content='View all list users'>
                  <Button
                    as={Link}
                    href={`/list/${userList.id}`}
                    size='lg'
                    isIconOnly
                    className='text-foreground-400'
                    aria-label='add'
                    variant='light'
                  >
                    <UsersIcon />
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='mx-auto mt-4 flex max-w-screen-2xl flex-col items-center gap-16 md:mt-8'>
        {listItemsReverse.map((item, i) => (
          <div
            className='group mx-4 flex max-w-screen-sm flex-col items-stretch rounded-xl shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] lg:mx-0 lg:w-full lg:max-w-none lg:flex-row'
            style={{
              backgroundColor: item.bgColor,
            }}
            key={item.tmdbId}
          >
            <div className='order-last flex w-full items-center justify-center px-8 pb-10 pt-7 sm:gap-10 sm:pb-14 sm:pt-14 sm:shadow-none md:px-14 lg:w-2/5 lg:px-10 lg:pb-0 lg:pt-0 lg:group-odd:order-first lg:group-odd:pr-10 lg:group-even:pl-10 xl:gap-12'>
              <div className='text-neutral-300'>
                <div className='flex items-start gap-4'>
                  <h1 className='text-xl font-bold underline underline-offset-4 sm:text-xl sm:font-normal sm:underline-offset-8 md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl'>
                    {5 - i}
                  </h1>
                  <div
                    className='flex flex-col gap-2 sm:gap-3 lg:gap-2 xl:gap-3'
                    style={{ color: item.textColor }}
                  >
                    <Link href={item.tmdbHref} target='_blank'>
                      <Tooltip content={item.name} delay={1000}>
                        <h1 className='line-clamp-4 text-balance pb-1 text-3xl font-extrabold leading-none tracking-tight sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl'>
                          {item.name}{' '}
                          {!isEpisodes && (
                            <small className='text-[50%] font-medium'>
                              ({new Date(item.date).getFullYear()})
                            </small>
                          )}
                        </h1>
                      </Tooltip>
                    </Link>
                    {isEpisodes && (
                      <h3 className='flex flex-col flex-wrap items-baseline sm:flex-row sm:gap-4 sm:text-xl md:text-2xl lg:text-base xl:text-2xl'>
                        <p>
                          Season <span className='font-bold'>{item.seasonNum}</span>{' '}
                          · Episode{' '}
                          <span className='font-bold'>{item.episodeNum}</span>
                        </p>
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
                unoptimized
                className='lg:group-odd:fade-img-left fade-img-down lg:group-even:fade-img-right aspect-video rounded-xl object-cover'
                src={item.backdropUrl}
                alt={`${item.name} backdrop`}
                width={1280}
                height={720}
              />
              {!includes(item.backdropUrl, 'tmdb') && (
                <div className='absolute left-1/4 z-20 max-w-[100px] sm:max-w-none'>
                  <Image
                    unoptimized
                    isBlurred
                    alt={`${item.name} poster`}
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

const getBetterHSL = (
  hsl: [number, number, number] | undefined,
  lower: number,
  upper: number,
) => {
  if (!hsl) return
  const trans = clamp(hsl[2] * 100, lower, upper)
  return `hsl(${hsl[0] * 360}, ${hsl[1] * 100}%, ${trans}%)`
}

async function getUserListData(props: ListDetailProps) {
  const isForUser = 'username' in props
  const include = {
    item1: true,
    item2: true,
    item3: true,
    item4: true,
    item5: true,
    Restrictions: {
      include: {
        Person: true,
        EpisodesTvShow: true,
      },
    },
  }

  if (isForUser) {
    const prismaFn = () =>
      prisma.usersOnUserLists.findUnique({
        where: {
          userRestrictionsByUsername: {
            username: props.username,
            restrictionsSlug: props.slug,
          },
        },
        include: {
          UserList: { include },
          User: true,
        },
      })

    const userOnUserList = await unstable_cache(prismaFn, [
      'user-list',
      props.username,
      props.slug,
    ])()

    return {
      userList: userOnUserList?.UserList,
      userListUsers: userOnUserList ? [userOnUserList.User] : [],
      userAddedAt: userOnUserList?.userAddedAt,
    }
  } else {
    const prismaFn = () =>
      prisma.userList.findUnique({
        where: { id: props.id },
        include: {
          ...include,
          users: {
            include: { User: true },
          },
        },
      })

    const userList = await unstable_cache(prismaFn, [
      'generic-list',
      props.id.toString(),
    ])()

    return {
      userList,
      userListUsers: userList ? userList.users.map(u => u.User) : [],
      userAddedAt: userList?.lastUserAddedAt,
    }
  }
}
