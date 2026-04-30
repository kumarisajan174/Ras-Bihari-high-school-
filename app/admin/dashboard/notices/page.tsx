'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Star, Pin, Plus, Search, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ManageNotices() {
  const router = useRouter()
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices')
      const data = await res.json()
      setNotices(data)
    } catch (error) {
      console.error('Error fetching notices:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleImportant = async (id: string, currentValue: boolean) => {
    try {
      const notice = notices.find((n) => n.id === id)
      if (!notice) return

      await fetch(`/api/notices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...notice, isImportant: !currentValue })
      })
      await fetchNotices()
    } catch (error) {
      console.error('Error updating notice:', error)
    }
  }

  const togglePinned = async (id: string, currentValue: boolean) => {
    try {
      const notice = notices.find((n) => n.id === id)
      if (!notice) return

      await fetch(`/api/notices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...notice, isPinned: !currentValue })
      })
      await fetchNotices()
    } catch (error) {
      console.error('Error updating notice:', error)
    }
  }

  const deleteNotice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return

    try {
      setDeleting(id)
      await fetch(`/api/notices/${id}`, {
        method: 'DELETE'
      })
      await fetchNotices()
    } catch (error) {
      console.error('Error deleting notice:', error)
    } finally {
      setDeleting(null)
    }
  }

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(search.toLowerCase()) ||
      notice.content.toLowerCase().includes(search.toLowerCase()) ||
      notice.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/admin/dashboard')} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-xl">Manage Notices</h1>
          <button onClick={() => router.push('/admin/dashboard/notices/add')} className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 hover:scale-105 transition-transform">
            <Plus size={24} className="text-white" />
          </button>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Search */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-2xl p-4 shadow-lg border border-white/30"
        >
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-700"
            />
          </div>
        </motion.div>

        {/* Notices List */}
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                className="h-40 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl"
              />
            ))
          ) : filteredNotices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 glass rounded-3xl p-8 border border-white/30"
            >
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                {search ? 'No matching notices' : 'No notices yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {search ? 'Try a different search term' : 'Create your first notice!'}
              </p>
              <button
                onClick={() => router.push('/admin/dashboard/notices/add')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
              >
                Add Notice
              </button>
            </motion.div>
          ) : (
            filteredNotices.map((notice, i) => (
              <motion.div
                key={notice.id}
                initial={{ x: -40, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
                className={`glass rounded-2xl p-5 shadow-lg border-2 ${
                  notice.isImportant ? 'border-red-200 bg-gradient-to-r from-red-50/80 to-pink-50/80' : 'border-white/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-lg">{
                        notice.type === 'Exam' ? '🔴' :
                        notice.type === 'Holiday' ? '🟢' :
                        notice.type === 'Important' ? '🟡' :
                        notice.type === 'Internship' ? '🔵' : '📢'
                      }</span>
                      <h3 className="font-bold text-gray-800 text-lg truncate">{notice.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{notice.content}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 px-2 py-1 bg-white/50 rounded-full">
                      {notice.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(notice.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePinned(notice.id, notice.isPinned)}
                      className={`p-2 rounded-lg transition-all ${
                        notice.isPinned
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title="Pin/Unpin"
                    >
                      <Pin size={18} />
                    </button>
                    <button
                      onClick={() => toggleImportant(notice.id, notice.isImportant)}
                      className={`p-2 rounded-lg transition-all ${
                        notice.isImportant
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title="Mark Important"
                    >
                      <Star size={18} />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/dashboard/notices/edit/${notice.id}`)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteNotice(notice.id)}
                      disabled={deleting === notice.id}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === notice.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
