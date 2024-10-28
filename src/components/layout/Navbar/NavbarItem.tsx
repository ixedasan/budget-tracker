'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavbarItem } from '@/types'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const NavbarItem = ({ name, link, handleClick }: NavbarItem) => {
  const pathName = usePathname()
  const isActive = pathName === link
  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'w-full justify-start text-lg text-muted-foreground hover:text-foreground',
          isActive && 'text-foreground',
        )}
        onClick={() => handleClick && handleClick()}
      >
        {name}
      </Link>
    </div>
  )
}

export default NavbarItem
