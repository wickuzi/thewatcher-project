"use client";
import AuthForm from "@/components/AuthForm";
import { signUpSchema, SignUpFormData } from "@/app/constants/validation";
import { signUp } from "@/lib/actions/auth";

const Page = () => {
  const fields = [
    {
      name: "fullName" as const,
      label: "Nombre Completo",
      type: "text" as const,
      placeholder: "Ingrese su nombre completo"
    },
    {
      name: "email" as const,
      label: "Correo Electronico",
      type: "email" as const,
      placeholder: "Ingrese su correo electronico"
    },
    {
      name: "password" as const,
      label: "Contraseña",
      type: "password" as const,
      placeholder: "Ingrese su contraseña"
    }
  ];

  return (
 
        <AuthForm<SignUpFormData>
          type="SIGN_UP"
          schema={signUpSchema}
          defaultValues={{ fullName: "", email: "", password: "" }}
          fields={fields}
          onSubmit={signUp}
        />
  
  );
};

export default Page;
