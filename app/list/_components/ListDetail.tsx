import { UserListButtons } from '@/components/UserListButtons'
import { UserTime } from '@/components/UserTime'
import { ListTitleBase } from '@/components/list-title-base'
import prisma from '@/lib/db'
import { getTmdbImageUrl, getUserListsUrl } from '@/lib/random'
import { Divider } from '@nextui-org/divider'
import { ListItem, MediaType } from '@prisma/client'
import { clamp, find, some } from 'lodash'
import Vibrant from 'node-vibrant'
import Link from 'next/link'
import { Tooltip } from '@nextui-org/tooltip'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { PlusIcon, UsersIcon } from 'lucide-react'
import { UserListInfinite } from '@/app/browse/_components/UserListInfinite'
import { auth } from '@clerk/nextjs/server'
import { getImages } from '@/lib/TmdbService'
import { UserListIcon } from '@/components/user-list/UserListIcon'
import { alternateLogos } from '@/lib/alternate-logos'
import { ListDetailItem } from './ListDetailItem'

export type ListDetailProps = { isModal?: boolean } & (
  | { id: number }
  | { username: string; slug: string }
)

export interface ListItemUI extends ListItem {
  bgColor: string
  textColor: string
  backdropUrl: string
  logoPath?: string
}

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

  let tvShowLogoFilePath
  if (restrictions.EpisodesTvShow.id) {
    const { logos } = await getImages(
      MediaType.TvShow,
      restrictions.EpisodesTvShow.id,
    )

    const alternateLogo = find(alternateLogos, {
      isListTitle: true,
      id: restrictions.EpisodesTvShow.id,
      mediaType: MediaType.TvShow,
    })
    const idx = alternateLogo?.logoIdx ?? 0
    tvShowLogoFilePath = logos[idx]?.file_path
  }

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
        const alternateLogo = find(alternateLogos, {
          isListTitle: false,
          id: item.tmdbId,
          mediaType: item.mediaType,
        })
        const logo = alternateLogo ? logos[alternateLogo.logoIdx] : logos[0]
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
        <h1
          className={`flex items-center gap-10 text-center text-5xl font-semibold capitalize tracking-tight drop-shadow-2xl ${restrictions.networkId || tvShowLogoFilePath ? 'sm:text-5xl' : 'sm:text-7xl'}`}
        >
          {restrictions.Person?.profilePath && (
            <UserListIcon
              isLarge
              mediaType={restrictions.mediaType}
              personPath={restrictions.Person.profilePath}
            />
          )}
          <ListTitleBase
            restrictions={restrictions}
            tvShowLogoFilePath={tvShowLogoFilePath}
            includeMediaType
          />
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
      <div className='mx-auto mt-8 flex max-w-screen-lg flex-col items-center gap-12 sm:mt-16 lg:gap-20'>
        {listItemsReverse.map((item, i) => (
          <ListDetailItem
            key={item.tmdbId}
            item={item}
            i={i}
            isEpisodes={isEpisodes}
            isModal={props.isModal}
            restrictions={restrictions}
          />
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
        <h3 className={`p-6 text-2xl`}>
          More{' '}
          <span className='font-bold'>
            <ListTitleBase restrictions={restrictions} includeMediaType />
          </span>
        </h3>
        <div className='flex justify-center'>
          <UserListInfinite
            restrictions={restrictions}
            userListIdToExclude={userList.id}
            sortBy='users'
            exactMatch={true}
          />
        </div>
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
        select: {
          UserList: { include },
          User: true,
          userAddedAt: true,
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
            select: { User: true },
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
