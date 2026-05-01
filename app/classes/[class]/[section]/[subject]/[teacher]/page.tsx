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
  Smile,
  BookOpen,
  FileText
} from 'lucide-react';
import { useState, useEffect } from 'react';

const dateEmojis = ['📅', '🎯', '🌟', '✨', '💫', '🎪', '🌈', '🚀'];
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatDateLabel(dateStr: string): { dayName: string; monthName: string; day: number; year: number; isToday: boolean; isYesterday: boolean } {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  const isToday = dateOnly.getTime() === today.getTime();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = dateOnly.getTime() === yesterday.getTime();
  
  const dayName = weekDays[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return { dayName, monthName, day, year, isToday, isYesterday };
}

export default function TeacherPage() {
  const router = useRouter();
  const params = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const className = decodeURIComponent(params.class as string);
        const sectionName = decodeURIComponent(params.section as string);
        const subjectName = decodeURIComponent(params.subject as string);
        const teacherName = decodeURIComponent(params.teacher as string);

        const postsRes = await fetch('/api/posts');
        const postsData = await postsRes.json();
        
        const filteredPosts = postsData.filter((post: any) => {
          const teacherMatch = post.teacher?.name === teacherName;
          const classMatch = post.class?.name === className;
          const sectionMatch = post.section?.name === sectionName;
          const subjectMatch = post.subject?.name === subjectName;
          return teacherMatch && classMatch && sectionMatch && subjectMatch;
        });
        
        setPosts(filteredPosts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

  const datesMap = new Map<string, { homework: number; classwork: number; posts: any[] }>();
  posts.forEach(post => {
    const dateKey = post.date.split('T')[0];
    if (!datesMap.has(dateKey)) {
      datesMap.set(dateKey, { homework: 0, classwork: 0, posts: [] });
    }
    const entry = datesMap.get(dateKey)!;
    entry.posts.push(post);
    if (post.type === 'Homework') entry.homework++;
    else if (post.type === 'Classwork') entry.classwork++;
  });

  const sortedDates = Array.from(datesMap.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

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
            {decodeURIComponent(params.class as string)} - Section {decodeURIComponent(params.section as string)}
          </h2>
          <p className="text-indigo-600 font-semibold mt-1">{decodeURIComponent(params.subject as string)}</p>
          <p className="text-gray-500 mt-2">{decodeURIComponent(params.teacher as string)}</p>
        </motion.div>

        <div className="space-y-4">
          {sortedDates.length > 0 ? (
            sortedDates.map((dateStr, i) => {
              const { dayName, monthName, day, year, isToday, isYesterday } = formatDateLabel(dateStr);
              const dateInfo = datesMap.get(dateStr)!;
              const emoji = dateEmojis[i % dateEmojis.length];
              
              return (
                <motion.div
                  key={dateStr}
                  initial={{ y: 50, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.05, x: 8 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/classes/${params.class}/${params.section}/${params.subject}/${params.teacher}/${dateStr}`)}
                  className="relative overflow-hidden rounded-3xl cursor-pointer shadow-xl"
                >
                  <div className={`p-6 text-white ${isToday ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'}`}>
                    <div className="absolute -right-12 -top-12 opacity-20">
                      <Calendar size={160} />
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="text-4xl animate-bounce">{emoji}</span>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {isToday && <span className="px-2 py-1 bg-white/30 rounded-full text-xs font-bold">TODAY</span>}
                            {isYesterday && <span className="px-2 py-1 bg-white/30 rounded-full text-xs font-bold">YESTERDAY</span>}
                          </div>
                          <h3 className="text-3xl font-black mb-1">{isToday ? 'Today' : isYesterday ? 'Yesterday' : dayName}</h3>
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
                        <div className="flex items-center gap-4">
                          {dateInfo.homework > 0 && (
                            <div className="flex items-center gap-2 text-white/90 font-semibold">
                              <BookOpen size={18} />
                              <span>📘 {dateInfo.homework} Homework</span>
                            </div>
                          )}
                          {dateInfo.classwork > 0 && (
                            <div className="flex items-center gap-2 text-white/90 font-semibold">
                              <FileText size={18} />
                              <span>📗 {dateInfo.classwork} Classwork</span>
                            </div>
                          )}
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
