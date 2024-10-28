'use client'

import { useState } from 'react'
import { NavbarProps } from '@/types'
import { UserButton } from '@clerk/nextjs'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Logo from '@/components/common/Logo'
import ThemeSwitcher from '@/components/common/ThemeSwitcher'

import NavbarItem from './NavbarItem'

const MobileNavbar = ({ items }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="block border-separate bg-background md:hidden">
      <div className="flex items-center justify-between px-6">
        <div className="flex h-20 min-h-14 items-center gap-x-4">
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <UserButton />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant={'ghost'} size={'icon'}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side={'right'} className="w-[400px] sm:w-[540px]">
              <DialogTitle className="text-2xl font-bold">
                <Logo className="m-3" />
              </DialogTitle>
              {items.map((item, index) => (
                <NavbarItem key={index} name={item.name} link={item.link} />
              ))}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

export default MobileNavbar
