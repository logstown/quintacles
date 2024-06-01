import NotFoundPage from '@/components/404'
import { ItemOverview } from '@/components/ItemOverview'
import { UserListButtons } from '@/components/UserListButtons'
import { UserTime } from '@/components/UserTime'
import { ListTitleBase } from '@/components/list-title-base'
import prisma from '@/lib/db'
import { RestrictionsUI } from '@/lib/models'
import { getTmdbImageUrl } from '@/lib/random'
import { Divider } from '@nextui-org/divider'
import { Image } from '@nextui-org/image'
import { ListItem, MediaType } from '@prisma/client'
import { format } from 'date-fns'
import { clamp, includes } from 'lodash'
import Vibrant from 'node-vibrant'

export interface ListItemUI extends ListItem {
  bgColor: string
  textColor: string
  rgb: number[]
  backdropUrl: string
}

export default async function ListPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const userList = await prisma.userList.findUnique({
    where: { id },
    include: {
      users: true,
      items: true,
      Restrictions: {
        include: {
          Person: true,
          EpisodesTvShow: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  if (!userList) {
    return <NotFoundPage />
  }

  const isEpisodes = userList.Restrictions.mediaType === MediaType.TvEpisode

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

    return {
      ...item,
      bgColor,
      rgb,
      textColor,
      backdropUrl,
    } as ListItemUI
  }

  const listItemPromises = userList.orderedItemIdsString
    .split('-')
    .map(
      id =>
        userList.items.find(
          item => item.id === `${userList.Restrictions.mediaType}-${id}`,
        )!,
    )
    .map(item => addColorToListItem(item))
    .reverse()

  const listItemsReverse = await Promise.all(listItemPromises)
  const userListUserIds = userList.users.map(user => user.id)

  return (
    <main>
      <div className='mt-8 flex flex-col items-center gap-4 px-8 md:gap-8 md:px-12'>
        <h1 className='text-center text-4xl font-semibold capitalize tracking-tight sm:text-6xl lg:text-7xl lg:tracking-normal'>
          <ListTitleBase
            restrictions={userList.Restrictions as unknown as RestrictionsUI}
            includeMediaType={true}
          />
        </h1>
        <div className='flex flex-wrap items-center justify-center space-x-4'>
          <UserTime
            users={userList.users}
            lastUserAddedAt={userList.lastUserAddedAt}
          />
          <Divider className='h-6' orientation='vertical' />
          <UserListButtons
            userListId={userList.id}
            userListUserIds={userListUserIds}
            Restrictions={userList.Restrictions as unknown as RestrictionsUI}
          />
        </div>
      </div>
      <div className='mt-4 flex flex-col items-center gap-10 md:mt-8 lg:gap-7'>
        {listItemsReverse.map((item: ListItemUI, i) => (
          <div
            className='group mx-4 flex max-w-[650px] flex-col items-stretch rounded-xl lg:mx-0 lg:w-full lg:max-w-none lg:flex-row lg:rounded-none '
            style={{
              backgroundColor: item.bgColor,
            }}
            key={item.id}
          >
            <div className='xs:px-10 order-last flex w-full items-center justify-center px-8 pb-10 pt-7 sm:gap-10 sm:pt-10 sm:shadow-none md:px-14 lg:w-2/5 lg:px-10 lg:pb-0 lg:pt-0 lg:group-odd:order-first lg:group-odd:pr-10 lg:group-even:pl-10 xl:gap-12'>
              <div className='text-neutral-300'>
                <div className='flex items-start gap-4'>
                  <h1 className='text-xl font-bold underline underline-offset-4 sm:text-2xl sm:font-normal sm:underline-offset-8 md:text-5xl lg:text-4xl xl:text-5xl'>
                    {5 - i}
                  </h1>
                  <div
                    className='flex flex-col gap-2 sm:gap-3 lg:gap-2 xl:gap-3'
                    style={{
                      color: item.textColor,
                    }}
                  >
                    <h1 className='text-balance text-4xl font-extrabold leading-none tracking-tight sm:text-5xl md:text-6xl lg:text-4xl xl:text-6xl'>
                      {item.name}{' '}
                      {!isEpisodes && (
                        <small className='text-[50%] font-medium'>
                          ({new Date(item.date).getFullYear()})
                        </small>
                      )}
                    </h1>
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
            <div className='relative flex w-full items-center lg:w-3/5 '>
              <Image
                classNames={{ img: 'lg:rounded-none rounded-xl' }}
                className='lg:group-odd:fade-img-left fade-img-down lg:group-even:fade-img-right object-cover '
                src={item.backdropUrl}
                disableSkeleton={true}
                alt='Robot Group'
                width={1280}
                height={720}
              />
              {!includes(item.backdropUrl, 'tmdb') && (
                <div className='absolute left-20 z-20'>
                  <Image
                    isBlurred
                    alt='dude'
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
    </main>
  )
}
