import { db } from '@/database/drizzle';
import { watchs } from '@/database/schema';
import { desc, ilike, or } from 'drizzle-orm';
import WatchCard from '@/components/WatchCard';
import { Suspense } from 'react';
import CatalogSearch from '@/components/catalog/CatalogSearch';

interface DatabaseWatch {
  id: string;
  name: string;
  brand: string;
  category: string;
  rating: number;
  price: number;
  availableStock: number;
  description: string;
  imageUrl: string;
  videoUrl: string | null;
  summary: string | null;
  createdAt: Date | null;
  cost: number;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const searchQuery = searchParams?.q?.toString() || '';

  // Obtener y filtrar relojes según la búsqueda
  let query = db.select().from(watchs);

  if (searchQuery) {
    const searchTerm = `%${searchQuery}%`;
    query = query.where(
      or(
        ilike(watchs.name, searchTerm),
        ilike(watchs.brand, searchTerm),
        ilike(watchs.category, searchTerm)
      )
    ) as any;
  }

  const allWatches: DatabaseWatch[] = await query.orderBy(desc(watchs.createdAt));

  // Función para formatear el reloj al tipo esperado por WatchCard
  const formatWatch = (watch: DatabaseWatch) => ({
    ...watch,
    videoUrl: watch.videoUrl || '',
    summary: watch.summary || watch.description,
    // Asegurarse de que createdAt sea un string o undefined
    createdAt: watch.createdAt ? watch.createdAt.toISOString() : undefined
  });

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bebas-neue text-light-100 mb-4 text-center">Catálogo de Relojes</h1>
      <CatalogSearch />
      
      {searchQuery && (
        <p className="text-light-200 mb-6 text-center">
          {allWatches.length > 0 
            ? `Mostrando ${allWatches.length} resultado${allWatches.length > 1 ? 's' : ''} para "${searchQuery}"`
            : `No se encontraron resultados para "${searchQuery}"`
          }
        </p>
      )}
      {allWatches.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {allWatches.map((watch) => (
            <WatchCard 
              key={watch.id} 
              {...formatWatch(watch)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-light-200 text-lg">No se encontraron relojes en el catálogo.</p>
        </div>
      )}
    </main>
  );
}
