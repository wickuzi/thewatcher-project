import { useState } from "react";
import { useForm, SubmitHandler, DefaultValues, FieldValues, FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Path } from "react-hook-form"
import { ZodType } from "zod"
import { Input } from "@/components/ui/input"

interface FormFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
}

interface Props<T extends FieldValues> {
  type: "SIGN_IN" | "SIGN_UP";
  schema: ZodType<T>;
  defaultValues: T;
  fields: FormFieldConfig<T>[];
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
}
function AuthForm<T extends FieldValues>({
  type,
  schema,
  defaultValues,
  fields = [],
  onSubmit,
}: Props<T>) {
  const router = useRouter();
  const form = useForm<T>({
    // @ts-ignore - The type definitions are complex, but this works at runtime
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: SubmitHandler<T> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await onSubmit(data);
      if (result?.success) {
        toast.success(type === 'SIGN_IN' ? "¡Bienvenido a TheWatcher!" : "¡Cuenta creada exitosamente!");
        router.push("/");
      } else {
        // Mostrar mensaje de error específico si está disponible
        // Si llegamos aquí, hubo un error en la autenticación
        const errorMessage = result?.error?.includes('CredentialsSignin') 
          ? 'Credenciales inválidas. Por favor, verifica tus datos.'
          : result?.error || 
            (type === 'SIGN_IN' 
              ? 'Error al iniciar sesión. Por favor, verifica tus datos.' 
              : 'Error al crear la cuenta. Por favor, inténtalo de nuevo.');
        
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
    
    // Manejar diferentes tipos de errores
    let errorMessage = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
    
    if (error?.message) {
      // Si ya es un mensaje amigable, mostrarlo tal cual
      if (error.message.includes('Cuenta no encontrada') || 
          error.message.includes('Contraseña incorrecta') ||
          error.message.includes('ingresa tu correo y contraseña')) {
        errorMessage = error.message;
      } else if (error.message.includes('CredentialsSignin')) {
        errorMessage = 'Credenciales inválidas. Por favor, verifica tus datos.';
      }
    }
    
    toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold text-white text-center">
        {type === 'SIGN_IN' ? "Bienvenido de nuevo a TheWatcher" : "Crea tu cuenta"}
      </h1>
      <p className="text-light-100 text-center">
        {type === 'SIGN_IN' ? "Sigue explorando nuestro catalogo" : "Porfavor llena los campos para acceder a TheWatcher"}
      </p>
      <Form {...form}>
      <form 
        // @ts-ignore - The type definitions are complex, but this works at runtime
        onSubmit={form.handleSubmit(handleSubmit)} 
        className="space-y-3"
      > 
        {fields.map((field) => (
          <FormField
            key={field.name as string}
            // @ts-ignore - The type definitions are complex, but this works at runtime
            control={form.control}
            name={field.name as FieldPath<T>}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input className="form-input"
                    type={field.type || 'text'}
                    placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" className="form-btn">
          {type === 'SIGN_IN' ? 'Inicia sesión' : 'Crea una cuenta'}
        </Button>
      </form>
    </Form>
    <p className="text-center text-base font-medium">
      {type === 'SIGN_IN' ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
    </p>

    <Link href={type === 'SIGN_IN' ? '/sign-up' : '/sign-in'} className="font-bold text-primary text-center">
      {type === 'SIGN_IN' ? 'Crea una cuenta' : 'Inicia sesión'}
    </Link>
    </div>
    
  );

};

// Export as both named and default for backward compatibility
export { AuthForm };
export default AuthForm;
