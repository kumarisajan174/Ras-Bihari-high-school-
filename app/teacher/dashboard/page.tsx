'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  LogOut,
  Plus,
  BookOpen,
  FileText,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react'

export default function TeacherDashboardPage() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedTeacher = localStorage.getItem('teacher')
    if (!savedTeacher) {
      router.push('/teacher/login')
      return
    }
    const parsedTeacher = JSON.parse(savedTeacher)
    setTeacher(parsedTeacher)
    fetchTeacherPosts(parsedTeacher.id)
  }, [])

  async function fetchTeacherPosts(teacherId: string) {
    try {
      const res = await fetch(`/api/teacher/posts?teacherId=${teacherId}`)
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('teacher')
    router.push('/teacher/login')
  }

  async function deletePost(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await fetch('/api/teacher/posts', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, teacherId: teacher?.id })
        })
        fetchTeacherPosts(teacher?.id)
      } catch (error) {
        console.error(error)
      }
    }
  }

  if (!teacher && !loading) {
    return null
  }

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-lg">Teacher Dashboard</h1>
          <button onClick={handleLogout} className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {teacher && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass rounded-2xl p-6 shadow-lg border border-white/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-3xl">
                {teacher.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-xl">Hello, {teacher.name}!</h2>
                <p className="text-sm text-pink-600 font-medium">{teacher.subject?.name}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-bold text-gray-800 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push('/teacher/dashboard/add')}
              className="glass rounded-2xl p-4 text-left shadow-lg border border-white/30"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white mb-2">
                <Plus size={20} />
              </div>
              <h4 className="font-bold text-gray-800">Add Content</h4>
              <p className="text-xs text-gray-500">Homework / Classwork</p>
            </button>
          </div>
        </motion.div>

        {teacher && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar size={18} />
              Assigned Classes
            </h3>
            <div className="flex flex-wrap gap-2">
              {teacher.assignments?.map((a: any, i: number) => (
                <span
                  key={i}
                  className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl font-bold text-sm"
                >
                  {a.class?.name}{a.section?.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-bold text-gray-800 mb-3">Your Recent Posts</h3>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="glass rounded-2xl p-4 h-24 animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No posts yet. Add your first one!</p>
          ) : (
            <div className="space-y-3">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-4 shadow-lg border border-white/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                          post.type === 'Homework'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {post.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800">{post.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                    </div>
                    <div className="flex flex-col gap-1 ml-3">
                      <button
                        onClick={() => router.push(`/teacher/dashboard/edit/${post.id}`)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}