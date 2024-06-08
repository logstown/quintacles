'use client'

import { ArrowLeft, SaveIcon } from 'lucide-react'
import { useState } from 'react'
import { reject } from 'lodash'
import { ListItem, MediaType } from '@prisma/client'
import { mediaTypes } from '@/lib/mediaTypes'
import { redirect } from 'next/navigation'
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import { ListTitle } from '../../app/create/criteria/_components/list-title'
import { ListTitleBase } from '@/components/list-title-base'
import { Button } from '@nextui-org/button'
import { RestrictionsUI } from '@/lib/models'
import { useMutation } from '@tanstack/react-query'
import { CreateListItem } from './CreateListItem'
import { AddMedia } from './AddMedia'
import { EpisodePicker } from './EpisodePicker'
import { Suggestions } from './Suggestions'
import { EpisodeData } from '@/lib/random'
import { createOrUpdateUserList } from '@/app/actions'

export function BuildList({
  restrictions,
  listItemsToEdit,
  userListId,
  episodeData,
}: {
  restrictions: RestrictionsUI
  listItemsToEdit?: ListItem[]
  userListId?: string
  episodeData?: EpisodeData
}) {
  const [listItems, setListItems] = useState<ListItem[]>(listItemsToEdit ?? [])

  const isEpisodes = restrictions.mediaType === MediaType.TvEpisode

  const { mutate: save, isPending: isSavePending } = useMutation({
    mutationFn: async () =>
      createOrUpdateUserList({ restrictions, listItems, userListId }),
    onError: e => console.log(e),
    onSettled(data, error, variables, context) {
      console.log(['onSettled', data, error, variables, context])
    },
  })

  const title = userListId ? 'Edit List' : 'Add Items'

  const addListItem = async (item: ListItem) => {
    setListItems([...listItems, item])
  }

  const removeFromList = ({ tmdbId }: ListItem) => {
    const newList = reject(listItems, { tmdbId })
    setListItems(newList)
  }

  const goToCriteria = () => {
    redirect(`/create/criteria/${mediaTypes[restrictions.mediaType].urlPlural}`)
  }

  const items = [0, 1, 2, 3, 4].map(i => {
    const item = listItems[i]

    return item ? (
      <CreateListItem
        key={i}
        item={item}
        itemOrder={i + 1}
        removeFromList={removeFromList}
      />
    ) : (
      <div key={i} className='relative'>
        <div className='invisible'>
          {isEpisodes ? (
            <img
              className='hidden sm:block'
              src='/dummyStill.jpeg'
              alt='NextUI hero Image'
            />
          ) : (
            <img src='/dummyPoster.jpeg' alt='NextUI hero Image' />
          )}
        </div>
        {i === listItems.length && !isEpisodes && (
          <AddMedia
            addListItem={addListItem}
            mediaType={restrictions.mediaType}
            listItems={listItems}
          />
        )}
      </div>
    )
  })

  return (
    <main className='container mx-auto mb-12 mt-6 flex flex-col gap-8'>
      <div className='flex flex-col items-center'>
        <div className='flex flex-col justify-center gap-6'>
          <h1 className='text-2xl'>{title}</h1>
          <Card shadow='lg' className='py-4 sm:px-6 md:px-10'>
            <CardHeader className='pb-5'>
              <ListTitle mediaType={restrictions.mediaType}>
                <ListTitleBase restrictions={restrictions} />
              </ListTitle>
            </CardHeader>
            <CardBody className='rounded-xl bg-foreground-100 shadow-inner sm:p-10'>
              {/* <ReactSortable
                list={listItems}
                setList={setListItems}
                animation={200}
                delay={2}
                handle='.media-item-grip'
                className='flex flex-wrap justify-center gap-2 lg:gap-5'
              > */}
              {listItems.length === 0 && isEpisodes && (
                <div className='absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2'>
                  <em>Add Episodes Below</em>
                </div>
              )}
              <div
                className={`flex justify-center ${isEpisodes ? 'flex-col gap-5 sm:flex-row sm:gap-3 lg:gap-5' : 'gap-1 sm:gap-5'}`}
              >
                {items}
              </div>
              {/* </ReactSortable> */}
            </CardBody>
            <CardFooter className='mt-2 justify-end gap-4'>
              {!userListId && (
                <Button
                  className={isSavePending ? 'invisible' : ''}
                  startContent={<ArrowLeft size={15} />}
                  variant='light'
                  onClick={goToCriteria}
                >
                  Criteria
                </Button>
              )}
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
