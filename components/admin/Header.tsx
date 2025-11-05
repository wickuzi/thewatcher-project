import React from 'react'
import { Session } from 'next-auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Header = ({session}: {session: Session}) => {
  return <header className='admin-header'>
    <div>
        <h2 className='text-2xl font-semibold text-dark-400'>
            {session?.user?.name}
        </h2>
        <p className='text-slate-500 text-base'>Administra todos tus usuarios y relojes aqui</p>
    </div>
    <Button asChild className='bg-primary-admin text-light-100'>
      <Link href="/">Volver</Link>
    </Button>
  </header>
}

export default Header