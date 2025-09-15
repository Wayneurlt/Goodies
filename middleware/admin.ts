export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side to avoid SSR issues
  if (process.server) {
    return
  }
  
  // Check if user is authenticated
  const token = useCookie('admin-token')
  
  if (!token.value) {
    return navigateTo('/login')
  }
  
  // For now, just check if token exists
  // We'll do proper validation in the page components
  return
})
