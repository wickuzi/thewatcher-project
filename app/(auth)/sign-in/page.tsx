"use client";

import React from "react";
import { AuthForm } from "@/components/AuthForm";
import { signInSchema } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/actions/auth";

// Define the type for your form values
type FormValues = {
  email: string;
  password: string;
};

const Page = () => (
  <AuthForm<FormValues>
    type="SIGN_IN"
    schema={signInSchema}
    defaultValues={{
      email: "",
      password: "",
    }}
    onSubmit={signInWithCredentials}
    fields={[
      { 
        name: "email", 
        label: "Correo Electrónico",
        type: "email",
        placeholder: "Ingresa tu correo electrónico"
      },
      { 
        name: "password", 
        label: "Contraseña",
        type: "password",
        placeholder: "Ingresa tu contraseña"
      },
    ]}
  />
);

export default Page;