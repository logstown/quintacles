import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from '@nextui-org/navbar'
import NextLink from 'next/link'

import { ThemeSwitch } from '@/components/theme-switch'
import { CreateListButton } from './create-list-button'
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
      <NavbarContent
        className='basis-1/5 gap-4 sm:basis-full sm:gap-8'
        justify='start'
      >
        <NavbarBrand as='li' className='max-w-fit gap-3'>
          <NextLink className='flex items-center justify-start gap-2' href='/'>
            <NextImage alt='octopus' width='65' height='65' src='/octopus.png' />
            <p className='hidden font-bold text-inherit sm:block'>Quintacles</p>
          </NextLink>
        </NavbarBrand>
        <div className='md:hidden'>
          <BrowseDropdown isSmall />
        </div>
        <div className='hidden md:flex'>
          <BrowseDropdown />
        </div>
      </NavbarContent>

      <NavbarContent
        className='hidden basis-1/5 sm:flex sm:basis-full'
        justify='end'
      >
        <NavbarItem>
          <div className='md:hidden'>
            <CreateListButton isSmall />
          </div>
          <div className='hidden md:flex'>
            <CreateListButton />
          </div>
        </NavbarItem>
        <NavbarItem>
          <form action={getRandomList}>
            <RandomListButton />
          </form>
        </NavbarItem>
        <NavbarItem className='hidden gap-2 sm:flex'>
          <ThemeSwitch />
        </NavbarItem>
        <UserOrSignIn />
      </NavbarContent>

      <NavbarContent className='basis-1 pl-4 sm:hidden' justify='end'>
        <CreateListButton isSmall />
        <RandomListButton />
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
