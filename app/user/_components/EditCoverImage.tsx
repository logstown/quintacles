'use client'

import { useDebounce } from '@/lib/hooks'
import { Button } from '@nextui-org/button'
import { Card, CardBody, CardFooter } from '@nextui-org/card'
import { Input } from '@nextui-org/input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal'
import { Image } from '@nextui-org/image'
import { useMutation, useQuery } from '@tanstack/react-query'
import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { getTmdbImageUrl } from '@/lib/random'
import { updateUserCoverImage } from '@/app/actions'
import { CircularProgress } from '@nextui-org/progress'
import NextImage from 'next/image'

export function EditCoverImage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [searchText, setSearchText] = useState('')
  const [selected, setSelected] = useState<any>()
  const debouncedSearchText = useDebounce(searchText, 500)

  const {
    data: items,
    isLoading,
    isSuccess,
    isPending,
  } = useQuery({
    queryKey: ['search', debouncedSearchText],
    queryFn: async () => {
      const res = await fetch(
        `/api/tmdb/search/?mediaType=multi&query=${debouncedSearchText}`,
      )

      const {
        data: { results },
      } = await res.json()

      const filtered = results.filter((item: any) => item.backdrop_path)

      return filtered
    },
    enabled: debouncedSearchText.length >= 3,
    // TODO: uncomment these options
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
    // refetchOnReconnect: false,
    // staleTime: Infinity,
  })

  const { mutate: save, isPending: isSavePending } = useMutation({
    mutationFn: async (onClose: () => void) =>
      updateUserCoverImage(selected.backdrop_path),
    onError: e => console.log(e),
    onSuccess: async (data, onClose) => {
      setSelected(null)
      setSearchText('')
      onClose()
    },
  })

  const closeModal = (onClose: () => void) => () => {
    setSelected(null)
    setSearchText('')
    onClose()
  }

  const getDate = (item: any) => {
    if (item.release_date) {
      return item.release_date.split('-')[0]
    }

    if (item.first_air_date) {
      return item.first_air_date.split('-')[0]
    }

    return ''
  }

  const isMessage = isLoading || !items?.length

  return (
    <>
      <Button size='sm' onPress={onOpen} startContent={<PencilIcon size={15} />}>
        Edit cover image
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior='inside'
        size='5xl'
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Choose Cover Image
              </ModalHeader>
              <ModalBody>
                <Input
                  label='Search'
                  value={searchText}
                  onValueChange={setSearchText}
                />
                <div
                  className={`flex min-h-[250px] rounded-lg bg-foreground-100 p-4 ${isMessage ? 'items-center justify-center' : 'flex-wrap content-start gap-3 '}`}
                >
                  {!items && !isLoading && <p>Search for a movie or TV show</p>}
                  {isSuccess && !items?.length && <p>Nothing Found...</p>}
                  {isLoading && <CircularProgress />}
                  {items?.map((item: any) => (
                    <Card
                      shadow='sm'
                      key={item.id}
                      className={`w-[300px] ${selected?.id === item.id && 'border-4 border-primary'}`}
                      isPressable
                      onPress={() => setSelected(item)}
                    >
                      <CardBody className='p-0'>
                        <Image
                          as={NextImage}
                          shadow='sm'
                          radius='lg'
                          width={300}
                          height={169}
                          alt={item.title || item.name}
                          className='w-full rounded-none object-cover'
                          src={getTmdbImageUrl(item.backdrop_path, 'w300')}
                        />
                      </CardBody>
                      <CardFooter className='text-small'>
                        <p className='truncate'>
                          {item.title || item.name} ({getDate(item)})
                        </p>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={closeModal(onClose)}>
                  Cancel
                </Button>
                <Button
                  isLoading={isSavePending}
                  color='primary'
                  onPress={() => save(onClose)}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
