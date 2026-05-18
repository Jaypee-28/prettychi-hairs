import NextAuth from "next-auth"

export const { auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [], // No providers here to ensure Edge compatibility
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // @ts-ignore
        token.userType = user.userType
        // @ts-ignore
        token.role = user.role
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
    }
  }
})
