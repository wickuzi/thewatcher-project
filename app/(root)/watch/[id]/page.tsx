import { db } from '@/database/drizzle'
import { watchs } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import WatchOverview from '@/components/WatchOverview'
import WatchVideo from '@/components/WatchVideo'
import { cleanUrl } from '@/lib/utils/url'

interface PageProps {
  params: {
    id: string
  }
}

const Page = async ({ params }: PageProps) => {
  try {
    console.log('🔍 Buscando reloj con ID:', params.id)
    
    // No need to convert to number, use the string ID directly
    const watchId = params.id

    // Buscar el reloj
    const [watchDetails] = await db
      .select()
      .from(watchs)
      .where(eq(watchs.id, watchId))
      .limit(1)

    if (!watchDetails) {
      console.log('❌ No se encontró el reloj')
      return notFound()
    }

    // Limpiar las URLs de la base de datos
    const cleanedWatchDetails = {
      ...watchDetails,
      imageUrl: cleanUrl(watchDetails.imageUrl),
      videoUrl: cleanUrl(watchDetails.videoUrl)
    };

    console.log('✅ Reloj encontrado:', cleanedWatchDetails)
    return <>
   
    <WatchOverview 
      id={cleanedWatchDetails.id}
      name={cleanedWatchDetails.name}
      brand={cleanedWatchDetails.brand}
      category={cleanedWatchDetails.category}
      rating={cleanedWatchDetails.rating}
      price={cleanedWatchDetails.price}
      availableStock={cleanedWatchDetails.availableStock}
      description={cleanedWatchDetails.description}
      imageUrl={cleanedWatchDetails.imageUrl}
      videoUrl={cleanedWatchDetails.videoUrl}
      summary={cleanedWatchDetails.summary}
      cost={cleanedWatchDetails.cost}
      showWishlistButton={true}
    />
    
    <div className='w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Fila de Video + Resumen */}
      <div className="flex flex-col lg:flex-row gap-8 mb-16">
        {/* Video - Ocupa 2/3 del ancho en pantallas grandes */}
        <div className="lg:flex-[2] w-full">
          <h3 className="text-3xl font-semibold text-light-200 mb-6 ml-2">Video</h3>
          <div className="w-full">
            <div className="max-w-4xl mx-auto">
              <WatchVideo 
                videoUrl={cleanedWatchDetails.videoUrl} 
                watchId={cleanedWatchDetails.id} 
              />
            </div>
          </div>
        </div>
        
        {/* Resumen - Ocupa más espacio */}
        <div className="lg:w-[50%] xl:w-[45%] 2xl:w-[40%] lg:pt-16 pr-0 lg:pr-8">
          <h3 className="text-3xl font-semibold text-light-200 mb-4">Resumen</h3>
          <div className='space-y-6 text-light-100 text-xl lg:text-xl leading-relaxed max-w-[700px] text-justify'>
            {cleanedWatchDetails.summary.split('\n').map((line, index) => 
              <p key={index}>{line}</p>
            )}
          </div>
        </div>
      </div>
      
     
    </div>
    </>
  } catch (error) {
    console.error('❌ Error al buscar el reloj:', error)
    return notFound()
  }
}

export default Page