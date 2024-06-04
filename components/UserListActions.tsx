'use client'

import { EllipsisIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { Key } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown'
import { currentUser } from '@clerk/nextjs/dist/types/server'
import { Button } from '@nextui-org/button'
import { UserList } from '@prisma/client'
import { removeUserFromList } from '@/app/actions'

export function UserListActions({
  userListId,
  isSmall,
  userId,
}: {
  userListId: string
  isSmall?: boolean
  userId: string
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const iconSize = isSmall ? 20 : 24

  const { mutate: deleteListUI, isPending: isDeletePending } = useMutation({
    mutationFn: (onClose: () => void) => removeUserFromList(userListId),
    onSuccess: async (data, onClose) => {
      onClose()
    },
  })

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size={isSmall ? 'sm' : 'md'}
            className='text-foreground-400'
            aria-label='add'
            variant='light'
          >
            <EllipsisIcon size={iconSize} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label='Static Actions'>
          <DropdownItem
            key='edit'
            href={`/list/${userListId}/edit`}
            startContent={<PencilIcon size={15} />}
          >
            Edit
          </DropdownItem>
          <DropdownItem
            onPress={onOpen}
            key='delete'
            startContent={<TrashIcon size={15} />}
            className='text-danger'
            color='danger'
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Delete List?
              </ModalHeader>
              <ModalFooter>
                <Button
                  isLoading={isDeletePending}
                  color='danger'
                  onPress={() => deleteListUI(onClose)}
                >
                  Confirm
                </Button>
                {!isDeletePending && (
                  <Button variant='light' onPress={onClose}>
                    Cancel
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
