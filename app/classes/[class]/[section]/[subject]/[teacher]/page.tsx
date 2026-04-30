'use client';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Sparkles, 
  Zap, 
  Star,
  Smile
} from 'lucide-react';
import { useState, useEffect } from 'react';

const dateEmojis = ['📅', '🎯', '🌟', '✨', '💫', '🎪', '🌈', '🚀'];
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function TeacherPage() {
  const router = useRouter();
  const params = useParams();
  const [dates, setDates] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, classesRes, sectionsRes, subjectsRes, teachersRes] = await Promise.all([
          fetch(`/api/posts?teacherId=${params.teacher}&classId=${params.class}&sectionId=${params.section}&subjectId=${params.subject}`),
          fetch('/api/classes'),
          fetch('/api/sections'),
          fetch('/api/subjects'),
          fetch('/api/teachers')
        ]);
        const postsData = await postsRes.json();
        const classesData = await classesRes.json();
        const sectionsData = await sectionsRes.json();
        const subjectsData = await subjectsRes.json();
        const teachersData = await teachersRes.json();

        const uniqueDates = [...new Set(postsData.map((post: any) => post.date))];
        setDates(uniqueDates.sort().reverse());
        setSelectedClass(classesData.find((c: any) => c.id === params.class));
        setSelectedSection(sectionsData.find((s: any) => s.id === params.section));
        setSelectedSubject(subjectsData.find((s: any) => s.id === params.subject));
        setSelectedTeacher(teachersData.find((t: any) => t.id === params.teacher));
      } catch (error) {
        console.error(error);
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
          <h1 className="font-bold text-gray-800 text-xl">Select Date</h1>
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
          <p className="text-gray-500 mt-2">{selectedTeacher?.name}</p>
        </motion.div>

        <div className="space-y-4">
          {dates.length > 0 ? (
            dates.map((date, i) => {
              const d = new Date(date);
              const dayName = weekDays[d.getDay()];
              const monthName = months[d.getMonth()];
              const day = d.getDate();
              const year = d.getFullYear();
              const emoji = dateEmojis[i % dateEmojis.length];
              
              return (
                <motion.div
                  key={date}
                  initial={{ y: 50, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.05, x: 8 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/classes/${params.class}/${params.section}/${params.subject}/${params.teacher}/${date}`)}
                  className="relative overflow-hidden rounded-3xl cursor-pointer shadow-xl"
                >
                  <div className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 p-6 text-white">
                    <div className="absolute -right-12 -top-12 opacity-20">
                      <Calendar size={160} />
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="text-4xl animate-bounce">{emoji}</span>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-3xl font-black mb-1">{dayName}</h3>
                          <p className="text-white/90 text-xl font-semibold">
                            {monthName} {day}, {year}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/30">
                            <span className="text-3xl font-black">{day}</span>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
                            <ArrowLeft size={20} className="text-white rotate-180" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-5 pt-4 border-t border-white/30 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/90 font-semibold">
                          <Zap size={18} />
                          <span>Ready for Learning!</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star size={16} className="fill-yellow-300 text-yellow-300" />
                          <Star size={16} className="fill-yellow-300 text-yellow-300" />
                          <Star size={16} className="fill-yellow-300 text-yellow-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 pointer-events-none" />
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 glass rounded-3xl p-8 border-2 border-dashed border-gray-200"
            >
              <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Posts Yet!</h3>
              <p className="text-gray-500">Check back later for updates</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
