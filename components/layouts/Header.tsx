import { SignedIn, UserButton } from '@clerk/nextjs'
import React from 'react'

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100 top-0 z-50">
      <div>
        <p>Header</p>
      </div>
      <div>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  )
}

export default Header
