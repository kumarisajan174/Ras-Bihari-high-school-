'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react'

export default function ManagePosts() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const res = await fetch('/api/admin/posts')
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error(error)
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
      } catch (error) {
        console.error(error)
      }
    }
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
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No posts yet</p>
        ) : (
          posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 shadow-lg border border-white/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    {post.type}
                  </span>
                  <h3 className="font-bold text-gray-800 mt-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="p-2 rounded-lg bg-red-100 text-red-600">
                    <Trash2 size={16} onClick={() => deletePost(post.id)} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </main>
    </div>
  )
}
