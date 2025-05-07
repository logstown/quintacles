import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar"
import NextLink from 'next/link'

import { ThemeSwitch } from '@/components/theme-switch'
import { BrowseDropdown } from './BrowseDropdown'
import { UserOrSignIn } from './UserOrSignIn'
import NextImage from 'next/image'
import { CreateListButton } from './create-list-button'

export const Navbar = () => {
  return (
    // TODO: this needs to be position static for the browse exact to work
    <NextUINavbar
      maxWidth='xl'
      position='sticky'
      height='5rem'
      className='shadow-md dark:bg-neutral-900'
    >
      <NavbarContent className='sm:gap-6' justify='start'>
        <NavbarItem className='shrink-0'>
          <NextLink href='/' className='flex items-center gap-3'>
            <NextImage alt='quintopus' width='65' height='65' src='/octopus.png' />
            <p className='hidden text-xl font-semibold sm:block'>Quintacles</p>
          </NextLink>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className='gap-4 pl-4 md:gap-6' justify='end'>
        <NavbarItem className='hidden md:list-item'>
          <CreateListButton />
        </NavbarItem>
        <NavbarItem className='md:hidden'>
          <CreateListButton isSmall />
        </NavbarItem>
        <NavbarItem className='hidden md:list-item'>
          <BrowseDropdown />
        </NavbarItem>
        <NavbarItem className='md:hidden'>
          <BrowseDropdown isSmall />
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
  );
}
