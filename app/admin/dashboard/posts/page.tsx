'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Edit, Trash2, X, ChevronLeft, Building, Users, BookOpen } from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  type: string
  date: string
  class?: { name: string }
  section?: { name: string }
  subject?: { name: string }
  teacher?: { name: string }
}

export default function ManagePosts() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const res = await fetch('/api/admin/posts')
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function deletePost(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await fetch('/api/admin/posts', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        })
        fetchPosts()
        setSelectedPost(null)
      } catch (error) {
        console.error(error)
      }
    }
  }

  if (selectedPost) {
    return (
      <div className="min-h-screen pb-6">
        <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <button onClick={() => setSelectedPost(null)} className="p-2 rounded-xl bg-white/80 hover:bg-white">
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="font-bold text-gray-800 text-lg">Post Details</h1>
            <button onClick={() => deletePost(selectedPost.id)} className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200">
              <Trash2 size={20} />
            </button>
          </div>
        </nav>

        <main className="max-w-md mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30 space-y-4"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                selectedPost.type === 'Homework' 
                  ? 'bg-blue-100 text-blue-700' 
                  : selectedPost.type === 'Classwork' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {selectedPost.type}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(selectedPost.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-800">{selectedPost.title}</h2>

            <div className="flex flex-wrap gap-2">
              {selectedPost.class?.name && (
                <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                  <Building size={12} />
                  Class {selectedPost.class.name}
                </div>
              )}
              {selectedPost.section?.name && (
                <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  <Users size={12} />
                  Section {selectedPost.section.name}
                </div>
              )}
              {selectedPost.subject?.name && (
                <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                  <BookOpen size={12} />
                  {selectedPost.subject.name}
                </div>
              )}
              {selectedPost.teacher?.name && (
                <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-700">
                  {selectedPost.teacher.name}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-gray-800 mb-2">Content:</h3>
              <div className="text-sm text-gray-600 whitespace-pre-wrap">
                {selectedPost.content.split('---PAGE BREAK---').map((page, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Page {index + 1}</p>
                    <p className="bg-gray-50 rounded-lg p-3">{page.trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/admin/dashboard')} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-lg">Manage Posts</h1>
          <button onClick={() => router.push('/admin/dashboard/posts/add')} className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <Plus size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 py-12">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No posts yet</p>
        ) : (
          posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedPost(post)}
              className="glass rounded-2xl p-5 shadow-lg border border-white/30 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      post.type === 'Homework' 
                        ? 'bg-blue-100 text-blue-700' 
                        : post.type === 'Classwork' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                    {post.class?.name && (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                        Class {post.class.name}
                      </span>
                    )}
                    {post.section?.name && (
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                        Section {post.section.name}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800">{post.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    deletePost(post.id)
                  }}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </main>
    </div>
  )
}
