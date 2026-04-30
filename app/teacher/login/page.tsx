'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LogIn } from 'lucide-react'

export default function TeacherLoginPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<any[]>([])
  const [selectedTeacherId, setSelectedTeacherId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTeachers()
  }, [])

  async function fetchTeachers() {
    try {
      const res = await fetch('/api/teachers')
      console.log('Response status:', res.status)
      const data = await res.json()
      console.log('API Response data:', data)
      console.log('Is array:', Array.isArray(data))
      
      // Make sure it's an array!
      setTeachers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Fetch error:', error)
      setTeachers([])
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('Attempting login with:', { teacherId: selectedTeacherId, password })

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId: selectedTeacherId, password })
      })

      console.log('Response status:', res.status)

      if (res.ok) {
        const data = await res.json()
        console.log('Login successful, data:', data)
        localStorage.setItem('teacher', JSON.stringify(data.teacher))
        router.push('/teacher/dashboard')
      } else {
        let errorMsg = 'Login failed'
        try {
          const errorData = await res.json()
          errorMsg = errorData.error || errorData.details || `HTTP ${res.status}`
        } catch {
          errorMsg = `HTTP ${res.status}`
        }
        console.log('Login error:', errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      console.log('Network error:', err)
      setError('Network error - please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-lg">Teacher Login</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleLogin} className="space-y-5">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass rounded-2xl p-5 shadow-lg border border-white/30 space-y-4"
          >
            <h3 className="font-bold text-gray-800 text-lg">Select Teacher</h3>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-700"
              required
            >
              <option value="">Choose your name</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} - {teacher.subject?.name}
                </option>
              ))}
            </select>

            <h3 className="font-bold text-gray-800 text-lg">Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80"
              required
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading || !selectedTeacherId || !password}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? 'Logging in...' : (
              <>
                <LogIn size={20} /> Login
              </>
            )}
          </motion.button>
        </form>
      </main>
    </div>
  )
}
