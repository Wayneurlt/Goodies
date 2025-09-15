import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ContactData {
  name?: string
  phone?: string
  email?: string
  locationId?: number
  tags?: string[]
  notes?: string
}

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    
    if (isNaN(id) || id <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid contact ID'
      })
    }
    
    const body = await readBody(event) as ContactData
    
    // Check if contact exists
    const existingContact = await prisma.contact.findUnique({
      where: { id }
    })
    
    if (!existingContact) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Contact not found'
      })
    }
    
    // Validate name if provided
    if (body.name !== undefined && (!body.name || body.name.trim().length === 0)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name cannot be empty'
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
    
    // Update contact
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.phone !== undefined && { phone: body.phone?.trim() || null }),
        ...(body.email !== undefined && { email: body.email?.trim() || null }),
        ...(body.locationId !== undefined && { locationId: body.locationId || null }),
        ...(body.tags !== undefined && { tags: body.tags || [] }),
        ...(body.notes !== undefined && { notes: body.notes?.trim() || null })
      },
      include: {
        location: true
      }
    })
    
    return contact
  } catch (error) {
    console.error('Error updating contact:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update contact'
    })
  }
})
