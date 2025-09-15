import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

// Function to clean and normalize phone numbers
function cleanPhoneNumber(phone) {
  if (!phone) return null
  
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '')
  
  // Handle Kenyan numbers
  if (cleaned.startsWith('254')) {
    return '+' + cleaned
  } else if (cleaned.startsWith('0')) {
    return '+254' + cleaned.substring(1)
  } else if (cleaned.startsWith('+')) {
    return cleaned
  } else if (cleaned.length >= 9) {
    return '+' + cleaned
  }
  
  return null
}

// Function to extract location from contact data
function extractLocation(contact) {
  // Check if there's a location in the name or organization
  const name = contact.name || ''
  const org = contact.organization || ''
  
  // Common location keywords
  const locationKeywords = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale',
    'Garissa', 'Kakamega', 'Nyeri', 'Meru', 'Kilifi', 'Machakos', 'Uasin Gishu',
    'Westlands', 'Karen', 'Runda', 'Kileleshwa', 'Lavington', 'Kilimani', 'CBD',
    'Eastleigh', 'South B', 'South C', 'Langata', 'Kasarani', 'Embakasi', 'Ruaraka',
    'Kahawa', 'Kiambu', 'Thika', 'Ruiru', 'Athi River', 'Machakos', 'Kitui',
    'Makueni', 'Kajiado', 'Narok', 'Bomet', 'Kericho', 'Nandi', 'Trans Nzoia',
    'Bungoma', 'Busia', 'Vihiga', 'Siaya', 'Homa Bay', 'Migori', 'Kisii',
    'Nyamira', 'Turkana', 'West Pokot', 'Samburu', 'Marsabit', 'Isiolo',
    'Mandera', 'Wajir', 'Tana River', 'Lamu', 'Taita Taveta', 'Kwale',
    'Mombasa', 'Kilifi', 'Tana River', 'Lamu', 'Garissa', 'Wajir', 'Mandera'
  ]
  
  // Check for location keywords in name or organization
  for (const keyword of locationKeywords) {
    if (name.toLowerCase().includes(keyword.toLowerCase()) || 
        org.toLowerCase().includes(keyword.toLowerCase())) {
      return keyword
    }
  }
  
  // Default to Nairobi if no location found
  return 'Nairobi'
}

// Function to extract tags from contact data
function extractTags(contact) {
  const tags = []
  const name = contact.name || ''
  const org = contact.organization || ''
  const notes = contact.notes || ''
  
  // Common tag keywords
  const tagKeywords = [
    'Zh', 'Kaba', 'Bbit', 'Cp', 'Cgc', 'Bridge', 'Maso', 'Hommie', 'Cuz', 'Bball',
    'Basketball', 'Model', 'Doctor', 'Dr', 'Nurse', 'Teacher', 'Student', 'Engineer',
    'Lawyer', 'Business', 'Marketing', 'Finance', 'IT', 'Developer', 'Designer',
    'Artist', 'Musician', 'Actor', 'Writer', 'Journalist', 'Photographer', 'Chef',
    'Driver', 'Security', 'Cleaner', 'Caretaker', 'Delivery', 'Rider', 'Taxi',
    'Family', 'Friend', 'Colleague', 'Client', 'Customer', 'Vendor', 'Supplier',
    'Emergency', 'Important', 'VIP', 'Starred', 'Favorite', 'Work', 'Personal'
  ]
  
  // Check for tag keywords
  for (const keyword of tagKeywords) {
    if (name.toLowerCase().includes(keyword.toLowerCase()) || 
        org.toLowerCase().includes(keyword.toLowerCase()) ||
        notes.toLowerCase().includes(keyword.toLowerCase())) {
      tags.push(keyword)
    }
  }
  
  // Add relationship tags based on name patterns
  if (name.toLowerCase().includes('mama') || name.toLowerCase().includes('mum')) {
    tags.push('Family')
  }
  if (name.toLowerCase().includes('uncle') || name.toLowerCase().includes('aunt')) {
    tags.push('Family')
  }
  if (name.toLowerCase().includes('bro') || name.toLowerCase().includes('sis')) {
    tags.push('Family')
  }
  
  // Add work-related tags
  if (org.toLowerCase().includes('hospital') || org.toLowerCase().includes('clinic')) {
    tags.push('Healthcare')
  }
  if (org.toLowerCase().includes('school') || org.toLowerCase().includes('university')) {
    tags.push('Education')
  }
  if (org.toLowerCase().includes('bank') || org.toLowerCase().includes('finance')) {
    tags.push('Finance')
  }
  
  return [...new Set(tags)] // Remove duplicates
}

// Function to parse CSV data
function parseCSV(csvContent) {
  const lines = csvContent.split('\n')
  const headers = lines[0].split(',')
  const contacts = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const values = []
    let current = ''
    let inQuotes = false
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    
    if (values.length >= headers.length) {
      const contact = {}
      headers.forEach((header, index) => {
        contact[header.trim()] = values[index]?.replace(/"/g, '') || ''
      })
      contacts.push(contact)
    }
  }
  
  return contacts
}

