'use client'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Calendar, BookOpen, AlertTriangle, Star, Megaphone } from 'lucide-react'
import { useState, useEffect } from 'react'

const noticeTypes = [
  { value: 'General', label: '📢 General', icon: Megaphone },
  { value: 'Holiday', label: '🟢 Holiday', icon: Calendar },
  { value: 'Exam', label: '🔴 Exam', icon: AlertTriangle },
  { value: 'Important', label: '🟡 Important', icon: Star },
  { value: 'Internship', label: '🔵 Internship', icon: BookOpen },
]

export default function EditNotice() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'General',
    date: new Date().toISOString().split('T')[0],
    isImportant: false,
    isPinned: false
  })

  useEffect(() => {
    fetchNotice()
  }, [params.id])

  const fetchNotice = async () => {
    try {
      const res = await fetch('/api/notices')
      const notices = await res.json()
      const notice = notices.find((n: any) => n.id === params.id)
      if (notice) {
        setFormData({
          title: notice.title,
          content: notice.content,
          type: notice.type,
          date: new Date(notice.date).toISOString().split('T')[0],
          isImportant: notice.isImportant,
          isPinned: notice.isPinned
        })
      }
    } catch (error) {
      console.error('Error fetching notice:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch(`/api/notices/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      router.push('/admin/dashboard/notices')
    } catch (error) {
      console.error('Error updating notice:', error)
      alert('Failed to update notice')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/admin/dashboard/notices')} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-xl">Edit Notice</h1>
          <div className="w-10" />
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6">
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Title */}
          <div className="glass rounded-2xl p-5 shadow-lg border border-white/30">
            <label className="block text-sm font-bold text-gray-700 mb-2">Notice Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:border-orange-400 focus:outline-none text-gray-800"
              placeholder="Enter notice title..."
            />
          </div>

          {/* Content */}
          <div className="glass rounded-2xl p-5 shadow-lg border border-white/30">
            <label className="block text-sm font-bold text-gray-700 mb-2">Notice Content</label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:border-orange-400 focus:outline-none text-gray-800 resize-none"
              placeholder="Enter notice content..."
            />
          </div>

          {/* Type */}
          <div className="glass rounded-2xl p-5 shadow-lg border border-white/30">
            <label className="block text-sm font-bold text-gray-700 mb-3">Notice Type</label>
            <div className="grid grid-cols-1 gap-2">
              {noticeTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                    formData.type === type.value
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 bg-white/50 hover:border-orange-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-5 h-5 text-orange-500"
                  />
                  <type.icon size={20} className="text-gray-600" />
                  <span className="font-medium text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="glass rounded-2xl p-5 shadow-lg border border-white/30">
            <label className="block text-sm font-bold text-gray-700 mb-2">Notice Date</label>
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-gray-500" />
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="flex-1 px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:border-orange-400 focus:outline-none text-gray-800"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="glass rounded-2xl p-5 shadow-lg border border-white/30">
            <h3 className="font-bold text-gray-700 mb-4">Options</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-xl bg-white/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Star size={20} className={formData.isImportant ? 'text-yellow-500' : 'text-gray-400'} />
                  <span className="font-medium text-gray-700">Mark as Important</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isImportant}
                  onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                  className="w-6 h-6 text-orange-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl bg-white/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Megaphone size={20} className={formData.isPinned ? 'text-orange-500' : 'text-gray-400'} />
                  <span className="font-medium text-gray-700">Pin to Top</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="w-6 h-6 text-orange-500"
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={20} />
                Update Notice
              </>
            )}
          </motion.button>
        </motion.form>
      </main>
    </div>
  )
}
