import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/navbar'
import NextLink from 'next/link'

import { ThemeSwitch } from '@/components/theme-switch'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import { RandomListButton } from './random-list-button'
import { BrowseDropdown } from './BrowseDropdown'
import { UserOrSignIn } from './UserOrSignIn'
import NextImage from 'next/image'

async function getRandomList() {
  'use server'

  // const users = await prisma.userList.count()
  // const foundUserList = await prisma.userList.findMany({
  //   take: 1,
  //   skip: Math.floor(Math.random() * (users - 1)),
  // })

  const results: any[] = await prisma.$queryRawUnsafe(
    // DO NOT pass in or accept user input here
    `SELECT * FROM "UserList" ORDER BY RANDOM() LIMIT 1;`,
  )

  redirect('/list/' + results[0].id)
}

export const Navbar = () => {
  return (
    <NextUINavbar maxWidth='xl' position='sticky' className='shadow-md'>
      <NavbarContent className='sm:gap-6' justify='start'>
        <NavbarItem className='shrink-0'>
          <NextLink href='/' className='flex items-center gap-3'>
            <NextImage
              alt='octopus'
              width='65'
              height='65'
              src='/octopus.png'
              unoptimized
            />
            <p className='hidden text-xl font-semibold sm:block'>Quintacles</p>
          </NextLink>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className='gap-6 pl-4' justify='end'>
        <NavbarItem>
          <BrowseDropdown />
        </NavbarItem>
        <NavbarItem>
          <form action={getRandomList}>
            <RandomListButton />
          </form>
        </NavbarItem>
        <ThemeSwitch />
        <UserOrSignIn />
        {/* <NavbarMenuToggle /> */}
      </NavbarContent>

      {/* <NavbarMenu>
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          <NavbarMenuItem key='browse'>
            <Link href='/browse/movies' size='lg'>
              Browse
            </Link>
          </NavbarMenuItem>
          {mediaTypeArrForLists.map(({ icon, urlPlural, plural }) => {
            const mediaTypeIconSmaller = cloneElement(icon, {
              size: 18,
              strokeWidth: 1.5,
            })
            return (
              <NavbarMenuItem
                className='capitalize text-foreground'
                key={urlPlural}
              >
                <Link
                  href={`/create/criteria/${urlPlural}`}
                  size='lg'
                  color='foreground'
                >
                  Create {plural} list
                </Link>
              </NavbarMenuItem>
            )
          })}
        </div>
      </NavbarMenu> */}
    </NextUINavbar>
  )
}
