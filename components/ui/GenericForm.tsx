"use client";

import { useForm, DefaultValues, FieldValues, Path, FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "./FileUpload";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export interface FormFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'color' | 'file' | 'email' | 'password';
  placeholder?: string;
  fileType?: 'image' | 'video';
  accept?: string;
  folder?: string;
  variant?: 'light' | 'dark';
  step?: string;
  min?: number | string;
  max?: number | string;
  className?: string;
}

export interface GenericFormProps<T extends FieldValues> {
  defaultValues: T;
  schema: ZodType<T>;
  fields: FormFieldConfig<T>[];
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  submitButtonText: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  className?: string;
}

export function GenericForm<T extends FieldValues>({
  defaultValues,
  schema,
  fields,
  onSubmit,
  submitButtonText,
  cancelButtonText = 'Cancelar',
  onCancel,
  className = '',
}: GenericFormProps<T>) {
  const router = useRouter();
  const form = useForm<T>({
    // @ts-ignore - Workaround for zodResolver type issues
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit = async (data: T) => {
    try {
      const result = await onSubmit(data);
      if (result?.success) {
        toast({
          title: "¡Éxito!",
          description: "Los cambios se guardaron correctamente",
        });
        router.refresh();
      } else {
        throw new Error(result?.error || "Ocurrió un error al guardar");
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <FormField
              key={field.name as string}
              control={form.control}
              name={field.name as Path<T>}
              render={({ field: formField }: { field: any }) => (
                <FormItem 
                  className={`${field.type === 'textarea' || field.className?.includes('col-span-2') ? 'md:col-span-2' : ''} ${field.className || ''}`}
                >
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    {field.type === 'textarea' ? (
                      <Textarea
                        placeholder={field.placeholder}
                        className="min-h-[100px]"
                        {...formField}
                      />
                    ) : field.type === 'file' && field.fileType ? (
                      <FileUpload
                        type={field.fileType}
                        accept={field.accept || (field.fileType === 'image' ? 'image/*' : 'video/*')}
                        placeholder={field.placeholder || ''}
                        folder={field.folder || ''}
                        variant={field.variant || 'light'}
                        onFileChange={(value) => form.setValue(field.name as Path<T>, value as any, { shouldValidate: true })}
                        value={formField.value as string}
                      />
                    ) : field.type === 'color' ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          className="w-16 h-10 p-1"
                          {...formField}
                        />
                        <Input 
                          type="text" 
                          value={formField.value as string} 
                          onChange={(e) => formField.onChange(e.target.value)}
                        />
                      </div>
                    ) : (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        step={field.step}
                        min={field.min?.toString()}
                        max={field.max?.toString()}
                        {...formField}
                        onChange={(e) => {
                          if (field.type === 'number') {
                            formField.onChange(e.target.value === '' ? '' : Number(e.target.value));
                          } else {
                            formField.onChange(e);
                          }
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={form.formState.isSubmitting}
            >
              {cancelButtonText}
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="min-w-[120px]"
          >
            {form.formState.isSubmitting ? 'Guardando...' : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default GenericForm;
