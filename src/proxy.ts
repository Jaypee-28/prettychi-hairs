import { auth } from "./auth.edge"

// Define routes with special handling
const authRoutes = ["/login", "/register", "/admin/motioncodes"]
const protectedRoutes = ["/checkout", "/account", "/orders"]
const apiAuthPrefix = "/api/auth"

export const proxy = auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const user = req.auth?.user as any

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route))
  const isAdminRoute = nextUrl.pathname.startsWith("/admin") && !isAuthRoute

  // 1. Always allow API auth routes
  if (isApiAuthRoute) return;

  // 2. Handle Auth Routes (Login/Register/Admin Portal)
  if (isAuthRoute) {
    if (isLoggedIn) {
      // If logged in as admin and at admin portal, redirect to dashboard
      if (user?.userType === "admin" && nextUrl.pathname === "/admin/motioncodes") {
        return Response.redirect(new URL("/admin", nextUrl))
      }
      
      // If logged in as user and at admin portal, redirect to home
      if (user?.userType === "user" && nextUrl.pathname === "/admin/motioncodes") {
        return Response.redirect(new URL("/", nextUrl))
      }

      // Default redirect for other auth routes
      const callbackUrl = nextUrl.searchParams.get("callbackUrl")
      return Response.redirect(new URL(callbackUrl || "/", nextUrl))
    }
    return;
  }

  // 3. Handle Admin Routes (/admin/*)
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/admin/motioncodes", nextUrl))
    }
    
    // Strict check: Must be an admin userType
    if (user?.userType !== "admin") {
      return Response.redirect(new URL("/", nextUrl))
    }
    
    return;
  }

  // 4. Handle Protected Routes (Checkout, Account, Orders)
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = nextUrl.pathname + nextUrl.search;
    return Response.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl))
  }

  // 5. Everything else is public
  return;
})

export default proxy;

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
