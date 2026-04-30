import prisma from '../lib/prisma'

async function main() {
  await prisma.notice.deleteMany()
  await prisma.post.deleteMany()
  await prisma.teacherAssignment.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.section.deleteMany()
  await prisma.class.deleteMany()

  const class9 = await prisma.class.create({ data: { name: '9' } })
  const class10 = await prisma.class.create({ data: { name: '10' } })
  const class11 = await prisma.class.create({ data: { name: '11' } })
  const class12 = await prisma.class.create({ data: { name: '12' } })

  const sectionNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const sectionsData = sectionNames.map(name => ({ name }))
  await prisma.section.createMany({ data: sectionsData })

  const allSubjects = [
    'English', 'Hindi', 'Sanskrit', 'Mathematics', 'Computer',
    'Political Science', 'Geography', 'Economics', 'Physics', 'Chemistry', 'Biology'
  ]
  await prisma.subject.createMany({
    data: allSubjects.map(name => ({ name }))
  })

  const subjects = await prisma.subject.findMany()
  const englishSubject = subjects.find(s => s.name === 'English')
  const mathsSubject = subjects.find(s => s.name === 'Mathematics')
  const physicsSubject = subjects.find(s => s.name === 'Physics')

  const allSections = await prisma.section.findMany()

  // Create teachers with passwords!
  const teacher1 = await prisma.teacher.create({
    data: {
      name: 'Mr. Sunny',
      subjectId: englishSubject?.id || '',
      password: 'sunny123'
    }
  })

  const teacher2 = await prisma.teacher.create({
    data: {
      name: 'Shivani',
      subjectId: mathsSubject?.id || '',
      password: 'shivani123'
    }
  })

  const teacher3 = await prisma.teacher.create({
    data: {
      name: 'Akash',
      subjectId: physicsSubject?.id || '',
      password: 'akash123'
    }
  })

  // Create assignments for Mr. Sunny (9A, 9B, 10A, 10B)
  for (const cls of [class9, class10]) {
    for (const sec of allSections.slice(0, 2)) {
      await prisma.teacherAssignment.create({
        data: {
          teacherId: teacher1.id,
          classId: cls.id,
          sectionId: sec.id
        }
      })
    }
  }

  // Create assignments for Shivani (all sections of 9)
  for (const sec of allSections) {
    await prisma.teacherAssignment.create({
      data: {
        teacherId: teacher2.id,
        classId: class9.id,
        sectionId: sec.id
      }
    })
  }

  // Create assignment for Akash (9A)
  await prisma.teacherAssignment.create({
    data: {
      teacherId: teacher3.id,
      classId: class9.id,
      sectionId: allSections[0].id
    }
  })

  // Add sample posts
  const samplePosts = [
    {
      title: 'Chapter 1: The Sentence',
      content: 'Complete exercises 1-5 from the textbook. Focus on sentence structure and punctuation.',
      type: 'Homework',
      teacherId: teacher1.id,
      classId: class9.id,
      sectionId: allSections[0].id,
      subjectId: englishSubject?.id || '',
      isHighlight: true
    },
    {
      title: 'Algebra Basics',
      content: 'Practice problems from pages 45-50. Include linear equations and polynomials.',
      type: 'Homework',
      teacherId: teacher2.id,
      classId: class9.id,
      sectionId: allSections[0].id,
      subjectId: mathsSubject?.id || '',
      isHighlight: true
    },
    {
      title: 'Physics Lab Safety',
      content: 'Read chapter 1 thoroughly. Prepare for practical experiments next week.',
      type: 'Classwork',
      teacherId: teacher3.id,
      classId: class9.id,
      sectionId: allSections[0].id,
      subjectId: physicsSubject?.id || '',
      isHighlight: false
    }
  ]

  for (const post of samplePosts) {
    await prisma.post.create({
      data: {
        ...post,
        date: new Date()
      }
    })
  }

  // Add sample notices
  const sampleNotices = [
    {
      title: 'Annual Function',
      content: 'Annual function will be held on 15th May. All students must participate. Come in your best dresses!',
      type: 'Important',
      date: new Date(),
      isImportant: true,
      isPinned: true
    },
    {
      title: 'Exam Schedule',
      content: 'Final exams start from 20th May. Check notice board for detailed schedule. Timetable will be shared soon.',
      type: 'Exam',
      date: new Date(),
      isImportant: true,
      isPinned: false
    },
    {
      title: 'Summer Holidays',
      content: 'Summer holidays from 1st June to 15th July. Enjoy your vacation! School reopens on 16th July.',
      type: 'Holiday',
      date: new Date(),
      isImportant: false,
      isPinned: false
    },
    {
      title: 'Internship Meeting',
      content: 'Important meeting for all interns on 25th April at 10 AM. Be on time!',
      type: 'Internship',
      date: new Date(),
      isImportant: true,
      isPinned: false
    },
    {
      title: 'Parent-Teacher Meeting',
      content: 'PTM scheduled for 30th April. All parents are requested to attend.',
      type: 'General',
      date: new Date(),
      isImportant: false,
      isPinned: false
    }
  ]

  for (const notice of sampleNotices) {
    await prisma.notice.create({ data: notice })
  }

  console.log('Seed completed!')
  console.log('Classes:', class9.name, class10.name, class11.name, class12.name)
  console.log('Sections:', sectionNames.join(', '))
  console.log('Subjects:', allSubjects.join(', '))
  console.log('Teachers created with passwords:')
  console.log(`- Mr. Sunny (English): sunny123`)
  console.log(`- Shivani (Mathematics): shivani123`)
  console.log(`- Akash (Physics): akash123`)
  console.log('Sample posts and notices created!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
