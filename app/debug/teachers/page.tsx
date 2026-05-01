'use client';
import { useState, useEffect } from 'react';

export default function DebugTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/teachers');
        const data = await res.json();
        setTeachers(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Debug: All Teachers in Database</h1>

      <div className="space-y-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-blue-600">{teacher.name}</h2>
            <p className="text-gray-600">ID: {teacher.id}</p>
            <p className="text-gray-600">Subject: {teacher.subject?.name} (ID: {teacher.subjectId})</p>

            <div className="mt-4 p-4 bg-yellow-50 rounded">
              <h3 className="font-bold text-yellow-700">Assignments:</h3>
              {teacher.assignments?.length > 0 ? (
                <ul className="list-disc pl-5">
                  {teacher.assignments.map((a: any, i: number) => (
                    <li key={i}>
                      Class ID: {a.classId} → {a.class?.name} | Section ID: {a.sectionId} → {a.section?.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-500">NO ASSIGNMENTS!</p>
              )}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded">
              <h3 className="font-bold text-blue-700">Raw Assignment Data:</h3>
              <pre className="text-xs bg-gray-800 text-green-400 p-2 rounded overflow-auto">
                {JSON.stringify(teacher.assignments, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {teachers.length === 0 && (
        <p className="text-red-500 text-xl">No teachers found in database!</p>
      )}
    </div>
  );
}