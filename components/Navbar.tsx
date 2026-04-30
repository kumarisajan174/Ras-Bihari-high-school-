import { BookOpen, GraduationCap } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 px-4 py-4 shadow-lg border-b border-white/30">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-card flex items-center justify-center text-white shadow-lg">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">Mahabodhi</h1>
            <p className="text-xs text-gray-500">Internship Program</p>
          </div>
        </div>
        <BookOpen className="text-indigo-600" size={24} />
      </div>
    </nav>
  )
}
