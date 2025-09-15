import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // Only protect admin routes
  if (!event.node.req.url?.startsWith('/api/admin')) {
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
