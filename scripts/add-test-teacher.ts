import prisma from '../lib/prisma'

async function addTestTeacher() {
  try {
    console.log('Adding test teacher...')
    
    const teacher = await prisma.teacher.create({
      data: {
        name: 'Mr Sunny',
        subject: 'English',
        password: '123',
        assignedClasses: ['9', '10'],
        assignedSections: ['A', 'B']
      }
    })
    
    console.log('Test teacher created:', teacher)
    console.log('\nNow test the student flow:')
    console.log('Class: 9 → Section: A → Subject: English')
    console.log('Expected: Mr Sunny should appear')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTestTeacher()