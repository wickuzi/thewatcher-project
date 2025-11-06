"use client";

import { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Watch } from "@/types";
import { formatCurrency } from "@/lib/currency";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { watchSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/FileUpload";
import { toast } from "@/hooks/use-toast";
import { createWatch } from "@/lib/admin/actions/Watch";

// Explicitly type the form values to match the schema
export type WatchFormValues = {
  name: string;
  brand: string;
  price: number;
  cost: number;
  category: string;
  rating: number;
  availableStock: number;
  description: string;
  imageUrl: string;
  summary: string;
  videoUrl: string;
};

interface Props extends Partial<Watch> {
  type?: "create" | "update";
  initialValues?: Partial<Watch>;
  onSubmit?: (values: Partial<Watch>) => void;
  onCancel?: () => void;
}

const WatchForm = ({ type, initialValues, onSubmit, onCancel }: Props) => {
  const router = useRouter();
  const [videoSource, setVideoSource] = useState<'upload' | 'youtube'>('upload');
  
  // Set default values based on initialValues prop
  // Mostrar valores enteros de córdobas
  const defaultValues = {
    name: initialValues?.name || "",
    brand: initialValues?.brand || "",
    price: initialValues?.price || 0,
    cost: initialValues?.cost || 0,
    category: initialValues?.category || "",
    rating: initialValues?.rating || 1,
    availableStock: initialValues?.availableStock || 1,
    description: initialValues?.description || "",
    imageUrl: initialValues?.imageUrl || "",
    summary: initialValues?.summary || "",
    videoUrl: initialValues?.videoUrl || "",
  };

  const form = useForm<WatchFormValues>({
    resolver: zodResolver(watchSchema) as any,
    defaultValues,
  });

  // Reset the form when initialValues changes
  useEffect(() => {
    form.reset(defaultValues);
  }, [initialValues]);

  const handleSubmit = async (values: WatchFormValues) => {
    if (onSubmit) {
      // If onSubmit prop is provided, use that
      return onSubmit({
        ...values,
        price: Number(values.price),
        rating: Number(values.rating),
        availableStock: Number(values.availableStock),
      });
    }

    try {
      // Asegurarse de que los valores sean números enteros
      const payload = {
        ...values,
        price: Math.round(Number(values.price)), // Guardar como número entero de córdobas
        cost: Math.round(Number(values.cost)),   // Guardar como número entero de córdobas
        rating: Number(values.rating),
        availableStock: Number(values.availableStock),
      };

      let result;
      
      if (type === 'update' && initialValues?.id) {
        // Update existing watch
        result = await fetch(`/api/admin/watches/${initialValues.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }).then(res => res.json());
      } else {
        // Create new watch
        result = await createWatch(payload);
      }
      
      if (result.success) {
        toast({
          title: type === 'update' ? 'Actualización exitosa' : 'Reloj agregado exitosamente',
          description: type === 'update' 
            ? 'El reloj se ha actualizado correctamente' 
            : 'El reloj se ha creado correctamente',
        });
        router.push(`/admin/watches`);
        router.refresh(); // Refresh the page to show updated data
      } else {
        throw new Error(result.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={"name"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Nombre  
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Hugo Boss Grand Prix"
                  {...field}
                  className="watch-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"brand"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Marca
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Fossil, Casio"
                  {...field}
                  className="watch-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"category"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Categoria
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Casual, Elegante..."
                  {...field}
                  className="watch-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"rating"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Puntaje
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  placeholder="Puntaje (1-5)"
                  {...field}
                  className="watch-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Precio de Venta (C$)
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">C$</span>
                  <Input
                    type="number"
                    required
                    placeholder="0"
                    min="0"
                    step="1"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      field.onChange(Math.max(0, value)); // Asegurar que no sea negativo
                    }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      field.onChange(Math.max(0, value)); // Asegurar que no sea negativo
                    }}
                    className="watch-form_input pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Costo (C$)
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">C$</span>
                  <Input
                    type="number"
                    required
                    placeholder="0"
                    min="0"
                    step="1"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      field.onChange(Math.max(0, value)); // Asegurar que no sea negativo
                    }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      field.onChange(Math.max(0, value)); // Asegurar que no sea negativo
                    }}
                    className="watch-form_input pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"availableStock"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Stock Disponible
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="1"
                  {...field}
                  className="watch-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"imageUrl"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Imagen sobre el reloj
              </FormLabel>
              <FormControl>
                <FileUpload
                  type="image"
                  accept="image/*"
                  placeholder="Sube una imagen"
                  folder="watches"
                  variant="light"
                  onFileChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        

        <div className="col-span-2">
          <FormField
            control={form.control}
            name={"videoUrl"}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-base font-normal text-dark-500">
                  Video sobre el reloj
                </FormLabel>
                
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md ${videoSource === 'upload' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    onClick={() => setVideoSource('upload')}
                  >
                    Subir video
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md ${videoSource === 'youtube' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setVideoSource('youtube')}
                  >
                    Usar YouTube
                  </button>
                </div>

                <FormControl>
                  {videoSource === 'upload' ? (
                    <FileUpload
                      type="video"
                      accept="video/*"
                      placeholder="Sube un video"
                      folder="watches/videos"
                      variant="light"
                      onFileChange={field.onChange}
                      value={field.value}
                    />
                  ) : (
                    <div className="space-y-2">
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        {...field}
                        className="watch-form_input"
                        onChange={(e) => {
                          // Si es una URL de YouTube, la guardamos directamente
                          if (e.target.value.includes('youtube.com') || e.target.value.includes('youtu.be')) {
                            field.onChange(e.target.value);
                          } else if (e.target.value === '') {
                            field.onChange('');
                          }
                        }}
                      />
                      <p className="text-sm text-gray-500">
                        Pega la URL completa del video de YouTube (ej: https://www.youtube.com/watch?v=...)
                      </p>
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Descripción sobre el reloj
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción detallada del reloj"
                  {...field}
                  rows={1}
                  className="watch-form_input min-h-[40px] py-1 text-sm"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"summary"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Resumen
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Resumen breve del reloj"
                  {...field}
                  rows={1}
                  className="watch-form_input min-h-[36px] py-1 text-sm"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 col-span-2 justify-end">
          <Button 
            type="button" 
            variant="default"
            onClick={handleCancel}
            className="watch-form_btn text-white"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="default"
            className="watch-form_btn text-white"
          >
            {type === 'update' ? 'Actualizar Reloj' : 'Agregar Reloj'}
          </Button>
        </div>
        </div>
      </form>
    </Form>
  );
};

export default WatchForm;