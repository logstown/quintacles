import { ItemOverview } from '@/components/ItemOverview'
import { UserListButtons } from '@/components/UserListButtons'
import { UserTime } from '@/components/UserTime'
import { ListTitleBase } from '@/components/list-title-base'
import prisma from '@/lib/db'
import { getTmdbImageUrl, getUserListsUrl } from '@/lib/random'
import { Divider } from '@nextui-org/divider'
import { Image } from '@nextui-org/image'
import NextImage from 'next/image'
import { MediaType } from '@prisma/client'
import { format } from 'date-fns'
import { clamp, includes, some } from 'lodash'
import Vibrant from 'node-vibrant'
import Link from 'next/link'
import { Tooltip } from '@nextui-org/tooltip'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { PlusIcon, UsersIcon } from 'lucide-react'
import { ListItemLink } from './ListItemLink'
import { UserListInfinite } from '@/app/browse/_components/UserListInfinite'
import { auth } from '@clerk/nextjs/server'

export type ListDetailProps = { id: number } | { username: string; slug: string }

export async function ListDetail(props: ListDetailProps) {
  const { userList, userListUsers, userAddedAt } = await getUserListData(props)

  // const deal = await getImageStuff()
  // console.log(deal)

  if (!userList || !userAddedAt) {
    notFound()
  }

  const { Restrictions: restrictions } = userList
  const isEpisodes = restrictions.mediaType === MediaType.TvEpisode
  const isSeasons = restrictions.mediaType === MediaType.TvSeason
  const isForUser = 'username' in props
  const currentUserId = auth().userId
  const isCurrentUsersList = some(userListUsers, { id: currentUserId })

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

      if (item.backdropPath || (isSeasons && item.posterPath)) {
        const { vibrantSize, bgSize } = isEpisodes
          ? { vibrantSize: 'original', bgSize: 'original' }
          : { vibrantSize: 'w300', bgSize: 'w1280' }
        const color = await Vibrant.from(
          getTmdbImageUrl(item.backdropPath ?? item.posterPath, vibrantSize),
        ).getPalette()
        bgColor = getBetterHSL(color.Muted?.hsl, 0, 25) ?? bgColor
        rgb = color.DarkMuted?.rgb ?? rgb
        textColor = getBetterHSL(color.Vibrant?.hsl, 75, 100) ?? textColor // TODO: this used to be LightVibrant
        backdropUrl = getTmdbImageUrl(item.backdropPath, bgSize)
      }

      return {
        ...item,
        bgColor,
        rgb,
        textColor,
        backdropUrl,
      }
    })
    .reverse()

  const listItemsReverse = await Promise.all(listItemPromises)

  return (
    <div>
      <div className='flex flex-col items-center gap-8 px-8 md:px-12'>
        <h1 className='text-center text-5xl font-semibold capitalize tracking-tight drop-shadow-2xl sm:text-6xl lg:text-7xl'>
          <ListTitleBase restrictions={restrictions} includeMediaType={true} />
        </h1>
        <div className='flex flex-wrap items-center justify-center space-x-6'>
          <div className='flex items-center justify-center space-x-6'>
            <UserTime
              size='lg'
              users={userListUsers}
              lastUserAddedAt={userAddedAt}
              userListId={userList.id}
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
          {isCurrentUsersList && (
            <>
              <Divider className='hidden h-6 sm:block' orientation='vertical' />
              <UserListButtons
                userListId={userList.id}
                usernames={userListUsers.map(user => user.username)}
                Restrictions={restrictions}
              />
            </>
          )}
        </div>
      </div>
      <div className='mx-auto mt-8 flex max-w-screen-2xl flex-col items-center gap-16'>
        {listItemsReverse.map((item, i) => (
          <div
            className='group mx-4 flex max-w-screen-sm flex-col items-stretch rounded-xl shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] lg:mx-0 lg:w-full lg:max-w-none lg:flex-row'
            style={{
              backgroundColor: item.bgColor,
            }}
            key={item.tmdbId}
          >
            <div className='order-last flex w-full items-center justify-center px-8 pb-10 pt-7 sm:gap-10 sm:pb-14 sm:pt-14 sm:shadow-none md:px-14 lg:w-2/5 lg:px-10 lg:pb-0 lg:pt-0 lg:group-odd:order-first lg:group-odd:pr-10 lg:group-even:pl-11 xl:gap-12'>
              <div className='text-neutral-300'>
                <div className='flex items-start gap-4'>
                  <h1 className='text-xl font-bold underline underline-offset-4 sm:text-xl sm:font-normal sm:underline-offset-8 md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl'>
                    {5 - i}
                  </h1>
                  <div
                    className='flex flex-col gap-1 md:gap-2 lg:gap-1 xl:gap-2'
                    style={{ color: item.textColor }}
                  >
                    <ListItemLink
                      mediaType={restrictions.mediaType}
                      tvShowId={restrictions.EpisodesTvShow.id}
                      item={item}
                    >
                      <Tooltip content={item.name} delay={1000}>
                        <h1 className='line-clamp-4 text-balance pb-1 text-3xl font-extrabold leading-none tracking-tight sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl'>
                          {item.name}{' '}
                          {!isEpisodes &&
                            (restrictions.mediaType === MediaType.TvShow ||
                              !restrictions.year ||
                              restrictions.year > 10000) && (
                              <small className='text-[40%] font-medium'>
                                {new Date(item.date).getFullYear()}
                              </small>
                            )}
                        </h1>
                      </Tooltip>
                    </ListItemLink>
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
                <div className={`mt-6 font-light xl:text-lg 2xl:text-xl`}>
                  <ItemOverview omitNoOverview overview={item.overview ?? ''} />
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
                <div className='absolute left-1/4 z-20'>
                  <Image
                    unoptimized
                    isBlurred
                    alt={`${item.name} poster`}
                    classNames={{
                      img: 'max-h-[150px] max-w-[100px] sm:max-h-[277.5px] sm:max-w-[185px] 2xl:max-h-[450px] 2xl:max-w-[300px]',
                      blurredImg:
                        'max-h-[150px] max-w-[100px] sm:max-h-[277.5px] sm:max-w-[185px] 2xl:max-h-[450px] 2xl:max-w-[300px]',
                    }}
                    as={NextImage}
                    height={513}
                    width={342}
                    src={getTmdbImageUrl(item.posterPath, 'w342')}
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
      {!isCurrentUsersList && (
        <div className='mt-20 flex justify-center'>
          <Button
            className='bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-2xl md:rounded-3xl md:p-10 md:text-2xl'
            size='lg'
            as={Link}
            prefetch={!!currentUserId}
            href={getUserListsUrl(restrictions)}
            startContent={<PlusIcon />}
          >
            Create this list
          </Button>
        </div>
      )}
      <div className='mx-auto mt-16 max-w-screen-lg'>
        <h3 className='p-6 text-2xl'>
          More{' '}
          <span className='font-bold'>
            <ListTitleBase restrictions={restrictions} includeMediaType />
          </span>
        </h3>
        <UserListInfinite
          restrictions={restrictions}
          userListIdToExclude={userList.id}
          sortBy='users'
          exactMatch={true}
        />
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

export async function getUserListData(props: ListDetailProps) {
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
