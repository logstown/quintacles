'use client'

import { Button } from "@heroui/button"
import { Modal, ModalBody, ModalContent, ModalFooter } from "@heroui/modal"
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
            <ModalBody className='px-0 lg:px-6'>{children}</ModalBody>
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
