import { ListItem } from '@prisma/client'
import { Reorder } from 'framer-motion'

export function ReorderGroupResponsive({
  children,
  listItems,
  setListItems,
  isEpisodes,
}: {
  children: React.ReactNode
  listItems: ListItem[]
  setListItems: (items: ListItem[]) => void
  isEpisodes: boolean
}) {
  return (
    <>
      {isEpisodes && (
        <Reorder.Group
          values={listItems}
          axis='y'
          onReorder={setListItems}
          className={`flex flex-col justify-center gap-5 xl:hidden`}
        >
          {children}
        </Reorder.Group>
      )}
      <Reorder.Group
        values={listItems}
        axis='x'
        onReorder={setListItems}
        className={`flex-row justify-center ${isEpisodes ? 'hidden gap-5 xl:flex' : 'flex gap-1 sm:gap-5'}`}
      >
        {children}
      </Reorder.Group>
    </>
  )
}