// Main import function
async function importContacts() {
  try {
    console.log('Starting contact import...')
    
    // Read CSV files
    const csv1Path = 'C:\\Users\\wayne\\Downloads\\contacts.csv'
    const csv2Path = 'C:\\Users\\wayne\\Downloads\\contacts (1).csv'
    
    let csv1Content = ''
    let csv2Content = ''
    
    try {
      csv1Content = fs.readFileSync(csv1Path, 'utf-8')
      console.log('Read contacts.csv successfully')
    } catch (error) {
      console.log('Could not read contacts.csv:', error.message)
    }
    
    try {
      csv2Content = fs.readFileSync(csv2Path, 'utf-8')
      console.log('Read contacts (1).csv successfully')
    } catch (error) {
      console.log('Could not read contacts (1).csv:', error.message)
    }
    
    // Parse CSV data
    const contacts1 = csv1Content ? parseCSV(csv1Content) : []
    const contacts2 = csv2Content ? parseCSV(csv2Content) : []
    
    const allContacts = [...contacts1, ...contacts2]
    console.log(`Parsed ${allContacts.length} contacts from CSV files`)
    
    // Process contacts
    const processedContacts = []
    const locationMap = new Map()
    
    for (const contact of allContacts) {
      // Extract name
      const firstName = contact['First Name'] || ''
      const middleName = contact['Middle Name'] || ''
      const lastName = contact['Last Name'] || ''
      const nickname = contact['Nickname'] || ''
      
      let name = ''
      if (firstName || lastName) {
        name = [firstName, middleName, lastName].filter(Boolean).join(' ')
      } else if (nickname) {
        name = nickname
      } else if (contact['Organization Name']) {
        name = contact['Organization Name']
      } else {
        continue // Skip if no name
      }
      
      // Clean name
      name = name.trim().replace(/[^\w\s\-\.]/g, '')
      if (!name) continue
      
      // Extract phone
      const phone = cleanPhoneNumber(contact['Phone 1 - Value'] || contact['Phone 2 - Value'])
      
      // Extract email
      const email = contact['E-mail 1 - Value'] || ''
      
      // Extract location
      const locationName = extractLocation({
        name,
        organization: contact['Organization Name'] || ''
      })
      
      // Extract tags
      const tags = extractTags({
        name,
        organization: contact['Organization Name'] || '',
        notes: contact['Notes'] || ''
      })
      
      // Extract notes
      const notes = contact['Notes'] || ''
      
      // Store location for later creation
      if (!locationMap.has(locationName)) {
        locationMap.set(locationName, [])
      }
      locationMap.get(locationName).push(processedContacts.length)
      
      processedContacts.push({
        name,
        phone,
        email: email || null,
        locationName,
        tags,
        notes: notes || null
      })
    }
    
    console.log(`Processed ${processedContacts.length} contacts`)
    console.log(`Found ${locationMap.size} unique locations`)
    
    // Create locations
    const locationIds = new Map()
    for (const [locationName, contactIndices] of locationMap) {
      try {
        const location = await prisma.location.upsert({
          where: { name: locationName },
          update: {},
          create: { name: locationName }
        })
        locationIds.set(locationName, location.id)
        console.log(`Created/found location: ${locationName}`)
      } catch (error) {
        console.error(`Error creating location ${locationName}:`, error.message)
      }
    }
    
    // Create contacts
    let createdCount = 0
    let skippedCount = 0
    
    for (const contact of processedContacts) {
      try {
        // Check if contact already exists
        const existingContact = await prisma.contact.findFirst({
          where: {
            name: contact.name,
            phone: contact.phone
          }
        })
        
        if (existingContact) {
          skippedCount++
          continue
        }
        
        const locationId = locationIds.get(contact.locationName)
        
        await prisma.contact.create({
          data: {
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            locationId: locationId,
            tags: contact.tags,
            notes: contact.notes
          }
        })
        
        createdCount++
        
        if (createdCount % 100 === 0) {
          console.log(`Created ${createdCount} contacts...`)
        }
        
      } catch (error) {
        console.error(`Error creating contact ${contact.name}:`, error.message)
        skippedCount++
      }
    }
    
    console.log(`\nImport completed!`)
    console.log(`Created: ${createdCount} contacts`)
    console.log(`Skipped: ${skippedCount} contacts (duplicates or errors)`)
    console.log(`Locations: ${locationMap.size}`)
    
    // Get final stats
    const totalContacts = await prisma.contact.count()
    const totalLocations = await prisma.location.count()
    
    console.log(`\nDatabase now contains:`)
    console.log(`- ${totalContacts} contacts`)
    console.log(`- ${totalLocations} locations`)
    
  } catch (error) {
    console.error('Import failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the import
importContacts()
