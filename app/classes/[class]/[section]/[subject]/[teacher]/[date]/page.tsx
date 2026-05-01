'use client';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  BookOpen,
  School,
  Sparkles,
  Star,
  Heart
} from 'lucide-react';
import { useState, useEffect } from 'react';

const homeworkEmojis = ['📚', '✏️', '📝', '📖', '🎯'];
const classworkEmojis = ['✨', '🎨', '🌟', '💡', '🎭'];

export default function DatePage() {
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
        const dateStr = params.date as string;

        const postsRes = await fetch('/api/posts');
        const postsData = await postsRes.json();

        const filteredPosts = postsData.filter((post: any) => {
          const teacherMatch = post.teacher?.name === teacherName;
          const classMatch = post.class?.name === className;
          const sectionMatch = post.section?.name === sectionName;
          const subjectMatch = post.subject?.name === subjectName;
          const postDate = post.date.split('T')[0];
          const dateMatch = postDate === dateStr;
          return teacherMatch && classMatch && sectionMatch && subjectMatch && dateMatch;
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

  const homeworkPosts = posts.filter(p => p.type === 'Homework');
  const classworkPosts = posts.filter(p => p.type === 'Classwork');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const formattedDate = new Date(params.date as string).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-xl">Content</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6 space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-xl font-bold text-gray-800">{formattedDate}</h2>
          <p className="text-indigo-600 font-semibold mt-1">
            {decodeURIComponent(params.subject as string)} - {decodeURIComponent(params.teacher as string)}
          </p>
        </motion.div>

        {/* Homework Section */}
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

          {homeworkPosts.length > 0 ? (
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
                            <span>Tap to open</span>
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
          ) : (
            <div className="text-center py-8 glass rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50">
              <BookOpen size={48} className="mx-auto text-blue-300 mb-3" />
              <p className="text-blue-500 font-medium">No homework for this date</p>
            </div>
          )}
        </motion.div>

        {/* Classwork Section */}
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

          {classworkPosts.length > 0 ? (
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
                            <span>Tap to open</span>
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
          ) : (
            <div className="text-center py-8 glass rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50">
              <School size={48} className="mx-auto text-purple-300 mb-3" />
              <p className="text-purple-500 font-medium">No classwork for this date</p>
            </div>
          )}
        </motion.div>

        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 glass rounded-3xl p-8 border-2 border-dashed border-gray-200"
          >
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No Content Yet!</h3>
            <p className="text-gray-500">No homework or classwork for this date</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}