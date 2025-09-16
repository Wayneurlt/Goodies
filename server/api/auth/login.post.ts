import prisma from '~/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password)

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Create JWT token
    const config = useRuntimeConfig()
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email,
        name: admin.name 
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    )

    // Set HTTP-only cookie
    setCookie(event, 'admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })

    return {
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
