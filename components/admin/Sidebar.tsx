"use client"

import React from 'react'
import Image from 'next/image'
import { adminSideBarLinks } from '@/app/constants'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { getInitials } from '@/lib/utils'
import { Session } from 'next-auth'

const Sidebar = ({session}: {session: Session}) => {
    const pathname = usePathname();
    
  return (
    <div className="flex h-full w-16 flex-col sm:w-auto">
      <div className="flex justify-center px-0 py-3 sm:px-2 sm:justify-start">
        <div className="relative h-20 w-20 sm:h-20 sm:w-40 md:h-28 md:w-48">
          <Image 
            src="/images/thewatcher_logo2.png" 
            alt="Logo" 
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      </div>

      <nav className="flex-1 px-1 py-0">
        {adminSideBarLinks.map((link) => {
          const isSelected = (link.route !== '/admin' && pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
          
          return (
            <Link 
              href={link.route} 
              key={link.route}
              className={cn(
                "group mx-0 my-0.5 flex h-10 w-full items-center justify-start rounded-lg text-sm transition-colors",
                "sm:my-0.5 sm:h-11",
                isSelected 
                  ? "text-primary-admin" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <div className='relative h-7 w-7 flex items-center justify-center rounded-lg sm:h-9 sm:w-9'>
                <div className={`absolute inset-0 rounded-lg transition-all ${isSelected ? 'bg-primary-admin' : 'group-hover:bg-gray-100'}`}></div>
                <div className='relative h-4 w-4 sm:h-6 sm:w-6 z-10'>
                  <Image 
                    src={link.img} 
                    alt={link.text} 
                    fill 
                    className={`${isSelected ? 'brightness-0 invert' : ''} object-contain`} 
                  />
                </div>
              </div>
              <span className='ml-0 text-sm font-medium hidden sm:ml-2 sm:inline'>{link.text}</span>
            </Link>
          );
        })}
      </nav>

      <div className='border-t border-gray-200 p-2 mt-auto'>
        <div className='flex items-center justify-center gap-3 p-1 sm:justify-start sm:p-2'>
          <Avatar className='h-7 w-7 sm:h-10 sm:w-10'>
            <AvatarFallback className='bg-amber-200 text-black rounded-full flex items-center justify-center text-sm sm:text-base'>
              {getInitials(session?.user?.name || "IN")}
            </AvatarFallback>
          </Avatar>
          <div className='hidden sm:flex sm:flex-col'>
            <p className='text-sm font-semibold text-dark-200'>{session?.user?.name}</p>
            <p className='text-xs text-light-500'>{session?.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar