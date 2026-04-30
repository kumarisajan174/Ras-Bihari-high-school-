'use client';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  FileText, 
  BookOpen, 
  School,
  Sparkles,
  Rocket,
  Star,
  Heart
} from 'lucide-react';
import { useState, useEffect } from 'react';

const homeworkEmojis = ['📚', '✏️', '📝', '📖', '🎯'];
const classworkEmojis = ['✨', '🎨', '🌟', '💡', '🎭'];
const noticeEmojis = ['📢', '📌', '🔔', '⭐', '💬'];

export default function DatePage() {
  const router = useRouter();
  const params = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [subject, setSubject] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, subjectsRes, teachersRes] = await Promise.all([
          fetch(`/api/posts?teacherId=${params.teacher}&classId=${params.class}&sectionId=${params.section}&subjectId=${params.subject}&date=${params.date}`),
          fetch('/api/subjects'),
          fetch('/api/teachers')
        ]);
        const postsData = await postsRes.json();
        const subjectsData = await subjectsRes.json();
        const teachersData = await teachersRes.json();

        setPosts(postsData);
        setSubject(subjectsData.find((s: any) => s.id === params.subject));
        setTeacher(teachersData.find((t: any) => t.id === params.teacher));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

  const homeworkPosts = posts.filter(p => p.type === 'Homework');
  const classworkPosts = posts.filter(p => p.type === 'Classwork');
  const noticePosts = posts.filter(p => p.type === 'Notice');

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
          <h1 className="font-bold text-gray-800 text-xl">Posts</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6 space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800">
            {new Date(params.date as string).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h2>
          <p className="text-gray-500 mt-2">{subject?.name} - {teacher?.name}</p>
        </motion.div>

        {/* Homework Section */}
        {homeworkPosts.length > 0 && (
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <BookOpen size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                📘 Homework
              </h3>
            </div>
            
            <div className="space-y-3">
              {homeworkPosts.map((post, i) => {
                const emoji = homeworkEmojis[i % homeworkEmojis.length];
                return (
                  <motion.div
                    key={post.id}
                    initial={{ x: -30, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 + 0.15 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push(`/classes/${params.class}/${params.section}/${params.subject}/${params.teacher}/${params.date}/${post.id}`)}
                    className="relative overflow-hidden rounded-2xl cursor-pointer shadow-xl"
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 border-2 border-blue-200">
                      <div className="absolute top-4 right-4">
                        <span className="text-2xl">{emoji}</span>
                      </div>
                      
                      <div className="relative z-10">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h4>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                            <Star size={14} className="fill-blue-500" />
                            <span>Important!</span>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                            <ArrowLeft size={18} className="text-white rotate-180" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Classwork Section */}
        {classworkPosts.length > 0 && (
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shadow-lg">
                <School size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                📗 Classwork
              </h3>
            </div>
            
            <div className="space-y-3">
              {classworkPosts.map((post, i) => {
                const emoji = classworkEmojis[i % classworkEmojis.length];
                return (
                  <motion.div
                    key={post.id}
                    initial={{ x: -30, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 + 0.35 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push(`/classes/${params.class}/${params.section}/${params.subject}/${params.teacher}/${params.date}/${post.id}`)}
                    className="relative overflow-hidden rounded-2xl cursor-pointer shadow-xl"
                  >
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 border-2 border-purple-200">
                      <div className="absolute top-4 right-4">
                        <span className="text-2xl">{emoji}</span>
                      </div>
                      
                      <div className="relative z-10">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h4>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm">
                            <Sparkles size={14} />
                            <span>Great Work!</span>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                            <ArrowLeft size={18} className="text-white rotate-180" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Notice Section */}
        {noticePosts.length > 0 && (
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg">
                <FileText size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                📜 Notice
              </h3>
            </div>
            
            <div className="space-y-3">
              {noticePosts.map((post, i) => {
                const emoji = noticeEmojis[i % noticeEmojis.length];
                return (
                  <motion.div
                    key={post.id}
                    initial={{ x: -30, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 + 0.55 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push(`/classes/${params.class}/${params.section}/${params.subject}/${params.teacher}/${params.date}/${post.id}`)}
                    className="relative overflow-hidden rounded-2xl cursor-pointer shadow-xl"
                  >
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 border-2 border-amber-200">
                      <div className="absolute top-4 right-4">
                        <span className="text-2xl">{emoji}</span>
                      </div>
                      
                      <div className="relative z-10">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h4>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm">
                            <Heart size={14} className="fill-amber-500" />
                            <span>Read Carefully!</span>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
                            <ArrowLeft size={18} className="text-white rotate-180" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 glass rounded-3xl p-8 border-2 border-dashed border-gray-200"
          >
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No Posts Yet!</h3>
            <p className="text-gray-500">No homework or classwork for this date</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
