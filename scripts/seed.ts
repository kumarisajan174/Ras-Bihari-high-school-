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
  const allSubjects = await prisma.subject.findMany()
  const englishSubject = allSubjects.find(s => s.name === 'English')
  const mathsSubject = allSubjects.find(s => s.name === 'Mathematics')
  const physicsSubject = allSubjects.find(s => s.name === 'Physics')

  // -------------------------------
  // 4. CREATE TEACHERS ONLY IF NEEDED
  // -------------------------------
  const existingTeachers = await prisma.teacher.findMany()
  const existingTeacherNames = existingTeachers.map(t => t.name)
  
  const sampleTeachers = [
    {
      name: 'Mr. Sunny',
      subjectId: englishSubject?.id || '',
      password: 'sunny123'
    },
    {
      name: 'Shivani',
      subjectId: mathsSubject?.id || '',
      password: 'shivani123'
    },
    {
      name: 'Akash',
      subjectId: physicsSubject?.id || '',
      password: 'akash123'
    }
  ]
  
  for (const teacherData of sampleTeachers) {
    if (!existingTeacherNames.includes(teacherData.name)) {
      await prisma.teacher.create({ data: teacherData })
      console.log(`✅ Created teacher ${teacherData.name}`)
    }
  }
  
  const allTeachers = await prisma.teacher.findMany({ include: { subject: true } })
  const sunny = allTeachers.find(t => t.name === 'Mr. Sunny')
  const shivani = allTeachers.find(t => t.name === 'Shivani')
  const akash = allTeachers.find(t => t.name === 'Akash')
  const class9 = allClasses.find(c => c.name === '9')
  const class10 = allClasses.find(c => c.name === '10')
  const sectionA = allSections.find(s => s.name === 'A')
  const sectionB = allSections.find(s => s.name === 'B')

  // -------------------------------
  // 5. CREATE TEACHER ASSIGNMENTS ONLY IF NEEDED
  // -------------------------------
  const existingAssignments = await prisma.teacherAssignment.findMany()
  
  if (sunny && class9 && class10 && sectionA && sectionB) {
    const sunnyAssignmentKeys = [
      `${sunny.id}-${class9.id}-${sectionA.id}`,
      `${sunny.id}-${class9.id}-${sectionB.id}`,
      `${sunny.id}-${class10.id}-${sectionA.id}`,
      `${sunny.id}-${class10.id}-${sectionB.id}`,
    ]
    for (const cls of [class9, class10]) {
      for (const sec of [sectionA, sectionB]) {
        const key = `${sunny.id}-${cls.id}-${sec.id}`
        const exists = existingAssignments.find(a => 
          a.teacherId === sunny.id && a.classId === cls.id && a.sectionId === sec.id
        )
        if (!exists) {
          await prisma.teacherAssignment.create({
            data: {
              teacherId: sunny.id,
              classId: cls.id,
              sectionId: sec.id
            }
          })
          console.log(`✅ Created assignment: Sunny → Class ${cls.name}${sec.name}`)
        }
      }
    }
  }
  
  if (shivani && class9) {
    for (const sec of allSections) {
      const exists = existingAssignments.find(a => 
        a.teacherId === shivani.id && a.classId === class9.id && a.sectionId === sec.id
      )
      if (!exists) {
        await prisma.teacherAssignment.create({
          data: {
            teacherId: shivani.id,
            classId: class9.id,
            sectionId: sec.id
          }
        })
        console.log(`✅ Created assignment: Shivani → Class 9${sec.name}`)
      }
    }
  }
  
  if (akash && class9 && sectionA) {
    const exists = existingAssignments.find(a => 
      a.teacherId === akash.id && a.classId === class9.id && a.sectionId === sectionA.id
    )
    if (!exists) {
      await prisma.teacherAssignment.create({
        data: {
          teacherId: akash.id,
          classId: class9.id,
          sectionId: sectionA.id
        }
      })
      console.log(`✅ Created assignment: Akash → Class 9A`)
    }
  }

  // -------------------------------
  // 6. CREATE ADMIN ONLY IF NEEDED
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
