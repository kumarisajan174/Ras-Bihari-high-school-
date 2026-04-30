'use client'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import HighlightCard from '@/components/HighlightCard'
import NoticeBoard from '@/components/NoticeBoard'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { BookOpen, Sparkles, Rocket, Star, Heart, GraduationCap, Zap, Smile, LogIn } from 'lucide-react'



const floatingEmojis = ['📚', '✨', '🎓', '🌟', '🚀', '💡', '🎯', '🎨']

export default function HomePage() {
  const [highlights, setHighlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodayHighlights()
  }, [])

  async function fetchTodayHighlights() {
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`/api/posts?date=${today}&isHighlight=true`)
      const data = await res.json()
      setHighlights(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching highlights:', error)
      setHighlights([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      {/* Floating Background Emojis */}
      {floatingEmojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-20"
          initial={{
            x: Math.random() * 400 - 100,
            y: Math.random() * 600,
          }}
          animate={{
            y: [null, -30, null],
            x: [null, Math.random() * 20 - 10, null],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          style={{
            left: `${i * 12 + 5}%`,
            top: `${(i % 4) * 25 + 5}%`,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      <Navbar />
      <main className="max-w-md mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Hero Banner */}
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
        >
          <div className="absolute -right-16 -top-16 opacity-30">
            <GraduationCap size={200} />
          </div>
          <div className="absolute top-6 right-6">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <span className="text-7xl">🎓</span>
            </motion.div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={24} className="text-yellow-300" />
              <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold border border-white/30">
                Welcome!
              </span>
            </div>
            
            <h2 className="text-4xl font-black mb-3 leading-tight">
              Hello Students! 👋
            </h2>
            
            <p className="text-white/95 text-base mb-6 font-medium">
              Mahabodhi Mahavidyalaya B.Ed & D.El.Ed College
            </p>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white/25 backdrop-blur-md rounded-2xl p-5 border border-white/30 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Rocket size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">Internship at</p>
                  <p className="text-white/90 font-semibold">Ras Bihari High School Nalanda</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap size={24} className="text-yellow-500" />
            <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Start Learning
            </h2>
          </div>
          <Link href="/classes">
            <motion.div
              whileHover={{ scale: 1.05, y: -6 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden rounded-3xl p-7 shadow-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-100"
            >
              <div className="absolute top-4 right-4">
                <span className="text-4xl animate-bounce">📚</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-5">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl"
                  >
                    <BookOpen size={36} />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Browse Classes
                    </h3>
                    <p className="text-gray-600 font-semibold mt-1 flex items-center gap-2">
                      <Smile size={16} />
                      Class 9 - 12
                    </p>
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-indigo-100">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-2 font-medium">
                    <span>Select Class → Section → Subject → Teacher → Date</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
          
          {/* Quick Links Grid */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/teachers">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="glass rounded-2xl p-4 shadow-xl border border-white/30"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white mb-2">
                  <GraduationCap size={20} />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Our Teachers</h3>
                <p className="text-xs text-gray-500">View all teachers</p>
              </motion.div>
            </Link>
            
            <Link href="/teacher/login">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="glass rounded-2xl p-4 shadow-xl border border-white/30"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white mb-2">
                  <LogIn size={20} />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Teacher Login</h3>
                <p className="text-xs text-gray-500">For teachers</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Today's Highlights */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={24} className="text-purple-500" />
            <h2 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🌟 Today's Highlights
            </h2>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="glass rounded-2xl p-5 h-40 animate-pulse"
                />
              ))}
            </div>
          ) : highlights.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center shadow-xl border border-white/30">
              <Sparkles size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No highlights for today</p>
              <p className="text-gray-400 text-sm mt-1">Teachers can highlight important posts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <HighlightCard 
                    id={item.id}
                    title={item.title}
                    content={item.content}
                    type={item.type}
                    teacher={item.teacher?.name}
                    subject={item.subject?.name}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Notice Board */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <NoticeBoard />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-3xl p-6 text-center shadow-2xl border border-white/30 bg-gradient-to-br from-white/90 to-indigo-50/80"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart size={16} className="fill-pink-500 text-pink-500" />
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <Sparkles size={16} className="text-cyan-500" />
          </div>
          <p className="font-black text-gray-800 text-lg">Mahabodhi Mahavidyalaya</p>
          <p className="text-sm text-gray-600 mb-2 font-medium">B.Ed & D.El.Ed College</p>
          <p className="text-sm text-indigo-600 font-semibold">
            Ras Bihari High School Nalanda
          </p>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  )
}
