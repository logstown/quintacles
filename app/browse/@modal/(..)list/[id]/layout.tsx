'use client'

import { Button } from '@nextui-org/button'
import { Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/modal'
import { useRouter } from 'next/navigation'
export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <Modal
      defaultOpen
      classNames={{
        base: 'max-w-[2100px] max-h-fit',
      }}
      scrollBehavior='outside'
      onClose={() => router.back()}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
