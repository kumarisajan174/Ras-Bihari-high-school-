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
  Heart,
  ChevronLeft,
  ChevronRight,
  BookMarked
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

interface ContentPage {
  title: string;
  content: string;
}

export default function PostDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const postsRes = await fetch('/api/posts');
        const postsData = await postsRes.json();
        const foundPost = postsData.find((p: any) => p.id === params.postId);
        setPost(foundPost);
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

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Post not found</p>
      </div>
    );
  }

  const config = typeConfig[post?.type as keyof typeof typeConfig] || typeConfig.Notice;
  const Icon = config.icon;

  const contentPages: ContentPage[] = post.contentPages && Array.isArray(post.contentPages)
    ? post.contentPages
    : [{ title: 'Complete Content', content: post.content }];

  const totalPages = contentPages.length;
  const currentContent = contentPages[currentPage] || { title: '', content: '' };

  function goToPrevPage() {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  }

  function goToNextPage() {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  }

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

      <main className="max-w-md mx-auto px-4 py-6">
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
                  <p className="text-lg font-bold text-gray-800">{post.teacher?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm border border-white/30">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Subject</p>
                  <p className="text-lg font-bold text-gray-800">{post.subject?.name}</p>
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

            {/* Content with Pages */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <BookMarked size={18} className={config.textColor} />
                <h3 className={`text-lg font-bold ${config.textColor}`}>{currentContent.title || `Page ${currentPage + 1}`}</h3>
              </div>

              <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap min-h-[200px]">
                {currentContent.content}
              </div>

              {/* Multi-page Navigation */}
              {totalPages > 1 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                        currentPage === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : `bg-gradient-to-r ${config.color} text-white`
                      }`}
                    >
                      <ChevronLeft size={18} /> Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page - 1)}
                          className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${
                            currentPage === page - 1
                              ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages - 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                        currentPage === totalPages - 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : `bg-gradient-to-r ${config.color} text-white`
                      }`}
                    >
                      Next <ChevronRight size={18} />
                    </button>
                  </div>
                  <div className="bg-white/50 rounded-xl p-3 text-center">
                    <p className="text-sm text-gray-600 font-medium">
                      Page {currentPage + 1} of {totalPages}
                    </p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${config.color} transition-all`}
                        style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
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
      </main>
    </div>
  );
}