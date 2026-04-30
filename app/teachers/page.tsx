'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, BookOpen } from 'lucide-react'

export default function TeachersListPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])

  useEffect(() => {
    fetchTeachers()
    fetchSubjects()
  }, [])

  async function fetchTeachers() {
    try {
      const res = await fetch('/api/teachers')
      const data = await res.json()
      setTeachers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setTeachers([])
    }
  }

  async function fetchSubjects() {
    try {
      const res = await fetch('/api/admin/subjects')
      const data = await res.json()
      setSubjects(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setSubjects([])
    }
  }

  function getSubjectName(subjectId: string) {
    const subject = subjects.find(s => s.id === subjectId)
    return subject?.name || 'Unknown'
  }

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <Users size={20} className="text-indigo-600" />
            <h1 className="font-bold text-gray-800 text-lg">Our Teachers</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {teachers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No teachers listed yet</p>
          </div>
        ) : (
          teachers.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 shadow-lg border border-white/30"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                  {teacher.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">{teacher.name}</h3>
                  <p className="text-sm text-indigo-600 font-medium flex items-center gap-1">
                    <BookOpen size={14} />
                    {getSubjectName(teacher.subjectId)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </main>
    </div>
  )
}
