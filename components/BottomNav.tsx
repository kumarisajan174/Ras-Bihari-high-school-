'use client'
import { Home, BookOpen, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/classes', label: 'Classes', icon: BookOpen },
    { href: '/admin', label: 'Admin', icon: Settings },
  ]

  return (
    <nav className="glass fixed bottom-0 left-0 right-0 z-50 border-t border-white/30 shadow-lg">
      <div className="max-w-md mx-auto flex justify-around py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
