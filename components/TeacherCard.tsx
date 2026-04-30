'use client'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'

export default function TeacherCard({ teacher }: { teacher: any }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
          {teacher.profilePhoto ? (
            <img src={teacher.profilePhoto} alt={teacher.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User size={28} />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-lg">{teacher.name}</h3>
          <p className="text-sm text-indigo-600 font-medium">{teacher.subject}</p>
          <p className="text-xs text-gray-400 mt-1">
            {teacher.latestActivity ? `Last active: ${teacher.latestActivity}` : ''}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
