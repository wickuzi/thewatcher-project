'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Watch } from '@/types';
import WatchForm from './forms/WatchForm';
import { updateWatch } from '@/lib/admin/actions/Watch';
import { toast } from '@/hooks/use-toast';

interface EditWatchModalProps {
  watch: Watch | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; // Callback to refresh the watches list
}

export function EditWatchModal({ watch, isOpen, onClose, onSave }: EditWatchModalProps) {
  if (!watch) return null;

  const handleSave = async (values: Partial<Watch>) => {
    try {
      const result = await updateWatch(watch.id, values);
      
      if (result.success) {
        toast({
          title: 'Éxito',
          description: 'Reloj actualizado correctamente',
        });
        onSave(); // Refresh the watches list
        onClose();
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Error al actualizar el reloj',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating watch:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al actualizar el reloj',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Reloj: {watch.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <WatchForm 
            type="update"
            initialValues={{
              name: watch.name,
              brand: watch.brand,
              price: watch.price,
              cost: watch.cost || 0,
              category: watch.category,
              availableStock: watch.availableStock,
              description: watch.description,
              imageUrl: watch.imageUrl,
              summary: watch.summary,
              videoUrl: watch.videoUrl,
              rating: watch.rating
            }}
            onSubmit={handleSave}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
