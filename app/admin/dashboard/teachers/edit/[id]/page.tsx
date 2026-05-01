'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Check } from 'lucide-react'

export default function EditTeacherPage() {
  const router = useRouter()
  const params = useParams()
  const teacherId = params.id as string

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [classes, setClasses] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: '',
    subjectId: '',
    password: '',
    classIds: [] as string[],
    sectionIds: [] as string[]
  })

  useEffect(() => {
    fetchClasses()
    fetchSections()
    fetchSubjects()
    fetchTeacher()
  }, [teacherId])

  async function fetchTeacher() {
    try {
      const res = await fetch('/api/admin/teachers')
      const data = await res.json()
      const teacher = data.find((t: any) => t.id === teacherId)

      if (teacher) {
        const assignedClassIds = [...new Set(teacher.assignments?.map((a: any) => a.classId) || [])] as string[]
        const assignedSectionIds = [...new Set(teacher.assignments?.map((a: any) => a.sectionId) || [])] as string[]

        setFormData({
          name: teacher.name,
          subjectId: teacher.subjectId,
          password: teacher.password,
          classIds: assignedClassIds,
          sectionIds: assignedSectionIds
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setFetching(false)
    }
  }

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

  function toggleClass(classId: string) {
    setFormData(prev => ({
      ...prev,
      classIds: prev.classIds.includes(classId)
        ? prev.classIds.filter(id => id !== classId)
        : [...prev.classIds, classId]
    }))
  }

  function toggleSection(sectionId: string) {
    setFormData(prev => ({
      ...prev,
      sectionIds: prev.sectionIds.includes(sectionId)
        ? prev.sectionIds.filter(id => id !== sectionId)
        : [...prev.sectionIds, sectionId]
    }))
  }

  function selectAllClasses() {
    if (formData.classIds.length === classes.length) {
      setFormData(prev => ({ ...prev, classIds: [] }))
    } else {
      setFormData(prev => ({ ...prev, classIds: classes.map(c => c.id) }))
    }
  }

  function selectAllSections() {
    if (formData.sectionIds.length === sections.length) {
      setFormData(prev => ({ ...prev, sectionIds: [] }))
    } else {
      setFormData(prev => ({ ...prev, sectionIds: sections.map(s => s.id) }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/teachers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: teacherId, ...formData })
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/dashboard/teachers')
        }, 1500)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/admin/dashboard/teachers')} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-lg">Edit Teacher</h1>
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
            <h3 className="font-bold text-gray-800 text-lg">Teacher Name</h3>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter teacher name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80"
              required
            />

            <h3 className="font-bold text-gray-800 text-lg">Password</h3>
            <input
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Set teacher password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80"
              required
            />

            <h3 className="font-bold text-gray-800 text-lg">Subject</h3>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-700"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-lg">Classes</h3>
                <button
                  type="button"
                  onClick={selectAllClasses}
                  className="text-sm text-indigo-600 font-medium"
                >
                  {formData.classIds.length === classes.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {classes.map(cls => (
                  <label key={cls.id} className="flex items-center gap-2 p-3 rounded-xl bg-white/80 border border-gray-200 cursor-pointer hover:bg-white">
                    <input
                      type="checkbox"
                      checked={formData.classIds.includes(cls.id)}
                      onChange={() => toggleClass(cls.id)}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-gray-700">Class {cls.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-lg">Sections</h3>
                <button
                  type="button"
                  onClick={selectAllSections}
                  className="text-sm text-indigo-600 font-medium"
                >
                  {formData.sectionIds.length === sections.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {sections.map(sec => (
                  <label key={sec.id} className="flex items-center gap-2 p-3 rounded-xl bg-white/80 border border-gray-200 cursor-pointer hover:bg-white">
                    <input
                      type="checkbox"
                      checked={formData.sectionIds.includes(sec.id)}
                      onChange={() => toggleSection(sec.id)}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-gray-700">Section {sec.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading || success || !formData.name || !formData.password || !formData.subjectId || formData.classIds.length === 0 || formData.sectionIds.length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg ${
              success ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
            } disabled:opacity-50`}
          >
            {success ? (
              <>
                <Check size={20} /> Teacher Updated!
              </>
            ) : loading ? (
              'Updating...'
            ) : (
              <>
                <Save size={20} /> Update Teacher
              </>
            )}
          </motion.button>
        </form>
      </main>
    </div>
  )
}
