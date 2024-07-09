'use client'

import { EllipsisIcon, PencilIcon, ShareIcon, TrashIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
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
import { Button } from '@nextui-org/button'
import { userDeletesList } from '@/app/actions'
import copy from 'clipboard-copy'
import { toast } from 'sonner'
import { useUserListLink } from '@/lib/hooks'
import { RestrictionsUI } from '@/lib/models'

export function UserListActions({
  userListId,
  isSmall,
  restrictions,
  usernames,
}: {
  userListId: number
  isSmall?: boolean
  restrictions: RestrictionsUI
  usernames: string[]
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const iconSize = isSmall ? 24 : 28
  const userListLink = useUserListLink(restrictions, usernames, userListId)

  const { mutate: deleteListUI, isPending: isDeletePending } = useMutation({
    mutationFn: (onClose: () => void) => userDeletesList(userListId, restrictions),
    onSuccess: async (data, onClose) => {
      onClose()
    },
  })

  const shareList = () => {
    copy(`${window.location.origin}${userListLink}`)
    toast.success('Link copied to clipboard!')
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size={isSmall ? 'md' : 'lg'}
            className='text-foreground-400'
            aria-label='add'
            variant='light'
          >
            <EllipsisIcon size={iconSize} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label='Static Actions'>
          <DropdownItem
            key='share'
            startContent={<ShareIcon size={15} />}
            className='text-primary'
            color='primary'
            onPress={shareList}
          >
            Share
          </DropdownItem>
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
              <ModalHeader className='flex flex-col gap-1'>Delete List?</ModalHeader>
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
