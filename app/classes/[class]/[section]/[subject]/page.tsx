'use client';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Sparkles,
  Heart,
  Star,
  Award,
  TrendingUp,
  Smile
} from 'lucide-react';
import { useState, useEffect } from 'react';

const teacherEmojis = ['✨', '🎯', '🌟', '🎨', '📚', '💡', '🎪', '🎵', '🚀', '🌈'];

export default function SubjectPage() {
  const router = useRouter();
  const params = useParams();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const className = params.class as string;
        const sectionName = params.section as string;
        const subjectName = params.subject as string;

        const [teachersRes, classesRes, sectionsRes, subjectsRes] = await Promise.all([
          fetch(`/api/teachers?class=${className}&section=${sectionName}&subject=${subjectName}`),
          fetch('/api/classes'),
          fetch('/api/sections'),
          fetch('/api/subjects')
        ]);
        const teachersData = await teachersRes.json();
        const classesData = await classesRes.json();
        const sectionsData = await sectionsRes.json();
        const subjectsData = await subjectsRes.json();

        setTeachers(Array.isArray(teachersData) ? teachersData : []);
        setSelectedClass(classesData.find((c: any) => c.name === params.class));
        setSelectedSection(sectionsData.find((s: any) => s.name === params.section));
        setSelectedSubject(subjectsData.find((s: any) => s.name === params.subject));
      } catch (error) {
        console.error(error);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-xl">Select Teacher</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedClass ? `Class ${selectedClass.name}` : ''}
            {selectedClass && selectedSection ? ' - ' : ''}
            {selectedSection ? `Section ${selectedSection.name}` : ''}
          </h2>
          <p className="text-indigo-600 font-semibold mt-1">{selectedSubject?.name}</p>
          <p className="text-gray-500 mt-2">Choose your teacher</p>
        </motion.div>

        {teachers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Teacher Assigned</h3>
            <p className="text-gray-500">No teacher is assigned for this subject in this class and section.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {teachers.map((teacher, i) => {
              const emoji = teacherEmojis[i % teacherEmojis.length];
              return (
                <motion.div
                  key={teacher.id}
                  initial={{ scale: 0, opacity: 0, rotate: -5 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 400, damping: 15 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/classes/${params.class}/${params.section}/${params.subject}/${teacher.id}`)}
                  className="relative overflow-hidden rounded-3xl cursor-pointer shadow-2xl"
                >
                  <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 border-2 border-indigo-100">
                    <div className="absolute top-4 right-4">
                      <span className="text-3xl animate-bounce">{emoji}</span>
                    </div>

                    <div className="relative z-10 flex items-center gap-5">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center shadow-xl border-4 border-white">
                          <User size={42} className="text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                          <Star size={14} className="text-white fill-yellow-300" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {teacher.name}
                        </h3>
                        <div className="mt-2 flex items-center gap-2 text-gray-600 font-medium">
                          <Smile size={16} />
                          <span>Your Favorite Teacher!</span>
                        </div>
                        <div className="mt-2 flex gap-1">
                          {[...Array(5)].map((_, starI) => (
                            <Star
                              key={starI}
                              size={14}
                              className="text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center shadow-lg">
                          <ArrowLeft size={24} className="text-white rotate-180" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-indigo-100">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <Heart size={14} className="fill-indigo-500" />
                          <span className="font-semibold">Loved by students</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-600">
                          <Award size={14} />
                          <span className="font-semibold">Best Teacher</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}