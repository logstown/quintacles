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
import { getImages, getImageStuff } from '@/lib/TmdbService'

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
  const { userId: currentUserId } = await auth()
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
      let textColor = 'white'
      let backdropUrl = '/movieBackdrop.jpeg'
      let logoPath

      if (!isEpisodes && !isSeasons) {
        const { logos } = await getImages(item.mediaType, item.tmdbId)
        const logo = logos[0]
        logoPath = logo ? getTmdbImageUrl(logo.file_path, 'w500') : ''
      }

      if (item.backdropPath || (isSeasons && item.posterPath)) {
        const { vibrantSize, bgSize } = isEpisodes
          ? { vibrantSize: 'original', bgSize: 'w1280' }
          : { vibrantSize: 'w300', bgSize: 'w1280' }

        backdropUrl = getTmdbImageUrl(item.backdropPath, bgSize)

        if (!logoPath) {
          const color = await Vibrant.from(
            getTmdbImageUrl(item.backdropPath ?? item.posterPath, vibrantSize),
          ).getPalette()
          bgColor = getBetterHSL(color.DarkVibrant?.hsl, 0, 25) ?? bgColor
          textColor = getBetterHSL(color.LightVibrant?.hsl, 75, 100) ?? textColor
        }
      }

      return {
        ...item,
        bgColor,
        textColor,
        backdropUrl,
        logoPath,
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
      <div className='mx-auto mt-8 flex max-w-screen-xl flex-col items-center gap-12 lg:gap-20'>
        {listItemsReverse.map((item, i) => (
          <div
            key={item.tmdbId}
            className='flex aspect-video w-full flex-col items-center justify-end rounded-xl bg-cover bg-center px-6 pb-6 pt-52 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] sm:px-16 sm:pb-16'
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 1)),url(${item.backdropUrl})`,
            }}
          >
            <div className='flex max-w-prose flex-col gap-6'>
              <div
                className={`flex gap-6 sm:gap-10 lg:gap-12 ${isEpisodes ? 'items-start' : `${item.logoPath ? 'items-center' : 'items-end'}`}`}
              >
                <h2
                  className={`text-5xl font-extrabold !leading-[.8] tracking-tight text-neutral-100 drop-shadow-[0_1px_1px_white] lg:text-7xl`}
                >
                  {5 - i}
                </h2>
                <div
                  style={{ color: item.textColor }}
                  className='flex flex-col justify-center gap-2 sm:gap-3'
                >
                  <ListItemLink
                    mediaType={restrictions.mediaType}
                    tvShowId={restrictions.EpisodesTvShow.id}
                    item={item}
                  >
                    <Tooltip content={item.name} delay={1000}>
                      {item.logoPath ? (
                        <img className='' src={item.logoPath} />
                      ) : (
                        <h1 className='line-clamp-4 overflow-visible text-balance text-3xl font-extrabold !leading-[.8] tracking-tight drop-shadow-2xl sm:text-5xl'>
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
                      )}
                    </Tooltip>
                  </ListItemLink>
                  {isEpisodes && (
                    <h3 className='flex flex-col flex-wrap items-baseline sm:flex-row sm:gap-4 sm:text-xl md:text-2xl'>
                      <p>
                        Season <span className='font-bold'>{item.seasonNum}</span> ·
                        Episode <span className='font-bold'>{item.episodeNum}</span>
                      </p>
                      <p className='text-tiny sm:text-sm md:text-base lg:text-tiny xl:text-base'>
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
              <div className='text-sm font-light text-white sm:text-base xl:text-lg'>
                <ItemOverview omitNoOverview overview={item.overview ?? ''} />
              </div>
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
        <h3 className={`p-6 text-2xl ${isEpisodes ? '' : 'text-rigth'}`}>
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
        Network: true,
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
