'use client'

import { SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { reject } from 'lodash'
import { ListItem, MediaType } from '@prisma/client'
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import { ListTitle } from '../../app/create/criteria/_components/list-title'
import { ListTitleBase } from '@/components/list-title-base'
import { Button } from '@nextui-org/button'
import { EpisodeData, RestrictionsUI } from '@/lib/models'
import { useMutation } from '@tanstack/react-query'
import { CreateListItem } from './CreateListItem'
import { EpisodePicker } from './EpisodePicker'
import { Suggestions } from './Suggestions'
import { createOrUpdateUserList } from '@/app/actions'
import { Reorder } from 'framer-motion'
import { BackgroundGradient } from '../background-gradient'
import { ReorderGroupResponsive } from './ReorderGroupResponsive'
import { SeasonPicker } from './SeasonPicker'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { mediaTypes } from '@/lib/mediaTypes'

export function BuildList({
  restrictions,
  listItemsToEdit,
  userListId,
  episodeData,
  seasons,
}: {
  restrictions: RestrictionsUI
  listItemsToEdit?: ListItem[]
  userListId?: number
  episodeData?: EpisodeData
  seasons?: ListItem[]
}) {
  const router = useRouter()
  const [listItems, setListItems] = useState<ListItem[]>(listItemsToEdit ?? [])
  const isEpisodes = restrictions.mediaType === MediaType.TvEpisode

  const { mutate: save, isPending: isSavePending } = useMutation({
    mutationFn: async () =>
      createOrUpdateUserList({ restrictions, listItems, userListId }),
    onError: e => console.log(e),
  })

  useEffect(() => {
    if (seasons && seasons.length < 5) {
      toast.warning('Tv show needs at least 5 seasons to create a list')
      router.replace(`/create/criteria/${mediaTypes[MediaType.TvSeason].urlPlural}`)
    }
  }, [seasons])

  const title = userListId ? 'Edit List' : ''

  const addListItem = async (item: ListItem) => {
    setListItems([...listItems, item])
  }

  const removeFromList = ({ tmdbId }: ListItem) => {
    const newList = reject(listItems, { tmdbId })
    setListItems(newList)
  }

  const listCard = (
    <Card shadow='lg' className='py-4 sm:px-6 md:px-10'>
      <CardHeader className='pb-5'>
        <ListTitle mediaType={restrictions.mediaType}>
          <ListTitleBase restrictions={restrictions} />
        </ListTitle>
      </CardHeader>
      <CardBody className='rounded-xl bg-foreground-100 px-1 shadow-inner sm:p-6 sm:px-6 md:p-10 md:px-10'>
        <ReorderGroupResponsive
          setListItems={setListItems}
          isEpisodes={isEpisodes}
          listItems={listItems}
        >
          {[0, 1, 2, 3, 4].map(i => {
            const item = listItems[i]

            return (
              <Reorder.Item key={item?.tmdbId ?? i} value={item}>
                <CreateListItem
                  key={i}
                  item={item}
                  itemOrder={i + 1}
                  removeFromList={removeFromList}
                  isEpisode={isEpisodes}
                />
              </Reorder.Item>
            )
          })}
        </ReorderGroupResponsive>
      </CardBody>
      <CardFooter className='mt-2 justify-end'>
        <Button
          isDisabled={listItems.length !== 5}
          color='primary'
          size='lg'
          variant='shadow'
          endContent={isSavePending ? '' : <SaveIcon size={20} />}
          isLoading={isSavePending}
          onClick={() => save()}
        >
          {isSavePending ? 'Saving...' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <main className='mx-auto mb-12 mt-6 flex max-w-screen-xl flex-col gap-8'>
      <div className='flex flex-col items-center'>
        <div className='flex flex-col justify-center gap-6'>
          <h1 className='text-2xl'>{title}</h1>
          {listItems.length === 5 ? (
            <BackgroundGradient>{listCard}</BackgroundGradient>
          ) : (
            listCard
          )}
        </div>
      </div>
      <div className='mt-10'>
        {restrictions.EpisodesTvShow && episodeData ? (
          <EpisodePicker
            tvShow={restrictions.EpisodesTvShow}
            onItemSelected={addListItem}
            listItems={listItems}
            episodeData={episodeData}
          />
        ) : restrictions.mediaType === MediaType.TvSeason ? (
          <SeasonPicker
            seasons={seasons ?? []}
            onItemSelected={addListItem}
            listItems={listItems}
          />
        ) : (
          <Suggestions
            onItemSelected={addListItem}
            listItems={listItems}
            restrictions={restrictions}
          />
        )}
      </div>
    </main>
  )
}
