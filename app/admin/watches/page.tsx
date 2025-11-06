"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Pencil, ShoppingCart } from 'lucide-react';
import { EditWatchModal } from '@/components/admin/EditWatchModal';
import { toast } from 'sonner';

interface Watch {
  id: string;
  name: string;
  brand: string;
  price: number;
  cost: number;
  availableStock: number;
  category: string;
  rating: number;
  description: string;
  imageUrl: string;
  summary: string;
  videoUrl: string;
  createdAt?: string;
};

export default function WatchesPage() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch watches on component mount
  useEffect(() => {
    const fetchWatches = async () => {
      try {
        const response = await fetch('/api/admin/watches');
        const data = await response.json();
        if (response.ok) {
          setWatches(data);
        } else {
          console.error('Error fetching watches:', data.message);
        }
      } catch (error) {
        console.error('Error fetching watches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatches();
  }, []);

  const handleEditClick = (watch: Watch) => {
    setSelectedWatch(watch);
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/watches');
      const data = await response.json();
      if (response.ok) {
        setWatches(data);
      } else {
        console.error('Error fetching watches:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSellWatch = async (watchId: string) => {
    try {
      const response = await fetch('/api/admin/watches', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: watchId }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Venta registrada exitosamente');
        // Actualizar la lista de relojes
        handleSave();
      } else {
        toast.error(result.message || 'Error al registrar la venta');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al conectar con el servidor');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <section className='w-full rounded-2xl bg-white p-7'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <h2 className='text-xl font-semibold'>Relojes</h2>
          <Button className="bg-primary-admin text-white" asChild>
            <Link href="/admin/watches/new">+ Agregar un nuevo reloj</Link>
          </Button>
        </div>

        <div className='mt-7 w-full overflow-hidden rounded-lg border'>
          <div className='w-full overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Nombre
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Marca
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Precio
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Stock
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Acciones
                  </th>
                </tr>
              </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {watches.length > 0 ? (
                watches.map((watch) => (
                  <tr key={watch.id} className='hover:bg-gray-50'>
                    <td className='whitespace-nowrap px-6 py-4'>{watch.name}</td>
                    <td className='whitespace-nowrap px-6 py-4'>{watch.brand}</td>
                    <td className='whitespace-nowrap px-6 py-4'>C$ {watch.price.toLocaleString('es-NI')}</td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <span className={`min-w-[20px] text-center ${
                          watch.availableStock === 0 ? 'text-red-500 font-medium' : ''
                        }`}>
                          {watch.availableStock}
                        </span>
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSellWatch(watch.id);
                          }}
                          disabled={watch.availableStock <= 0}
                          className={`p-1.5 rounded-md flex items-center gap-1 text-sm ${
                            watch.availableStock > 0
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          title={watch.availableStock > 0 ? 'Marcar como vendido' : 'Sin stock disponible'}
                        >
                          <ShoppingCart className='w-4 h-4' />
                          <span>Vender</span>
                        </button>
                        <button
                          onClick={() => handleEditClick(watch)}
                          className='p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-primary-admin transition-colors'
                          title='Editar reloj'
                        >
                          <Pencil className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='px-6 py-4 text-center text-sm text-gray-500'>
                    No hay relojes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    {selectedWatch && (
      <EditWatchModal
        watch={selectedWatch}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedWatch(null);
        }}
        onSave={handleSave}
      />
    )}
  </>
  );
}