const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function check() {
  console.log('=== Teachers with assignments ===');
  const teachers = await p.teacher.findMany({
    where: {
      name: { in: ['Mr. Sunny', 'sunn'] }
    },
    include: {
      subject: true,
      assignments: {
        include: {
          class: true,
          section: true
        }
      }
    }
  });

  console.log('Teachers found:', teachers.length);
  teachers.forEach(t => {
    console.log(`\nTeacher: ${t.name}`);
    console.log(`Subject: ${t.subject?.name}`);
    console.log(`Assignments:`, t.assignments.map(a => `${a.class.name} - ${a.section.name}`));
  });

  // Check specific assignment
  const class9 = await p.class.findUnique({ where: { name: '9' } });
  const sectionA = await p.section.findFirst({ where: { name: 'A' } });
  const english = await p.subject.findUnique({ where: { name: 'English' } });

  console.log('\n=== Looking for assignment ===');
  console.log('Class 9 ID:', class9?.id);
  console.log('Section A ID:', sectionA?.id);
  console.log('English ID:', english?.id);

  const assignment = await p.assignment.findFirst({
    where: {
      classId: class9?.id,
      sectionId: sectionA?.id
    }
  });
  console.log('Assignment exists:', !!assignment);

  await p.$disconnect();
}

check();