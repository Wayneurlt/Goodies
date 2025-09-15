import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('W20974802g@', 12)
    
    // Create admin user
    const admin = await prisma.admin.upsert({
      where: { email: 'wayneurlt@gmail.com' },
      update: {},
      create: {
        email: 'wayneurlt@gmail.com',
        password: hashedPassword,
        name: 'Admin User'
      }
    })

    console.log('✅ Admin user created successfully:', {
      id: admin.id,
      email: admin.email,
      name: admin.name
    })

    // Create some sample locations
    const locations = await Promise.all([
      prisma.location.upsert({
        where: { name: 'New York' },
        update: {},
        create: { name: 'New York' }
      }),
      prisma.location.upsert({
        where: { name: 'London' },
        update: {},
        create: { name: 'London' }
      }),
      prisma.location.upsert({
        where: { name: 'Tokyo' },
        update: {},
        create: { name: 'Tokyo' }
      }),
      prisma.location.upsert({
        where: { name: 'Paris' },
        update: {},
        create: { name: 'Paris' }
      })
    ])

    console.log('✅ Sample locations created:', locations.map(l => l.name))

    // Create some sample contacts
    const contacts = await Promise.all([
      prisma.contact.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1-555-0123',
          locationId: locations[0].id,
          tags: ['VIP', 'Client'],
          notes: 'Important client from New York'
        }
      }),
      prisma.contact.create({
        data: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+44-20-7946-0958',
          locationId: locations[1].id,
          tags: ['Partner', 'Business'],
          notes: 'Business partner in London'
        }
      }),
      prisma.contact.create({
        data: {
          name: 'Yuki Tanaka',
          email: 'yuki@example.com',
          phone: '+81-3-1234-5678',
          locationId: locations[2].id,
          tags: ['Supplier', 'Technology'],
          notes: 'Tech supplier from Tokyo'
        }
      })
    ])

    console.log('✅ Sample contacts created:', contacts.map(c => c.name))
    console.log('\n🎉 Database setup complete!')
    console.log('📧 Admin email: wayneurlt@gmail.com')
    console.log('🔑 Admin password: W20974802g@')

  } catch (error) {
    console.error('❌ Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
