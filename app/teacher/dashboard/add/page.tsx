'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Check, Plus, Trash2, GripVertical, BookOpen, School } from 'lucide-react'

interface ContentPage {
  title: string;
  content: string;
}

export default function TeacherAddPostPage() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [classes, setClasses] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])

  const [formData, setFormData] = useState({
    title: '',
    type: 'Homework',
    date: new Date().toISOString().split('T')[0],
    classId: '',
    sectionId: '',
    subjectId: '',
    isHighlight: false
  })

  const [contentPages, setContentPages] = useState<ContentPage[]>([
    { title: 'Introduction', content: '' }
  ])

  useEffect(() => {
    const savedTeacher = localStorage.getItem('teacher')
    if (!savedTeacher) {
      router.push('/teacher/login')
      return
    }
    const parsedTeacher = JSON.parse(savedTeacher)
    setTeacher(parsedTeacher)
    fetchData(parsedTeacher)
  }, [])

  async function fetchData(teacherData?: any) {
    try {
      console.log('Fetching data...')
      const [classesRes, sectionsRes, subjectsRes] = await Promise.all([
        fetch('/api/admin/classes'),
        fetch('/api/admin/sections'),
        fetch('/api/admin/subjects')
      ])
      const classesData = await classesRes.json()
      const sectionsData = await sectionsRes.json()
      const subjectsData = await subjectsRes.json()
      console.log('Classes:', classesData)
      console.log('Sections:', sectionsData)
      console.log('Subjects:', subjectsData)
      setClasses(Array.isArray(classesData) ? classesData : [])
      setSections(Array.isArray(sectionsData) ? sectionsData : [])
      setSubjects(Array.isArray(subjectsData) ? subjectsData : [])

      if (teacherData?.subject) {
        const subjectMatch = subjectsData.find((s: any) => s.name === teacherData.subject)
        if (subjectMatch) {
          setFormData(prev => ({ ...prev, subjectId: subjectMatch.id }))
        }
      }
    } catch (error) {
      console.error(error)
      setClasses([])
      setSections([])
      setSubjects([])
    }
  }

  const availableClasses = teacher?.assignedClasses?.length
    ? classes.filter((c: any) => teacher.assignedClasses.includes(c.name))
    : classes
  const availableSections = teacher?.assignedSections?.length
    ? sections.filter((s: any) => teacher.assignedSections.includes(s.name))
    : sections

  function addContentPage() {
    const newPageNum = contentPages.length + 1
    setContentPages([...contentPages, { title: `Page ${newPageNum}`, content: '' }])
  }

  function removeContentPage(index: number) {
    if (contentPages.length === 1) return
    setContentPages(contentPages.filter((_, i) => i !== index))
  }

  function updateContentPage(index: number, field: 'title' | 'content', value: string) {
    const updated = [...contentPages]
    updated[index][field] = value
    setContentPages(updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('Form submitted!')
    console.log('Teacher:', teacher)
    console.log('Teacher ID:', teacher?.id)
    console.log('Form data:', {
      ...formData,
      teacherId: teacher?.id,
      content: contentPages.map(p => p.content).join('\n\n---PAGE BREAK---\n\n'),
      contentPages: contentPages
    })
    setLoading(true)

    try {
      if (!teacher?.id) {
        console.error('Teacher ID is missing!')
        alert('Teacher not found! Please login again.')
        router.push('/teacher/login')
        return
      }
      console.log('Starting fetch...')
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          teacherId: teacher.id,
          content: contentPages.map(p => p.content).join('\n\n---PAGE BREAK---\n\n'),
          contentPages: contentPages
        })
      })
      console.log('Response status:', res.status)
      console.log('Response ok:', res.ok)
      
      if (res.ok) {
        const responseData = await res.json()
        console.log('Response data:', responseData)
        setSuccess(true)
        setTimeout(() => {
          router.push('/teacher/dashboard')
        }, 1500)
      } else {
        const errorData = await res.json()
        console.log('Error response:', errorData)
        alert('Failed to create post:\n' + (errorData.details || errorData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Fetch error:', error)
      alert('Failed to create post: ' + error)
    } finally {
      setLoading(false)
    }
  }

  if (!teacher) {
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
          <button onClick={() => router.push('/teacher/dashboard')} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-lg">Add Content</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="glass rounded-2xl p-4 mb-4 text-xs text-gray-600">
          <p className="font-bold mb-2">Debug Info:</p>
          <p>formData.title: {formData.title ? '✓' : '✗'}</p>
          <p>formData.classId: {formData.classId ? '✓' : '✗'}</p>
          <p>formData.sectionId: {formData.sectionId ? '✓' : '✗'}</p>
          <p>formData.subjectId: {formData.subjectId ? '✓' : '✗'}</p>
          <p>classes.length: {classes.length}</p>
          <p>sections.length: {sections.length}</p>
          <p>subjects.length: {subjects.length}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30"
          >
            <h3 className="font-bold text-gray-800 mb-2">Title</h3>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter title"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80"
              required
            />
          </motion.div>

          {/* Type */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30"
          >
            <h3 className="font-bold text-gray-800 mb-3">Type</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'Homework'})}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  formData.type === 'Homework'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <BookOpen size={18} /> Homework
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'Classwork'})}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  formData.type === 'Classwork'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <School size={18} /> Classwork
              </button>
            </div>
          </motion.div>

          {/* Class & Section & Subject */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30 space-y-4"
          >
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Class</h3>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({...formData, classId: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-700"
                required
              >
                <option value="">Select Class</option>
                {availableClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>Class {cls.name}</option>
                ))}
              </select>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Section</h3>
              <select
                value={formData.sectionId}
                onChange={(e) => setFormData({...formData, sectionId: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-700"
                required
              >
                <option value="">Select Section</option>
                {availableSections.map(sec => (
                  <option key={sec.id} value={sec.id}>Section {sec.name}</option>
                ))}
              </select>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Subject</h3>
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
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Date</h3>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80"
                required
              />
            </div>
          </motion.div>

          {/* Multi-page Content Editor */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Content Pages</h3>
              <button
                type="button"
                onClick={addContentPage}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-xl font-medium text-sm hover:bg-indigo-600 transition-colors"
              >
                <Plus size={16} /> Add Page
              </button>
            </div>

            <div className="space-y-4">
              {contentPages.map((page, index) => (
                <div key={index} className="bg-white/60 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <GripVertical size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Page {index + 1}</span>
                    {contentPages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContentPage(index)}
                        className="ml-auto p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={page.title}
                    onChange={(e) => updateContentPage(index, 'title', e.target.value)}
                    placeholder="Page title (e.g., Introduction, Examples)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm mb-2"
                  />

                  <textarea
                    value={page.content}
                    onChange={(e) => updateContentPage(index, 'content', e.target.value)}
                    placeholder="Write content for this page..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm min-h-[120px]"
                  />
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Tip: Break long content into multiple pages for better student experience
            </p>
          </motion.div>

          {/* Highlight Toggle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="highlight"
                checked={formData.isHighlight}
                onChange={(e) => setFormData({...formData, isHighlight: e.target.checked})}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="highlight" className="text-gray-700 font-medium">
                Highlight this post on homepage
              </label>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || success || !formData.title || !formData.classId || !formData.sectionId || !formData.subjectId || !contentPages.some(p => p.content.trim())}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg ${
              success ? 'bg-green-500' : 'bg-gradient-to-r from-green-500 to-emerald-600'
            } disabled:opacity-50`}
          >
            {success ? (
              <>
                <Check size={20} /> Added Successfully!
              </>
            ) : loading ? (
              'Adding...'
            ) : (
              <>
                <Save size={20} /> Add Content
              </>
            )}
          </motion.button>
        </form>
      </main>
    </div>
  )
}