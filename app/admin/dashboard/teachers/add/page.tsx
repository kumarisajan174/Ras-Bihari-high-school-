'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Check } from 'lucide-react'

export default function AddTeacherPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [classes, setClasses] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    password: '',
    classNames: [] as string[],
    sectionNames: [] as string[]
  })

  useEffect(() => {
    fetchClasses()
    fetchSections()
    fetchSubjects()
  }, [])

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

  function toggleClass(className: string) {
    setFormData(prev => ({
      ...prev,
      classNames: prev.classNames.includes(className)
        ? prev.classNames.filter(n => n !== className)
        : [...prev.classNames, className]
    }))
  }

  function toggleSection(sectionName: string) {
    setFormData(prev => ({
      ...prev,
      sectionNames: prev.sectionNames.includes(sectionName)
        ? prev.sectionNames.filter(n => n !== sectionName)
        : [...prev.sectionNames, sectionName]
    }))
  }

  function selectAllClasses() {
    if (formData.classNames.length === classes.length) {
      setFormData(prev => ({ ...prev, classNames: [] }))
    } else {
      setFormData(prev => ({ ...prev, classNames: classes.map(c => c.name) }))
    }
  }

  function selectAllSections() {
    if (formData.sectionNames.length === sections.length) {
      setFormData(prev => ({ ...prev, sectionNames: [] }))
    } else {
      setFormData(prev => ({ ...prev, sectionNames: sections.map(s => s.name) }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/simple-teachers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/admin/dashboard')} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-lg">Add Teacher</h1>
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
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-700"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.name}>{sub.name}</option>
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
                  {formData.classNames.length === classes.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {classes.map(cls => (
                  <label key={cls.id} className="flex items-center gap-2 p-3 rounded-xl bg-white/80 border border-gray-200 cursor-pointer hover:bg-white">
                    <input
                      type="checkbox"
                      checked={formData.classNames.includes(cls.name)}
                      onChange={() => toggleClass(cls.name)}
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
                  {formData.sectionNames.length === sections.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {sections.map(sec => (
                  <label key={sec.id} className="flex items-center gap-2 p-3 rounded-xl bg-white/80 border border-gray-200 cursor-pointer hover:bg-white">
                    <input
                      type="checkbox"
                      checked={formData.sectionNames.includes(sec.name)}
                      onChange={() => toggleSection(sec.name)}
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
            disabled={loading || success || !formData.name || !formData.password || !formData.subject || formData.classNames.length === 0 || formData.sectionNames.length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg ${
              success ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
            } disabled:opacity-50`}
          >
            {success ? (
              <>
                <Check size={20} /> Teacher Added!
              </>
            ) : loading ? (
              'Adding...'
            ) : (
              <>
                <Save size={20} /> Add Teacher
              </>
            )}
          </motion.button>
        </form>
      </main>
    </div>
  )
}