const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Classes
  const class9 = await prisma.class.create({ data: { name: '9' } });
  const class10 = await prisma.class.create({ data: { name: '10' } });
  const class11 = await prisma.class.create({ data: { name: '11' } });
  const class12 = await prisma.class.create({ data: { name: '12' } });
  console.log('Classes created');

  // Create Sections
  const sectionA = await prisma.section.create({ data: { name: 'A' } });
  const sectionB = await prisma.section.create({ data: { name: 'B' } });
  const sectionC = await prisma.section.create({ data: { name: 'C' } });
  const sectionD = await prisma.section.create({ data: { name: 'D' } });
  const sectionE = await prisma.section.create({ data: { name: 'E' } });
  const sectionF = await prisma.section.create({ data: { name: 'F' } });
  const sectionG = await prisma.section.create({ data: { name: 'G' } });
  console.log('Sections created');

  // Create Subjects
  const subjects = [
    'English', 'Hindi', 'Sanskrit', 'Mathematics',
    'Computer', 'Political Science', 'Geography', 'Economics',
    'Physics', 'Chemistry', 'Biology'
  ];
  const subjectRecords = [];
  for (const subjectName of subjects) {
    const subj = await prisma.subject.create({ data: { name: subjectName } });
    subjectRecords.push(subj);
  }
  console.log('Subjects created');

  // Get subjects by name
  const englishSubj = subjectRecords.find(s => s.name === 'English');
  const mathsSubj = subjectRecords.find(s => s.name === 'Mathematics');
  const physicsSubj = subjectRecords.find(s => s.name === 'Physics');

  // Create Teachers
  const teacher1 = await prisma.teacher.create({
    data: {
      name: 'Mr. Sunny',
      subjectId: englishSubj.id
    }
  });
  const teacher2 = await prisma.teacher.create({
    data: {
      name: 'Shivani',
      subjectId: mathsSubj.id
    }
  });
  const teacher3 = await prisma.teacher.create({
    data: {
      name: 'Akash',
      subjectId: physicsSubj.id
    }
  });
  console.log('Teachers created');

  // Create Teacher Assignments
  // Mr. Sunny teaches Class 9 (A, B) and Class 10 (A, B)
  for (const classId of [class9.id, class10.id]) {
    for (const sectionId of [sectionA.id, sectionB.id]) {
      await prisma.teacherAssignment.create({
        data: {
          teacherId: teacher1.id,
          classId,
          sectionId
        }
      });
    }
  }

  // Shivani teaches Class 9 all sections
  for (const sectionId of [sectionA.id, sectionB.id, sectionC.id, sectionD.id, sectionE.id, sectionF.id, sectionG.id]) {
    await prisma.teacherAssignment.create({
      data: {
        teacherId: teacher2.id,
        classId: class9.id,
        sectionId
      }
    });
  }

  // Akash teaches Class 9, Section A
  await prisma.teacherAssignment.create({
    data: {
      teacherId: teacher3.id,
      classId: class9.id,
      sectionId: sectionA.id
    }
  });
  console.log('Teacher assignments created');

  // Create Posts
  const today = new Date();

  await prisma.post.create({
    data: {
      title: 'Chapter 1: The Sentence',
      content: 'Complete exercises 1-5 from the textbook. Focus on sentence structure and punctuation.',
      type: 'Homework',
      date: today,
      teacherId: teacher1.id,
      classId: class9.id,
      sectionId: sectionA.id,
      subjectId: englishSubj.id
    }
  });

  await prisma.post.create({
    data: {
      title: 'Algebra Basics',
      content: 'Practice problems from pages 45-50. Include linear equations and polynomials.',
      type: 'Homework',
      date: today,
      teacherId: teacher2.id,
      classId: class9.id,
      sectionId: sectionA.id,
      subjectId: mathsSubj.id
    }
  });

  await prisma.post.create({
    data: {
      title: 'Physics Lab Safety',
      content: 'Read chapter 1 thoroughly. Prepare for practical experiments next week.',
      type: 'Classwork',
      date: today,
      teacherId: teacher3.id,
      classId: class9.id,
      sectionId: sectionA.id,
      subjectId: physicsSubj.id
    }
  });
  console.log('Posts created');

  console.log('✅ Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
