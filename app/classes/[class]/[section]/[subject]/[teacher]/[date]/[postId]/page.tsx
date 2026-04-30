'use client';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  FileText, 
  BookOpen, 
  School, 
  User, 
  Calendar,
  Sparkles,
  Star,
  Heart
} from 'lucide-react';
import { useState, useEffect } from 'react';

const typeConfig = {
  Homework: { 
    color: 'from-blue-500 to-cyan-500', 
    textColor: 'text-blue-600', 
    bgColor: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
    icon: BookOpen,
    emoji: '📘',
    tagline: 'Time to Study!'
  },
  Classwork: { 
    color: 'from-purple-500 to-pink-500', 
    textColor: 'text-purple-600', 
    bgColor: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    icon: School,
    emoji: '📗',
    tagline: 'Great Work!'
  },
  Notice: { 
    color: 'from-amber-500 to-orange-500', 
    textColor: 'text-amber-600', 
    bgColor: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    icon: FileText,
    emoji: '📜',
    tagline: 'Important Notice!'
  }
};

export default function PostDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [subject, setSubject] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const postsRes = await fetch('/api/posts');
        const subjectsRes = await fetch('/api/subjects');
        const teachersRes = await fetch('/api/teachers');
        const postsData = await postsRes.json();
        const subjectsData = await subjectsRes.json();
        const teachersData = await teachersRes.json();

        const foundPost = postsData.find((p: any) => p.id === params.postId);
        setPost(foundPost);
        setSubject(subjectsData.find((s: any) => s.id === foundPost?.subjectId));
        setTeacher(teachersData.find((t: any) => t.id === foundPost?.teacherId));
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

  const config = typeConfig[post?.type as keyof typeof typeConfig] || typeConfig.Notice;
  const Icon = config.icon;

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-xl">Details</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6">
        {post && (
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative overflow-hidden rounded-3xl shadow-2xl"
          >
            {/* Header Banner */}
            <div className={`bg-gradient-to-br ${config.color} p-6 text-white`}>
              <div className="absolute -right-16 -top-16 opacity-20">
                <Icon size={200} />
              </div>
              <div className="absolute top-4 right-4">
                <span className="text-5xl animate-bounce">{config.emoji}</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center shadow-xl">
                    <Icon size={32} className="text-white" />
                  </div>
                  <span className="text-sm font-bold px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    {post.type}
                  </span>
                </div>
                <h2 className="text-3xl font-black mb-2 leading-tight">{post.title}</h2>
                <p className="text-white/90 font-semibold">{config.tagline}</p>
              </div>
            </div>

            {/* Info Section */}
            <div className={`bg-gradient-to-br ${config.bgColor} p-6 border-2 ${config.borderColor}`}>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm border border-white/30">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Teacher</p>
                    <p className="text-lg font-bold text-gray-800">{teacher?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm border border-white/30">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Subject</p>
                    <p className="text-lg font-bold text-gray-800">{subject?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm border border-white/30">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Calendar size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Date</p>
                    <p className="text-lg font-bold text-gray-800">
                      {new Date(post.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                  <Sparkles size={18} className={config.textColor} />
                  <h3 className={`text-lg font-bold ${config.textColor}`}>Content</h3>
                </div>
                <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Heart size={16} className="fill-pink-500 text-pink-500" />
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <Sparkles size={16} className="text-cyan-500" />
                </div>
                <button
                  onClick={() => router.back()}
                  className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${config.color} text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all`}
                >
                  Done! ✨
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
