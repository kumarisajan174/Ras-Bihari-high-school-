'use client'
import { motion } from 'framer-motion'
import { Star, User, BookOpen, ChevronRight, Building, Users } from 'lucide-react'

export default function HighlightCard({
  title,
  content,
  type,
  teacher,
  subject,
  className,
  onClick,
  classInfo,
  sectionInfo,
}: {
  title: string
  content: string
  type: string
  teacher?: string
  subject?: string
  className?: string
  onClick?: () => void
  classInfo?: string
  sectionInfo?: string
}) {
  const colors = {
    Homework: 'from-orange-400 to-pink-500',
    Classwork: 'from-blue-400 to-cyan-500',
    Notice: 'from-yellow-400 to-orange-500',
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${
        colors[type as keyof typeof colors] || colors.Homework
      } rounded-2xl p-5 shadow-2xl text-white ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Star className="fill-yellow-300 text-yellow-300" size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
            Today's {type}
          </span>
        </div>
        {onClick && (
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ChevronRight size={18} />
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/90 text-sm line-clamp-3 mb-3">{content}</p>
      {(teacher || subject || classInfo || sectionInfo) && (
        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-white/20">
          {classInfo && (
            <div className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
              <Building size={12} />
              {classInfo}
            </div>
          )}
          {sectionInfo && (
            <div className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
              <Users size={12} />
              {sectionInfo}
            </div>
          )}
          {teacher && (
            <div className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
              <User size={12} />
              {teacher}
            </div>
          )}
          {subject && (
            <div className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
              <BookOpen size={12} />
              {subject}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
