'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/galeria', label: 'Galería' },
    { path: '/sobre-mi', label: 'Sobre Pili' },
    { path: '/contacto', label: 'Contacto' }
  ]

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <h1 className="text-2xl md:text-3xl font-script text-[#FF7A50] group-hover:text-[#FF5722] transition-colors">
              Pili Rey
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-base font-medium transition-colors relative py-2 ${
                  isActive(link.path) 
                    ? 'text-[#FF7A50]' 
                    : 'text-gray-700 hover:text-[#FF7A50]'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7A50]"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-[#FF7A50]/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-neutral-200 pt-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium transition-colors py-3 px-4 rounded-lg ${
                    isActive(link.path) 
                      ? 'text-[#FF7A50] bg-[#FF7A50]/10' 
                      : 'text-gray-700 hover:text-[#FF7A50] hover:bg-[#FF7A50]/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
