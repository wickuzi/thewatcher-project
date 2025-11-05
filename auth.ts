import NextAuth, { User, type NextAuthConfig } from "next-auth";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const authConfig: NextAuthConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Por favor ingresa tu correo y contraseña");
          }
        
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email.toString()))
            .limit(1);
        
          if (user.length === 0) {
            // Usuario no encontrado
            throw new Error("Cuenta no encontrada. Por favor verifica tu correo o regístrate.");
          }
        
          const isPasswordValid = await compare(
            credentials.password.toString(),
            user[0].password
          );
        
          if (!isPasswordValid) {
            // Contraseña incorrecta
            throw new Error("Contraseña incorrecta. Por favor inténtalo de nuevo.");
          }
        
          // Si todo está bien, retornar el usuario
          return {
            id: user[0].id.toString(),
            email: user[0].email,
            name: user[0].fullName,
          } as User;
        } catch (error) {
          console.error('Error during authentication:', error);
          // Propagar el error para mostrarlo en la interfaz
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Ocurrió un error al iniciar sesión. Por favor inténtalo de nuevo.");
        }
      }    
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  events: {
    async signOut() {
      // This is where you can perform cleanup when a user signs out
      console.log('User signed out');
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

// Export the auth configuration
export const authOptions: NextAuthConfig = {
  ...authConfig,
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};

// Export the handlers and auth functions
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

// Export the auth configuration for use in other files
export { authOptions };