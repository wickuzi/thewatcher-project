"use server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { headers } from "next/headers";
import rateLimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import { sendWelcomeEmail } from "@/lib/email";

export const signInWithCredentials = async (params: Pick<AuthCredentials, 'email' | 'password'>) => {
    const { email, password } = params;

    const ip=(await headers()).get('x-forwarded-for')||"127.0.0.1";
    const { success } = await rateLimit.limit(ip);

    if(!success) return redirect("/too-fast");
    
    if (!email || !password) {
        return { success: false, error: 'Por favor ingresa tu correo y contraseña' };
    }

    try {
        const result = await signIn("credentials", {
            redirect: false,
            email: email.trim(),
            password: password.trim(),
        });

        if (!result) {
            return { 
                success: false, 
                error: 'No se pudo procesar la solicitud de inicio de sesión' 
            };
        }

        if (result.error) {
            let errorMessage = 'Credenciales inválidas';
            
            if (result.error.includes('CredentialsSignin') || result.error.includes('Error')) {
                const userExists = await db.select()
                    .from(users)
                    .where(eq(users.email, email.trim()))
                    .limit(1);
                
                errorMessage = userExists.length > 0 
                    ? 'Contraseña incorrecta' 
                    : 'No existe una cuenta con este correo';
            }
            
            return { 
                success: false, 
                error: errorMessage,
                details: result.error
            };
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error al iniciar sesión:", error);
        
        if (error.message?.includes('CredentialsSignin')) {
            return { 
                success: false, 
                error: 'Correo o contraseña incorrectos',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
        }
        
        return { 
            success: false, 
            error: 'Algo ha salido mal, por favor revisa tus credenciales.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        };
    }
}
export const signUp = async (params: AuthCredentials) => {
    const { fullName, email, password } = params;

    if (!email || !password || !fullName) {
        return { success: false, error: 'Por favor completa todos los campos' };
    }

    if (password.length < 6) {
        return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }

    const ip = (await headers()).get('x-forwarded-for') || "127.0.0.1";
    const { success } = await rateLimit.limit(ip);

    if (!success) return redirect("/too-fast");
    
    try {
        // Check if user already exists
        const existingUser = await db.select()
            .from(users)
            .where(eq(users.email, email.trim()))
            .limit(1);

        if (existingUser.length > 0) {
            return { 
                success: false, 
                error: 'Ya existe una cuenta con este correo electrónico' 
            };
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create the user
        await db.insert(users).values({
            fullName: fullName.trim(),
            email: email.trim(),
            password: hashedPassword
        });

        // Send welcome email
        const emailParams = {
            username: fullName.trim(),  // Changed from to_name to username
            to_email: email.trim(),
            message: '¡Bienvenido a nuestra plataforma! Gracias por registrarte.',
            subject: '¡Bienvenido a TheWatcher!'
        };
        
        console.log('Sending welcome email with params:', JSON.stringify(emailParams, null, 2));
        const emailResponse = await sendWelcomeEmail(emailParams);

        if (!emailResponse.success) {
            console.error('Error al enviar correo de bienvenida:', emailResponse.error);
            // Continue with sign in even if email fails
        }

        // Sign in the user
        const signInResult = await signInWithCredentials({email, password});
        if (!signInResult.success) {
            return { 
                success: false, 
                error: 'Cuenta creada, pero no se pudo iniciar sesión automáticamente. Por favor inicia sesión manualmente.' 
            };
        }

        return { success: true };
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        return {
            success: false, 
            error: 'Algo ha salido mal, por favor intenta de nuevo.'
        };
    }
}

export async function signOutAction() {
    try {
        await signOut({ redirect: false });
        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error);
        return { success: false, error: 'Failed to sign out' };
    }
}
