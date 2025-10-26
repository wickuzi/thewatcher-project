import React from 'react'
import { ReactNode } from 'react'
import Image from "next/image"
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AuthLayout = async ({children}: {children: ReactNode}) => {
  const session = await auth();
  if(session) redirect("/");
  return <main className='auth-container'>
    <section className='auth-form'>
        <div className='auth-box'>
            <div className='flex flex-row justify-center'>
                    <Image src="/images/thewatcher_logo.png" alt="TheWatcher Logo" width={130} height={130}/>
            </div>
            <div>{children}</div>
        </div>
    </section>

    <section className='auth-illustration'>
        <Image src="/images/photo.png" alt='photoAuth' width={1000} height={1000} className='size-full object-cover'/>
    </section>
  </main>
}

export default AuthLayout