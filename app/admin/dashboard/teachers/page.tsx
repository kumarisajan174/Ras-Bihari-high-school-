'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react'

export default function ManageTeachers() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])

  useEffect(() => {
    fetchTeachers()
    fetchSubjects()
  }, [])

  async function fetchTeachers() {
    try {
      const res = await fetch('/api/admin/teachers')
      const data = await res.json()
      setTeachers(data)
    } catch (error) {
      console.error(error)
    }
  }

  async function fetchSubjects() {
    try {
      const res = await fetch('/api/admin/subjects')
      const data = await res.json()
      setSubjects(data)
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteTeacher(id: string) {
    if (confirm('Are you sure you want to delete this teacher?')) {
      try {
        await fetch('/api/admin/teachers', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        })
        fetchTeachers()
      } catch (error) {
        console.error(error)
      }
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
          <button onClick={() => router.push('/admin/dashboard')} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-lg">Manage Teachers</h1>
          <button onClick={() => router.push('/admin/dashboard/teachers/add')} className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <Plus size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {teachers.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No teachers yet</p>
        ) : (
          teachers.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 shadow-lg border border-white/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {teacher.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{teacher.name}</h3>
                    <p className="text-sm text-indigo-600">{getSubjectName(teacher.subjectId)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Password: <span className="font-mono text-gray-700">{teacher.password}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {teacher.assignments?.map((a: any, j: number) => (
                        <span
                          key={j}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                        >
                          {a.class?.name}{a.section?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => router.push(`/admin/dashboard/teachers/edit/${teacher.id}`)}
                    className="p-2 rounded-lg bg-blue-100 text-blue-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button onClick={() => deleteTeacher(teacher.id)} className="p-2 rounded-lg bg-red-100 text-red-600">
                    <Trash2 size={16} />
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
