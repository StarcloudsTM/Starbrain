'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Home, ShoppingBag, Settings, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transition-transform duration-300 ease-in-out lg:static lg:block`}>
        <div className="flex items-center h-16 px-6 border-b">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-2xl font-semibold text-primary">Starbrains</span>
          </Link>
        </div>
        <nav className="mt-6">
          <Link href="/dashboard" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
            <Home className="h-5 w-5 mr-3" />
            <span>Home</span>
          </Link>
          <Link href="/dashboard/upgrade" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
            <ShoppingBag className="h-5 w-5 mr-3" />
            <span>Upgrade</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
            <Settings className="h-5 w-5 mr-3" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </>
  )
}