'use client';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Users, BookOpen, GraduationCap, Star, Award, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

const sectionIcons = [BookOpen, GraduationCap, Star, Award, Users, TrendingUp, Star];
const sectionColors = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-green-400 to-green-600',
  'from-yellow-400 to-yellow-600',
  'from-orange-400 to-orange-600',
  'from-indigo-400 to-indigo-600',
];

export default function ClassPage() {
  const router = useRouter();
  const params = useParams();
  const [sections, setSections] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sectionsRes, classesRes] = await Promise.all([
          fetch('/api/sections'),
          fetch('/api/classes')
        ]);
        const sectionsData = await sectionsRes.json();
        const classesData = await classesRes.json();

        setSections(sectionsData);
        setSelectedClass(classesData.find((c: any) => c.id === params.class));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

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
          <button onClick={() => router.push('/classes')} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-xl">Select Section</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800">Class {selectedClass?.name}</h2>
          <p className="text-gray-500 mt-2">Choose your section</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {sections.map((section, i) => {
            const Icon = sectionIcons[i];
            const colorClass = sectionColors[i];
            return (
              <motion.div
                key={section.id}
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
                whileHover={{ scale: 1.1, rotate: 2, y: -8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/classes/${params.class}/${section.id}`)}
                className="relative overflow-hidden rounded-2xl cursor-pointer shadow-xl"
              >
                <div className={`bg-gradient-to-br ${colorClass} p-6 text-white`}>
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 opacity-20">
                    <Icon size={80} />
                  </div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 shadow-lg">
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-black tracking-wide">Section {section.name}</h3>
                    <div className="mt-2 flex items-center gap-1 text-white/80 text-sm">
                      <Star size={14} fill="currentColor" />
                      <span>Ready to Learn!</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/10 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
