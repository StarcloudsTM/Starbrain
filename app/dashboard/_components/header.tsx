'use client'

import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-background border-b">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800"></h1>
      <div className="flex items-center space-x-4">
        
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}