'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Check } from 'lucide-react'

export default function TeacherEditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [success, setSuccess] = useState(false)
  
  const [classes, setClasses] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'Homework',
    date: new Date().toISOString().split('T')[0],
    classId: '',
    sectionId: '',
    subjectId: '',
    isHighlight: false
  })

  useEffect(() => {
    const savedTeacher = localStorage.getItem('teacher')
    if (!savedTeacher) {
      router.push('/teacher/login')
      return
    }
    const parsedTeacher = JSON.parse(savedTeacher)
    setTeacher(parsedTeacher)
    fetchData()
    fetchPost()
  }, [])

  async function fetchData() {
    try {
      const [classesRes, sectionsRes, subjectsRes] = await Promise.all([
        fetch('/api/admin/classes'),
        fetch('/api/admin/sections'),
        fetch('/api/admin/subjects')
      ])
      const classesData = await classesRes.json()
      const sectionsData = await sectionsRes.json()
      const subjectsData = await subjectsRes.json()
      setClasses(Array.isArray(classesData) ? classesData : [])
      setSections(Array.isArray(sectionsData) ? sectionsData : [])
      setSubjects(Array.isArray(subjectsData) ? subjectsData : [])
    } catch (error) {
      console.error(error)
      setClasses([])
      setSections([])
      setSubjects([])
    }
  }

  async function fetchPost() {
    try {
      const res = await fetch('/api/admin/posts')
      const posts = await res.json()
      const postsArray = Array.isArray(posts) ? posts : []
      const post = postsArray.find((p: any) => p.id === postId)
      
      if (post) {
        setFormData({
          title: post.title,
          content: post.content,
          type: post.type,
          date: new Date(post.date).toISOString().split('T')[0],
          classId: post.classId,
          sectionId: post.sectionId,
          subjectId: post.subjectId,
          isHighlight: post.isHighlight
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setFetching(false)
    }
  }

  // Get only assigned classes/sections for this teacher using new simple structure
  const availableClasses = teacher?.assignedClasses?.length
    ? classes.filter((c: any) => teacher.assignedClasses.includes(c.name))
    : classes
  const availableSections = teacher?.assignedSections?.length
    ? sections.filter((s: any) => teacher.assignedSections.includes(s.name))
    : sections



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          title: formData.title,
          content: formData.content,
          type: formData.type,
          date: new Date(formData.date),
          classId: formData.classId,
          sectionId: formData.sectionId,
          subjectId: formData.subjectId,
          isHighlight: formData.isHighlight
        })
      })
      
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/teacher/dashboard')
        }, 1500)
      } else {
        const errorData = await res.json()
        console.error('Update failed:', errorData)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (fetching || !teacher) {
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
          <h1 className="font-bold text-gray-800 text-lg">Edit Content</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6">
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
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                  formData.type === 'Homework'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Homework
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'Classwork'})}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                  formData.type === 'Classwork'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Classwork
              </button>
            </div>
          </motion.div>

          {/* Class & Section */}
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

          {/* Content Editor */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30"
          >
            <h3 className="font-bold text-gray-800 mb-2">Content</h3>

            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Write your content here..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 min-h-[200px]"
              required
            />

            {/* Highlight Toggle */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="highlight"
                checked={formData.isHighlight}
                onChange={(e) => setFormData({...formData, isHighlight: e.target.checked})}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="highlight" className="text-sm text-gray-700">
                Highlight this post
              </label>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || success || !formData.title || !formData.content || !formData.classId || !formData.sectionId}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg ${
              success ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
            } disabled:opacity-50`}
          >
            {success ? (
              <>
                <Check size={20} /> Updated Successfully!
              </>
            ) : loading ? (
              'Updating...'
            ) : (
              <>
                <Save size={20} /> Update Content
              </>
            )}
          </motion.button>
        </form>
      </main>
    </div>
  )
}
