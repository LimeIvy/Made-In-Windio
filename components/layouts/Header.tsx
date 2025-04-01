import { SignedIn, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <header className="border-b bg-yellow-400">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/home" className="text-2xl font-bold text-primary text-black">Made In Windio</Link>
            </div>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>
  )
}

export default Header
