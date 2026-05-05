'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Check, Plus, Trash2, GripVertical } from 'lucide-react'

interface ContentPage {
  title: string;
  content: string;
}

export default function AddPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [classes, setClasses] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    classIds: [] as string[],
    sectionIds: [] as string[],
    subjectIds: [] as string[],
    teacherId: '',
    title: '',
    type: 'Homework',
    date: new Date().toISOString().split('T')[0],
    isHighlight: false
  })

  const [contentPages, setContentPages] = useState<ContentPage[]>([
    { title: 'Introduction', content: '' }
  ])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [classesRes, sectionsRes, subjectsRes, teachersRes] = await Promise.all([
        fetch('/api/admin/classes'),
        fetch('/api/admin/sections'),
        fetch('/api/admin/subjects'),
        fetch('/api/admin/teachers')
      ])
      const classesData = await classesRes.json()
      const sectionsData = await sectionsRes.json()
      const subjectsData = await subjectsRes.json()
      const teachersData = await teachersRes.json()
      
      setClasses(Array.isArray(classesData) ? classesData : [])
      setSections(Array.isArray(sectionsData) ? sectionsData : [])
      setSubjects(Array.isArray(subjectsData) ? subjectsData : [])
      setTeachers(Array.isArray(teachersData) ? teachersData : [])
    } catch (error) {
      console.error(error)
      setClasses([])
      setSections([])
      setSubjects([])
      setTeachers([])
    }
  }

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

  function toggleSubject(subjectId: string) {
    setFormData(prev => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(subjectId)
        ? prev.subjectIds.filter(id => id !== subjectId)
        : [...prev.subjectIds, subjectId]
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (formData.classIds.length === 0) {
      alert('Please select at least one class')
      return
    }
    if (formData.sectionIds.length === 0) {
      alert('Please select at least one section')
      return
    }
    if (formData.subjectIds.length === 0) {
      alert('Please select at least one subject')
      return
    }
    
    setLoading(true)

    try {
      const content = contentPages.map(p => p.content).join('\n\n---PAGE BREAK---\n\n')
      
      const postPromises = []
      const postDetails = []
      
      for (const classId of formData.classIds) {
        for (const sectionId of formData.sectionIds) {
          for (const subjectId of formData.subjectIds) {
            const postData = {
              title: formData.title,
              content,
              contentPages: contentPages.filter(p => p.content.trim()),
              type: formData.type,
              date: formData.date,
              teacherId: formData.teacherId || null,
              classId,
              sectionId,
              subjectId,
              isHighlight: formData.isHighlight
            }
            postDetails.push({ classId, sectionId, subjectId })
            
            const postPromise = fetch('/api/admin/posts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(postData)
            })
            postPromises.push(postPromise)
          }
        }
      }

      console.log('Creating posts with details:', postDetails)
      
      const responses = await Promise.all(postPromises)
      
      let failedCount = 0
      let successCount = 0
      
      for (let i = 0; i < responses.length; i++) {
        const res = responses[i]
        if (res.ok) {
          successCount++
        } else {
          failedCount++
          const errorData = await res.json().catch(() => ({}))
          console.error(`Post ${i + 1} failed:`, postDetails[i], errorData)
        }
      }
      
      console.log(`Success: ${successCount}, Failed: ${failedCount}`)
      
      if (failedCount === 0) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/dashboard/posts')
        }, 1500)
      } else if (successCount > 0) {
        alert(`Some posts failed (${failedCount}/${responses.length}). ${successCount} posts were created successfully.`)
        router.push('/admin/dashboard/posts')
      } else {
        alert('All posts failed to create. Please try again.')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      alert('Failed to create posts: ' + error)
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Multi-select Classes */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30"
          >
            <h3 className="font-bold text-gray-800 mb-3">Classes ({formData.classIds.length})</h3>
            <div className="flex flex-wrap gap-2">
              {classes.map(cls => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => toggleClass(cls.id)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                    formData.classIds.includes(cls.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Class {cls.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Multi-select Sections */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30"
          >
            <h3 className="font-bold text-gray-800 mb-3">Sections ({formData.sectionIds.length})</h3>
            <div className="flex flex-wrap gap-2">
              {sections.map(sec => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => toggleSection(sec.id)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                    formData.sectionIds.includes(sec.id)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Section {sec.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Multi-select Subjects */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30"
          >
            <h3 className="font-bold text-gray-800 mb-3">Subjects ({formData.subjectIds.length})</h3>
            <div className="flex flex-wrap gap-2">
              {subjects.map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => toggleSubject(sub.id)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                    formData.subjectIds.includes(sub.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Teacher (Optional) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30"
          >
            <h3 className="font-bold text-gray-800 mb-2">Teacher (Optional)</h3>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-700"
            >
              <option value="">Select Teacher (Optional)</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
              ))}
            </select>
          </motion.div>

          {/* Type & Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30 space-y-4"
          >
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Type</h3>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-700"
              >
                <option value="Homework">Homework</option>
                <option value="Classwork">Classwork</option>
                <option value="Notice">Notice</option>
              </select>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">Title</h3>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter title"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80"
                required
              />
            </div>
          </motion.div>

          {/* Multi-page Content Editor */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm min-h-[100px]"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Date & Highlight */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30 space-y-4"
          >
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

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="highlight"
                checked={formData.isHighlight}
                onChange={(e) => setFormData({...formData, isHighlight: e.target.checked})}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="highlight" className="text-gray-700 font-medium">Highlight this post on homepage</label>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || success || !formData.title || formData.classIds.length === 0 || formData.sectionIds.length === 0 || formData.subjectIds.length === 0 || !contentPages.some(p => p.content.trim())}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg ${
              success ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
            } disabled:opacity-50`}
          >
            {success ? (
              <>
                <Check size={20} /> Published!
              </>
            ) : loading ? (
              `Publishing ${formData.classIds.length * formData.sectionIds.length * formData.subjectIds.length} posts...`
            ) : (
              <>
                <Save size={20} /> Publish ({formData.classIds.length * formData.sectionIds.length * formData.subjectIds.length} posts)
              </>
            )}
          </motion.button>
        </form>
      </main>
    </div>
  )
}
