'use client'
import { motion } from 'framer-motion'
import { Megaphone, Star, Pin, Zap, AlertTriangle, Calendar, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'

const noticeTypeConfig: Record<string, { icon: any; color: string; bg: string; border: string; label: string }> = {
  'General': {
    icon: Megaphone,
    color: 'text-blue-600',
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    label: '📢'
  },
  'Holiday': {
    icon: Calendar,
    color: 'text-green-600',
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-200',
    label: '🟢'
  },
  'Exam': {
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'from-red-50 to-pink-50',
    border: 'border-red-200',
    label: '🔴'
  },
  'Important': {
    icon: Star,
    color: 'text-yellow-600',
    bg: 'from-yellow-50 to-orange-50',
    border: 'border-yellow-200',
    label: '🟡'
  },
  'Internship': {
    icon: BookOpen,
    color: 'text-purple-600',
    bg: 'from-purple-50 to-pink-50',
    border: 'border-purple-200',
    label: '🔵'
  }
}

export default function NoticeBoard() {
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotices()
    // Refresh every 30 seconds to feel "live"
    const interval = setInterval(fetchNotices, 30000)
    return () => clearInterval(interval)
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

  return (
    <div className="glass rounded-3xl p-6 shadow-2xl border border-white/30 bg-gradient-to-br from-white/95 to-indigo-50/80">
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-xl"
        >
          <Megaphone size={28} />
        </motion.div>
        <div>
          <h3 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            📢 Notice Board
          </h3>
          <p className="text-sm text-gray-500 font-medium">Live Updates</p>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="ml-auto w-3 h-3 rounded-full bg-green-500 shadow-lg"
        />
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="h-28 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl"
              />
            ))}
          </div>
        ) : notices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Megaphone size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No notices right now</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon!</p>
          </motion.div>
        ) : (
          notices.map((notice, i) => {
            const config = noticeTypeConfig[notice.type] || noticeTypeConfig['General']
            const Icon = config.icon

            return (
              <motion.div
                key={notice.id}
                initial={{ x: -40, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className={`relative overflow-hidden rounded-2xl p-5 border-2 ${
                  notice.isImportant
                    ? 'border-red-300 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg ring-2 ring-red-200'
                    : notice.isPinned
                    ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg'
                    : `${config.border} bg-gradient-to-r ${config.bg}`
                }`}
              >
                {(notice.isPinned || notice.isImportant) && (
                  <div className="absolute top-3 right-3 flex gap-2">
                    {notice.isPinned && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl"
                      >
                        📌
                      </motion.div>
                    )}
                    {notice.isImportant && (
                      <div className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                        IMPORTANT
                      </div>
                    )}
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${
                      notice.isImportant
                        ? 'bg-gradient-to-br from-red-500 to-pink-500'
                        : notice.isPinned
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                        : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                    } flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon size={24} className="text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-lg">{config.label}</span>
                        <h4 className={`font-black text-lg ${
                          notice.isImportant ? 'text-red-700' : 'text-gray-800'
                        }`}>
                          {notice.title}
                        </h4>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {notice.content}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(notice.date).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-white/50">
                          {notice.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {notice.isImportant && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-100/30 via-transparent to-red-100/30 pointer-events-none" />
                )}
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
