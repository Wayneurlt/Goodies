import prisma from '~/lib/prisma'

interface LocationData {
  name: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) as LocationData
    
    // Validate required fields
    if (!body.name || body.name.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Location name is required'
      })
    }
    
    // Check if location already exists
    const existingLocation = await prisma.location.findUnique({
      where: { name: body.name.trim() }
    })
    
    if (existingLocation) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Location already exists'
      })
    }
    
    // Create location
    const location = await prisma.location.create({
      data: {
        name: body.name.trim()
      }
    })
    
    return location
  } catch (error) {
    console.error('Error creating location:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create location'
    })
  }
})
