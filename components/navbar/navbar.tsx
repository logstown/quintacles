import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@nextui-org/navbar'
import { Link } from '@nextui-org/link'
import NextLink from 'next/link'

import { siteConfig } from '@/config/site'
import { ThemeSwitch } from '@/components/theme-switch'
import { Logo } from '@/components/icons'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { CreateListButton } from './create-list-button'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import { RandomListButton } from './random-list-button'

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
  console.log(results)

  redirect('/list/' + results[0].id)
}

export const Navbar = () => {
  // const searchInput = (
  //   <Input
  //     aria-label='Search'
  //     classNames={{
  //       inputWrapper: 'bg-default-100',
  //       input: 'text-sm',
  //     }}
  //     endContent={
  //       <Kbd className='hidden lg:inline-block' keys={['command']}>
  //         K
  //       </Kbd>
  //     }
  //     labelPlacement='outside'
  //     placeholder='Search...'
  //     startContent={
  //       <SearchIcon className='pointer-events-none flex-shrink-0 text-base text-default-400' />
  //     }
  //     type='search'
  //   />
  // )

  return (
    <NextUINavbar maxWidth='xl' position='sticky' className='shadow-md'>
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand as='li' className='max-w-fit gap-3'>
          <NextLink className='flex items-center justify-start gap-1' href='/'>
            <Logo />
            <p className='font-bold text-inherit'>ACME</p>
          </NextLink>
        </NavbarBrand>
        {/* <ul className='ml-2 hidden justify-start gap-4 lg:flex'>
          {siteConfig.navItems.map(item => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:font-medium data-[active=true]:text-primary',
                )}
                color='foreground'
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul> */}
      </NavbarContent>

      <NavbarContent
        className='hidden basis-1/5 sm:flex sm:basis-full'
        justify='end'
      >
        {/* <NavbarItem className='hidden lg:flex'>{searchInput}</NavbarItem> */}
        <NavbarItem className='hidden md:flex'>
          {/* <Button
            isExternal
            as={Link}
            className='bg-default-100 text-sm font-normal text-default-600'
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className='text-danger' />}
            variant='flat'
          >
            Sponsor
          </Button> */}
          <CreateListButton />
        </NavbarItem>
        <NavbarItem className='hidden md:flex'>
          <form action={getRandomList}>
            <RandomListButton />
          </form>
        </NavbarItem>
        <NavbarItem className='hidden gap-2 sm:flex'>
          <ThemeSwitch />
        </NavbarItem>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton appearance={{ elements: { avatarBox: 'h-10 w-10' } }} />
        </SignedIn>
      </NavbarContent>

      <NavbarContent className='h- basis-1 pl-4 sm:hidden' justify='end'>
        {/* <Link isExternal aria-label='Github' href={siteConfig.links.github}>
          <GithubIcon className='text-default-500' />
        </Link> */}
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {/* {searchInput} */}
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? 'primary'
                    : index === siteConfig.navMenuItems.length - 1
                      ? 'danger'
                      : 'foreground'
                }
                href='#'
                size='lg'
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  )
}
