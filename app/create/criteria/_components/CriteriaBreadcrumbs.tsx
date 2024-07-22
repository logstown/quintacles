'use client'

import { mediaTypes } from '@/lib/mediaTypes'
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs'
import { MediaType } from '@prisma/client'

export function CriteriaBreadcrumbs({
  mediaType,
  isAddItems,
}: {
  mediaType: MediaType
  isAddItems?: boolean
}) {
  return (
    <Breadcrumbs size='lg' variant='solid' underline='hover' className='mb-12'>
      <BreadcrumbItem href='/create/criteria'>Create List</BreadcrumbItem>
      <BreadcrumbItem href={`/create/criteria/${mediaTypes[mediaType].urlPlural}`}>
        {mediaTypes[mediaType].plural}
      </BreadcrumbItem>
      {isAddItems && <BreadcrumbItem>Add items</BreadcrumbItem>}
    </Breadcrumbs>
  )
}
