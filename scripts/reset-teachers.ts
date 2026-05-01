import prisma from '../lib/prisma'

async function resetTeachers() {
  try {
    console.log('Step 1: Deleting all posts...')
    await prisma.post.deleteMany({})
    console.log('Posts deleted!')
    
    console.log('Step 2: Deleting all teachers...')
    await prisma.teacher.deleteMany({})
    console.log('Teachers deleted!')
    
    console.log('\n✓ All old data cleaned up!')
    console.log('Now create new teachers using the admin panel.')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetTeachers()