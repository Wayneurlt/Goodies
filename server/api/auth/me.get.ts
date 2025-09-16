import prisma from '~/lib/prisma'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'admin-token')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No authentication token'
      })
    }

    // Verify JWT token
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret) as any

    // Get admin from database
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })

    if (!admin) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Admin not found'
      })
    }

    return {
      success: true,
      admin
    }
  } catch (error) {
    console.error('Auth check error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
})
