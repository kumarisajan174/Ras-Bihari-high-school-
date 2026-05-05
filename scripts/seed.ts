import prisma from '../lib/prisma'

async function main() {
  console.log('🌱 Seeding database safely (no data deleted)...')

  // -------------------------------
  // 1. CREATE CLASSES ONLY IF NEEDED
  // -------------------------------
  const classNames = ['9', '10', '11', '12']
  const existingClasses = await prisma.class.findMany()
  const existingClassNames = existingClasses.map(c => c.name)

  for (const name of classNames) {
    if (!existingClassNames.includes(name)) {
      await prisma.class.create({ data: { name } })
      console.log(`✅ Created class ${name}`)
    }
  }
  const allClasses = await prisma.class.findMany()

  // -------------------------------
  // 2. CREATE SECTIONS ONLY IF NEEDED
  // -------------------------------
  const sectionNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const existingSections = await prisma.section.findMany()
  const existingSectionNames = existingSections.map(s => s.name)

  for (const name of sectionNames) {
    if (!existingSectionNames.includes(name)) {
      await prisma.section.create({ data: { name } })
      console.log(`✅ Created section ${name}`)
    }
  }
  const allSections = await prisma.section.findMany()

  // -------------------------------
  // 3. CREATE SUBJECTS ONLY IF NEEDED
  // -------------------------------
  const allSubjectNames = [
    'English', 'Hindi', 'Sanskrit', 'Mathematics', 'Computer',
    'Political Science', 'Geography', 'Economics', 'Physics', 'Chemistry', 'Biology'
  ]
  const existingSubjects = await prisma.subject.findMany()
  const existingSubjectNames = existingSubjects.map(s => s.name)

  for (const name of allSubjectNames) {
    if (!existingSubjectNames.includes(name)) {
      await prisma.subject.create({ data: { name } })
      console.log(`✅ Created subject ${name}`)
    }
  }

  // -------------------------------
  // 4. CREATE TEACHERS ONLY IF NEEDED
  // -------------------------------
  const existingTeachers = await prisma.teacher.findMany()
  const existingTeacherNames = existingTeachers.map(t => t.name)

  const sampleTeachers = [
    {
      name: 'Mr. Sunny',
      subject: 'English',
      password: 'sunny123',
      assignedClasses: ['9', '10'],
      assignedSections: ['A', 'B']
    },
    {
      name: 'Shivani',
      subject: 'Mathematics',
      password: 'shivani123',
      assignedClasses: ['9'],
      assignedSections: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    },
    {
      name: 'Akash',
      subject: 'Physics',
      password: 'akash123',
      assignedClasses: ['9'],
      assignedSections: ['A']
    },
    {
      name: 'Principal',
      subject: 'All Subjects',
      password: 'principal123',
      assignedClasses: ['9', '10', '11', '12'],
      assignedSections: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    }
  ]

  for (const teacherData of sampleTeachers) {
    if (!existingTeacherNames.includes(teacherData.name)) {
      await prisma.teacher.create({ data: teacherData })
      console.log(`✅ Created teacher ${teacherData.name}`)
    }
  }

  // -------------------------------
  // 5. CREATE ADMIN ONLY IF NEEDED
  // -------------------------------
  const existingAdmin = await prisma.admin.findFirst({ where: { username: 'admin' } })
  if (!existingAdmin) {
    await prisma.admin.create({ data: { username: 'admin', password: 'admin123' } })
    console.log(`✅ Created admin`)
  }

  console.log('\n✅✅✅ Seed complete! All data preserved! ✅✅✅')
  console.log('\n📝 Quick Reference:')
  console.log('   - Admin: admin / admin123')
  console.log('   - Mr. Sunny (English): sunny123')
  console.log('   - Shivani (Maths): shivani123')
  console.log('   - Akash (Physics): akash123')
  console.log('   - Principal (All): principal123')
  console.log('\n⚠️  Your manually added teachers, posts, notices are SAFE!')
  console.log('⚠️  The seed script never deletes anything anymore!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
