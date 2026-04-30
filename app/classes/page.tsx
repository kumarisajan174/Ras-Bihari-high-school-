'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GraduationCap, Sparkles, Star, Rocket } from 'lucide-react';
import { useState, useEffect } from 'react';

const classEmojis = ['🎓', '📚', '🎯', '🌟', '✨'];
const classColors = [
  'from-indigo-400 via-purple-400 to-pink-500',
  'from-emerald-400 via-teal-400 to-cyan-500',
  'from-amber-400 via-orange-400 to-red-500',
  'from-blue-400 via-indigo-400 to-purple-500',
  'from-pink-400 via-rose-400 to-red-500'
];

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch('/api/classes');
        const data = await res.json();
        setClasses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6">
      <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-xl">Select Class</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {classes.map((cls, i) => {
          const emoji = classEmojis[i % classEmojis.length];
          const color = classColors[i % classColors.length];
          return (
            <motion.div
              key={cls.id}
              initial={{ y: 50, opacity: 0, scale: 0.8, rotate: -3 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 400, damping: 15 }}
              whileHover={{ scale: 1.05, y: -8, rotate: 2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/classes/${cls.id}`)}
              className="relative overflow-hidden rounded-3xl cursor-pointer shadow-2xl"
            >
              <div className={`bg-gradient-to-br ${color} p-6 text-white`}>
                <div className="absolute -right-20 -top-20 opacity-20">
                  <GraduationCap size={220} />
                </div>
                <div className="absolute top-5 right-5">
                  <span className="text-6xl animate-bounce">{emoji}</span>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-4xl font-black mb-2">Class {cls.name}</h3>
                      <p className="text-white/90 text-lg font-semibold flex items-center gap-2">
                        <Rocket size={20} />
                        <span>Ready to Excel!</span>
                      </p>
                    </div>
                    <div className="w-20 h-20 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/30">
                      <GraduationCap size={44} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-white/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/90 font-semibold">
                      <Sparkles size={18} />
                      <span>Choose Your Section!</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, starI) => (
                        <Star 
                          key={starI} 
                          size={16} 
                          className="fill-yellow-300 text-yellow-300"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 pointer-events-none" />
            </motion.div>
          );
        })}
      </main>
    </div>
  );
}
