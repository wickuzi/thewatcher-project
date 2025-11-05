'use server'

import { db } from "@/database/drizzle";
import { eq } from 'drizzle-orm';
import { watchs } from "@/database/schema";
import { WatchParams } from "@/types";
import { logActivity } from "@/lib/activityLogger";
import { auth } from "@/auth";

export const createWatch = async(params: WatchParams)=>{
    const session = await auth();
    
    try{
        const [newWatch] = await db.insert(watchs).values({
            ...params,
            availableStock: params.availableStock,
        }).returning();

        // Registrar la actividad
        if (session?.user?.id) {
            await logActivity('watch_added', {
                userId: session.user.id,
                watchId: newWatch.id,
                details: {
                    name: newWatch.name,
                    brand: newWatch.brand,
                    price: newWatch.price,
                    stock: newWatch.availableStock
                }
            });
        }

        return{
            success:true,
            message:'Reloj creado correctamente',
            data: JSON.parse(JSON.stringify(newWatch))
        }

    }catch(error){
        console.log(error);

        return{
            success:false,
            message:'Ha ocurrido un error'
        }
    }
}

export const updateWatch = async (id: string, data: Partial<WatchParams>) => {
    const session = await auth();
    
    try {
        // Obtener el estado actual del reloj antes de la actualización
        const [currentWatch] = await db
            .select()
            .from(watchs)
            .where(eq(watchs.id, id))
            .limit(1);

        if (!currentWatch) {
            throw new Error('Reloj no encontrado');
        }

        const [updatedWatch] = await db
            .update(watchs)
            .set({
                ...data,
                // No incluimos updatedAt ya que no está definido en el esquema
            })
            .where(eq(watchs.id, id))
            .returning();

        // Registrar la actividad de actualización
        if (session?.user?.id) {
            const changes: Record<string, { old: any; new: any }> = {};
            
            // Detectar cambios en los campos relevantes
            if (data.name && data.name !== currentWatch.name) {
                changes.name = { old: currentWatch.name, new: data.name };
            }
            if (data.availableStock !== undefined && data.availableStock !== currentWatch.availableStock) {
                changes.stock = { old: currentWatch.availableStock, new: data.availableStock };
            }
            if (data.price !== undefined && data.price !== currentWatch.price) {
                changes.price = { old: currentWatch.price, new: data.price };
            }

            if (Object.keys(changes).length > 0) {
                await logActivity('watch_updated', {
                    userId: session.user.id,
                    watchId: id,
                    details: {
                        changes,
                        watchName: updatedWatch.name
                    }
                });
            }
        }

        return {
            success: true,
            message: 'Reloj actualizado correctamente',
            data: JSON.parse(JSON.stringify(updatedWatch))
        };
    } catch (error) {
        console.error('Error updating watch:', error);
        return {
            success: false,
            message: 'Error al actualizar el reloj',
            error: error instanceof Error ? error.message : 'Error desconocido'
        };
    }
};