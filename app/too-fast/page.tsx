import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = () => {
  return <main className='root-container flex min-h-screen flex-col items-center justify-center'>
    <h1 className='text-4xl font-bebas-neue text-light-100 mb-4'>Wooow, mas despacio velocista</h1>
    <p className='nt-3 max-w-xl text-center text-light-100 mb-4'>Parece que te has emocionado un poco, hemos puesto una pequeña pausa a tu emoción. 
        Relajate e intentalo de nuevo en unos segundos.
    </p>
    <Button className='mt-4' asChild><Link href='/'>Volver</Link></Button>
  </main>
}

export default page