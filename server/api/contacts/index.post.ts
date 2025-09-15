import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ContactData {
  name: string
  phone?: string
  email?: string
  locationId?: number
  tags?: string[]
  notes?: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) as ContactData
    
    // Validate required fields
    if (!body.name || body.name.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name is required'
      })
    }
    
    // Validate email format if provided
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }
    
    // Validate location exists if provided
    if (body.locationId) {
      const location = await prisma.location.findUnique({
        where: { id: body.locationId }
      })
      
      if (!location) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Location not found'
        })
      }
    }
    
    // Create contact
    const contact = await prisma.contact.create({
      data: {
        name: body.name.trim(),
        phone: body.phone?.trim() || null,
        email: body.email?.trim() || null,
        locationId: body.locationId || null,
        tags: body.tags || [],
        notes: body.notes?.trim() || null
      },
      include: {
        location: true
      }
    })
    
    return contact
  } catch (error) {
    console.error('Error creating contact:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create contact'
    })
  }
})
