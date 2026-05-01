import prisma from '@/lib/prisma'

async function resetAndCreateTestTeacher() {
  try {
    console.log('=== RESET AND CREATE TEST TEACHER ===\n')

    console.log('Step 1: Deleting all posts...')
    await prisma.post.deleteMany({})
    console.log('Posts deleted!')

    console.log('\nStep 2: Deleting all teachers...')
    await prisma.teacher.deleteMany({})
    console.log('Teachers deleted!')

    console.log('\nStep 3: Creating test teacher...')
    const teacher = await prisma.teacher.create({
      data: {
        name: 'Mr Sunny',
        subject: 'English',
        password: '123',
        assignedClasses: ['9', '10'],
        assignedSections: ['A', 'B']
      }
    })

    console.log('\n=== TEST TEACHER CREATED ===')
    console.log(JSON.stringify(teacher, null, 2))

    console.log('\n=== VERIFY FILTERING ===')
    console.log('Class: 9, Section: A, Subject: English')
    console.log('Expected: Mr Sunny should appear')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAndCreateTestTeacher()