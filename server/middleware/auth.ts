import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // Protect admin routes and contact modification endpoints
  const url = event.node.req.url
  const method = event.node.req.method
  
  // Allow GET requests to contacts and locations for public viewing
  if (method === 'GET' && (url?.startsWith('/api/contacts') || url?.startsWith('/api/locations'))) {
    return
  }
  
  // Protect admin routes and contact modification endpoints
  if (!url?.startsWith('/api/admin') && 
      !(url?.startsWith('/api/contacts') && (method === 'POST' || method === 'PUT' || method === 'DELETE')) &&
      !(url?.startsWith('/api/locations') && (method === 'POST' || method === 'PUT' || method === 'DELETE'))) {
    return
  }

  try {
    const token = getCookie(event, 'admin-token')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    // Verify JWT token
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret) as any

    // Add admin info to event context
    event.context.admin = {
      id: decoded.adminId,
      email: decoded.email,
      name: decoded.name
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid authentication token'
    })
  }
})
