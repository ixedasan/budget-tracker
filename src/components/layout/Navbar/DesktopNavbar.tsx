import { NavbarProps } from '@/types'
import { UserButton } from '@clerk/nextjs'

import Logo from '@/components/common/Logo'
import ThemeSwitcher from '@/components/common/ThemeSwitcher'

import NavbarItem from './NavbarItem'

const DesktopNavbar = ({ items }: NavbarProps) => {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <div className="flex items-center justify-between px-6">
        <Logo />
        <div className="flex h-20 min-h-14 items-center gap-x-4">
          <div className="flex h-full">
            {items.map((item, index) => (
              <NavbarItem key={index} link={item.link} name={item.name} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <UserButton />
        </div>
      </div>
    </div>
  )
}

export default DesktopNavbar
