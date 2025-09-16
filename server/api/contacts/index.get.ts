import prisma from '~/lib/prisma'

interface QueryParams {
  limit?: string
  cursor?: string
  search?: string
  locationId?: string
  tags?: string
}

interface CursorData {
  createdAt: string
  id: number
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event) as QueryParams
    
    // Parse and validate limit
    const limit = Math.min(parseInt(query.limit || '20'), 100)
    
    // Parse cursor if provided
    let cursorData: CursorData | null = null
    if (query.cursor) {
      try {
        const decoded = Buffer.from(query.cursor, 'base64').toString('utf-8')
        cursorData = JSON.parse(decoded) as CursorData
      } catch (error) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid cursor format'
        })
      }
    }
    
    // Build where clause
    const where: any = {}
    
    // Add cursor condition
    if (cursorData) {
      where.OR = [
        {
          createdAt: {
            lt: new Date(cursorData.createdAt)
          }
        },
        {
          createdAt: new Date(cursorData.createdAt),
          id: {
            lt: cursorData.id
          }
        }
      ]
    }
    
    // Add search condition
    if (query.search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
            { phone: { contains: query.search, mode: 'insensitive' } },
            { notes: { contains: query.search, mode: 'insensitive' } }
          ]
        }
      ]
    }
    
    // Add location filter
    if (query.locationId) {
      where.locationId = parseInt(query.locationId)
    }
    
    // Add tags filter
    if (query.tags) {
      const tagArray = query.tags.split(',').map(tag => tag.trim())
      where.tags = {
        hasSome: tagArray
      }
    }
    
    // Fetch contacts with one extra to check if there are more
    const contacts = await prisma.contact.findMany({
      where,
      include: {
        location: true
      },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      take: limit + 1
    })
    
    // Check if there are more records
    const hasMore = contacts.length > limit
    const data = hasMore ? contacts.slice(0, -1) : contacts
    
    // Generate next cursor if there are more records
    let nextCursor: string | null = null
    if (hasMore && data.length > 0) {
      const lastContact = data[data.length - 1]
      const cursorData: CursorData = {
        createdAt: lastContact.createdAt.toISOString(),
        id: lastContact.id
      }
      nextCursor = Buffer.from(JSON.stringify(cursorData)).toString('base64')
    }
    
    return {
      data,
      nextCursor,
      hasMore
    }
  } catch (error) {
    console.error('Error fetching contacts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch contacts'
    })
  }
})
