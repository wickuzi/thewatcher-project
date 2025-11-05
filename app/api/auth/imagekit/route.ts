// app/api/imagekit/auth/route.ts
import { NextResponse } from 'next/server'
import ImageKit from 'imagekit'

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ''
})

export async function GET() {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters()
    return NextResponse.json(authenticationParameters)
  } catch (error) {
    console.error('Error en la autenticación de ImageKit:', error)
    return NextResponse.json(
      { error: 'Error al autenticar con ImageKit' },
      { status: 500 }
    )
  }
}