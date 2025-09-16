import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    
    if (isNaN(id) || id <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid contact ID'
      })
    }
    
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        location: true
      }
    })
    
    if (!contact) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Contact not found'
      })
    }
    
    return contact
  } catch (error) {
    console.error('Error fetching contact:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch contact'
    })
  }
})
