'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

export default function ManageSubjects() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<any[]>([])
  const [newSubject, setNewSubject] = useState('')

  useEffect(() => {
    fetchSubjects()
  }, [])

  async function fetchSubjects() {
    try {
      const res = await fetch('/api/admin/subjects')
      const data = await res.json()
      setSubjects(data)
    } catch (error) {
      console.error(error)
    }
  }

  async function addSubject(e: React.FormEvent) {
    e.preventDefault()
    if (!newSubject.trim()) return
    
    try {
      await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubject })
      })
      setNewSubject('')
      fetchSubjects()
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteSubject(id: string) {
    if (confirm('Are you sure you want to delete this subject?')) {
      try {
        await fetch('/api/admin/subjects', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        })
        fetchSubjects()
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
          <h1 className="font-bold text-gray-800 text-lg">Manage Subjects</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        <form onSubmit={addSubject} className="glass rounded-2xl p-5 shadow-lg border border-white/30">
          <h3 className="font-bold text-gray-800 mb-3">Add New Subject</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Enter subject name"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white/80"
            />
            <button type="submit" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold">
              <Plus size={20} />
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {subjects.map((subject, i) => (
            <motion.div
              key={subject.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-4 shadow-lg border border-white/30 flex items-center justify-between"
            >
              <h3 className="font-semibold text-gray-800">{subject.name}</h3>
              <button onClick={() => deleteSubject(subject.id)} className="p-2 rounded-lg bg-red-100 text-red-600">
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
