'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Check } from 'lucide-react'

export default function AddPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [classes, setClasses] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    classId: '',
    sectionId: '',
    subjectId: '',
    teacherId: '',
    title: '',
    content: '',
    type: 'Homework',
    date: new Date().toISOString().split('T')[0],
    isHighlight: false
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (formData.classId) {
      fetchSections()
    }
  }, [formData.classId])

  useEffect(() => {
    if (formData.classId && formData.sectionId) {
      fetchSubjects()
    }
  }, [formData.classId, formData.sectionId])

  useEffect(() => {
    if (formData.classId && formData.sectionId && formData.subjectId) {
      fetchTeachers()
    }
  }, [formData.classId, formData.sectionId, formData.subjectId])

  async function fetchClasses() {
    try {
      const res = await fetch('/api/admin/classes')
      const data = await res.json()
      setClasses(data)
    } catch (error) {
      console.error(error)
    }
  }

  async function fetchSections() {
    try {
      const res = await fetch('/api/admin/sections')
      const data = await res.json()
      setSections(data)
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

  async function fetchTeachers() {
    try {
      const res = await fetch('/api/admin/teachers')
      const data = await res.json()
      const filtered = data.filter((t: any) => {
        return t.TeacherAssignment?.some((a: any) => 
          a.classId === formData.classId && a.sectionId === formData.sectionId
        ) && t.subjectId === formData.subjectId
      })
      setTeachers(filtered)
    } catch (error) {
      console.error(error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/dashboard/posts')
        }, 1500)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/admin/dashboard')} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-lg">Add Homework/Classwork</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30 space-y-4"
          >
            <h3 className="font-bold text-gray-800 text-lg">Select Class</h3>
            <select
              value={formData.classId}
              onChange={(e) => setFormData({...formData, classId: e.target.value, sectionId: '', subjectId: '', teacherId: ''})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-700"
              required
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>Class {cls.name}</option>
              ))}
            </select>

            <h3 className="font-bold text-gray-800 text-lg">Select Section</h3>
            <select
              value={formData.sectionId}
              onChange={(e) => setFormData({...formData, sectionId: e.target.value, teacherId: ''})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-700"
              required
              disabled={!formData.classId}
            >
              <option value="">Select Section</option>
              {sections.map(sec => (
                <option key={sec.id} value={sec.id}>Section {sec.name}</option>
              ))}
            </select>

            <h3 className="font-bold text-gray-800 text-lg">Select Subject</h3>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({...formData, subjectId: e.target.value, teacherId: ''})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-700"
              required
              disabled={!formData.sectionId}
            >
              <option value="">Select Subject</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>

            <h3 className="font-bold text-gray-800 text-lg">Select Teacher</h3>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-700"
              required
              disabled={!formData.subjectId}
            >
              <option value="">Select Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
              ))}
            </select>

            <h3 className="font-bold text-gray-800 text-lg">Type</h3>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-700"
            >
              <option value="Homework">Homework</option>
              <option value="Classwork">Classwork</option>
              <option value="Notice">Notice</option>
            </select>

            <h3 className="font-bold text-gray-800 text-lg">Title</h3>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter title"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80"
              required
            />

            <h3 className="font-bold text-gray-800 text-lg">Content</h3>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Enter content"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80"
              required
            />

            <h3 className="font-bold text-gray-800 text-lg">Date</h3>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80"
              required
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="highlight"
                checked={formData.isHighlight}
                onChange={(e) => setFormData({...formData, isHighlight: e.target.checked})}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="highlight" className="text-gray-700 font-medium">Highlight this post</label>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading || success}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg ${
              success ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
            }`}
          >
            {success ? (
              <>
                <Check size={20} /> Published!
              </>
            ) : loading ? (
              'Publishing...'
            ) : (
              <>
                <Save size={20} /> Publish
              </>
            )}
          </motion.button>
        </form>
      </main>
    </div>
  )
}
