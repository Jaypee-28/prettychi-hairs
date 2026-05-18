import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcrypt"
import { loginSchema } from "@/modules/auth/types"
import { auth as edgeAuth } from "./auth.edge" // We can reuse callbacks if we wanted, but let's define fully

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isAdmin: { label: "Is Admin", type: "text" }, // Hidden field or passed from admin login
      },
      authorize: async (credentials) => {
        const { email, password } = await loginSchema.parseAsync(credentials)
        const isAdmin = credentials.isAdmin === "true"

        if (isAdmin) {
          const admin = await prisma.admin.findUnique({ where: { email } })
          if (!admin || !admin.isActive) return null

          const isValid = await bcrypt.compare(password, admin.password)
          if (!isValid) return null

          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            image: admin.image,
            role: admin.role,
            userType: "admin",
          }
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          userType: "user",
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // @ts-ignore
        token.userType = user.userType || "user"
        // @ts-ignore
        token.role = user.role // Only present for admins
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
        // @ts-ignore
        session.user.userType = token.userType as string
        // @ts-ignore
        session.user.role = token.role as string
      }
      return session
    },
  },
})
