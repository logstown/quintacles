'use client'

import { Modal, ModalContent } from '@nextui-org/modal'
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
      <ModalContent>{children}</ModalContent>
    </Modal>
  )
}
