import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { Skeleton } from '../ui/skeleton'

type Props = {
  children: ReactNode
  isLoading: boolean
  fullWidth?: boolean
}

const SkeletonWrapper = ({ children, isLoading, fullWidth = true }: Props) => {
  if (!isLoading) return <>{children}</>

  return (
    <Skeleton className={cn(fullWidth && 'w-full')}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  )
}

export default SkeletonWrapper
