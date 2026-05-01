'use client';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  BookOpen, 
  Calculator, 
  Monitor, 
  Globe, 
  Map, 
  TrendingUp, 
  Zap, 
  FlaskConical, 
  Leaf, 
  ScrollText,
  Rocket,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';

const subjectData: Record<string, { icon: any; color: string; tagline: string }> = {
  'English': { icon: BookOpen, color: 'from-blue-400 to-cyan-500', tagline: 'Read & Write!' },
  'Hindi': { icon: BookOpen, color: 'from-orange-400 to-red-500', tagline: 'हिंदी पढ़ें!' },
  'Sanskrit': { icon: ScrollText, color: 'from-amber-400 to-yellow-500', tagline: 'प्राचीन भाषा!' },
  'Mathematics': { icon: Calculator, color: 'from-purple-400 to-indigo-500', tagline: 'Solve & Excel!' },
  'Computer': { icon: Monitor, color: 'from-cyan-400 to-blue-500', tagline: 'Code & Create!' },
  'Political Science': { icon: Globe, color: 'from-teal-400 to-emerald-500', tagline: 'Know the World!' },
  'Geography': { icon: Map, color: 'from-green-400 to-lime-500', tagline: 'Explore Earth!' },
  'Economics': { icon: TrendingUp, color: 'from-emerald-400 to-teal-500', tagline: 'Learn & Grow!' },
  'Physics': { icon: Zap, color: 'from-yellow-400 to-amber-500', tagline: 'Discover Science!' },
  'Chemistry': { icon: FlaskConical, color: 'from-pink-400 to-rose-500', tagline: 'Mix & Experiment!' },
  'Biology': { icon: Leaf, color: 'from-lime-400 to-green-500', tagline: 'Study Life!' },
};

export default function SectionPage() {
  const router = useRouter();
  const params = useParams();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const subjectsRes = await fetch('/api/subjects');
        const subjectsData = await subjectsRes.json();
        setSubjects(subjectsData);
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
          <button onClick={() => router.back()} className="p-2 rounded-xl bg-white/80 hover:bg-white">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-800 text-xl">Select Subject</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800">
            Class {params.class} - Section {params.section}
          </h2>
          <p className="text-gray-500 mt-2">Choose your subject</p>
        </motion.div>

        <div className="space-y-4">
          {subjects.map((subject, i) => {
            const data = subjectData[subject.name] || { 
              icon: Rocket, 
              color: 'from-indigo-400 to-purple-500', 
              tagline: 'Let\'s Learn!' 
            };
            const Icon = data.icon;
            
            return (
              <motion.div
                key={subject.id}
                initial={{ x: -50, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.03, x: 8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/classes/${params.class}/${params.section}/${encodeURIComponent(subject.name)}`)}
                className="relative overflow-hidden rounded-2xl cursor-pointer shadow-xl"
              >
                <div className={`bg-gradient-to-r ${data.color} p-6 text-white`}>
                  <div className="absolute -right-8 -top-8 opacity-20">
                    <Icon size={120} />
                  </div>
                  <div className="absolute right-6 top-6">
                    <Sparkles size={20} className="animate-pulse text-white/70" />
                  </div>
                  
                  <div className="relative z-10 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/30">
                      <Icon size={36} className="text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-black tracking-tight">{subject.name}</h3>
                      <div className="mt-2 flex items-center gap-2 text-white/90 font-semibold text-sm">
                        <Rocket size={16} />
                        <span>{data.tagline}</span>
                      </div>
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <ArrowLeft size={20} className="text-white rotate-180" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}