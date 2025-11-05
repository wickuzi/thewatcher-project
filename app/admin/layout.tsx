import { auth } from '@/auth'
import React from 'react'
import { redirect } from 'next/navigation'
import '@/styles/admin.css'
import Sidebar from '@/components/admin/Sidebar'
import Header from '@/components/admin/Header'
import { users } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { db } from "@/database/drizzle";

const layout = async ({children}: {children: React.ReactNode}) => {
    const session = await auth();
    if(!session?.user?.id){
        return redirect('/sign-in');
    }
    const isAdmin = await db.select({isAdmin : users.role}).from(users).where(eq(users.id,session.user.id)).limit(1).then((res)=>res[0]?.isAdmin==="ADMIN");
    if(!isAdmin){
        return redirect('/');
    }

    return (
    <main className='flex min-h-screen w-full overflow-x-hidden'>
        <div className='flex-shrink-0'>
            <Sidebar session={session}/>
        </div>
        <div className='flex-1 min-w-0'>
            <div className='admin-container w-full max-w-full overflow-x-auto'>
                <Header session={session}/>
                {
                    children
                }
            </div>
        </div>
    </main>
  )
}

export default layout