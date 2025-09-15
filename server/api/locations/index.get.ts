import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { contacts: true }
        }
      }
    })
    
    return locations
  } catch (error) {
    console.error('Error fetching locations:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch locations'
    })
  }
})
