import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get total contacts count
    const totalContacts = await prisma.contact.count()
    
    // Get total locations count
    const totalLocations = await prisma.location.count()
    
    // Get top locations by contact count
    const topLocations = await prisma.location.findMany({
      include: {
        _count: {
          select: { contacts: true }
        }
      },
      orderBy: {
        contacts: {
          _count: 'desc'
        }
      },
      take: 5
    })
    
    // Get recently added contacts (last 5)
    const recentContacts = await prisma.contact.findMany({
      include: {
        location: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })
    
    // Get all unique tags
    const allContacts = await prisma.contact.findMany({
      select: { tags: true }
    })
    
    const allTags = allContacts
      .flatMap(contact => contact.tags)
      .filter((tag, index, array) => array.indexOf(tag) === index)
      .sort()
    
    // Get tag counts
    const tagCounts = allTags.map(tag => ({
      tag,
      count: allContacts.filter(contact => contact.tags.includes(tag)).length
    })).sort((a, b) => b.count - a.count)
    
    return {
      totalContacts,
      totalLocations,
      topLocations,
      recentContacts,
      allTags,
      tagCounts: tagCounts.slice(0, 10) // Top 10 tags
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dashboard stats'
    })
  }
})
