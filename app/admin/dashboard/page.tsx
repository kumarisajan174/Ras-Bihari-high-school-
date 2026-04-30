'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Users, BookOpen, FileText, Settings, GraduationCap, Layers, Megaphone, LogOut } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    const admin = localStorage.getItem('admin')
    if (!admin) {
      router.push('/admin/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    router.push('/admin/login')
  }

  const menuItems = [
    {
      title: 'Add Notice',
      icon: Megaphone,
      color: 'from-orange-500 to-yellow-500',
      href: '/admin/dashboard/notices/add',
      desc: 'Create new notice'
    },
    {
      title: 'Manage Notices',
      icon: Megaphone,
      color: 'from-red-500 to-pink-500',
      href: '/admin/dashboard/notices',
      desc: 'Edit/Delete notices'
    },
    {
      title: 'Add Homework/Classwork',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      href: '/admin/dashboard/posts/add',
      desc: 'Create new posts'
    },
    {
      title: 'Manage Posts',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      href: '/admin/dashboard/posts',
      desc: 'Edit/Delete posts'
    },
    {
      title: 'Add Teacher',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      href: '/admin/dashboard/teachers/add',
      desc: 'Add new teacher'
    },
    {
      title: 'Manage Teachers',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      href: '/admin/dashboard/teachers',
      desc: 'View/Edit teachers'
    },
    {
      title: 'Manage Subjects',
      icon: BookOpen,
      color: 'from-indigo-500 to-purple-500',
      href: '/admin/dashboard/subjects',
      desc: 'Add/Edit subjects'
    },
    {
      title: 'Manage Classes',
      icon: GraduationCap,
      color: 'from-teal-500 to-green-500',
      href: '/admin/dashboard/classes',
      desc: 'Add/Edit classes'
    },
    {
      title: 'Manage Sections',
      icon: Layers,
      color: 'from-pink-500 to-rose-500',
      href: '/admin/dashboard/sections',
      desc: 'Add/Edit sections'
    },
  ]

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="font-bold text-gray-800 text-xl">Admin Panel</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium text-sm"
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="gradient-card rounded-2xl p-5 text-white mb-6 shadow-2xl"
        >
          <h2 className="text-xl font-bold mb-1">Welcome Admin! 👋</h2>
          <p className="text-white/90 text-sm">Manage your school content</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => router.push(item.href)}
              className={`bg-gradient-to-r ${item.color} rounded-2xl p-4 shadow-lg cursor-pointer hover:scale-105 transition-transform`}
            >
              <item.icon size={32} className="text-white mb-2" />
              <h3 className="font-bold text-white text-sm">{item.title}</h3>
              <p className="text-white/80 text-xs mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
