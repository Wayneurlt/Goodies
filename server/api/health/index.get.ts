import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Test a simple query
    const contactCount = await prisma.contact.count()
    
    return {
      status: 'healthy',
      database: 'connected',
      contactCount,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Health check failed:', error)
    
    return {
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
})
