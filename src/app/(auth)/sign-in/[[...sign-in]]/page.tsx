import Link from 'next/link'
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            footer: {
              display: 'none',
            },
            form: {
              paddingBottom: '2rem',
            },
          },
        }}
      />
      <p className="absolute z-10 mt-80 text-center text-sm">
        Don’t have an account?{' '}
        <Link className="text-gray-500 hover:text-gray-600" href={'sign-up'}>
          Sign up
        </Link>
      </p>
    </div>
  )
}
