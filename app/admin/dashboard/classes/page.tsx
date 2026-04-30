'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

export default function ManageClasses() {
  const router = useRouter()
  const [classes, setClasses] = useState<any[]>([])
  const [newClass, setNewClass] = useState('')

  useEffect(() => {
    fetchClasses()
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

  async function addClass(e: React.FormEvent) {
    e.preventDefault()
    if (!newClass.trim()) return
    
    try {
      await fetch('/api/admin/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClass })
      })
      setNewClass('')
      fetchClasses()
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteClass(id: string) {
    if (confirm('Are you sure you want to delete this class?')) {
      try {
        await fetch('/api/admin/classes', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        })
        fetchClasses()
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
          <h1 className="font-bold text-gray-800 text-lg">Manage Classes</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        <form onSubmit={addClass} className="glass rounded-2xl p-5 shadow-lg border border-white/30">
          <h3 className="font-bold text-gray-800 mb-3">Add New Class</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              placeholder="Enter class name (e.g., 9)"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white/80"
            />
            <button type="submit" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold">
              <Plus size={20} />
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 gap-3">
          {classes.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-4 shadow-lg border border-white/30 flex items-center justify-between"
            >
              <h3 className="font-bold text-gray-800">Class {cls.name}</h3>
              <button onClick={() => deleteClass(cls.id)} className="p-2 rounded-lg bg-red-100 text-red-600">
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
