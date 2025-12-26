'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  LayoutDashboard, ImageIcon, MessageSquare, LogOut, Plus, 
  FileText, Instagram, Settings, Trash2, Edit, X, Save,
  ExternalLink, Star, Menu
} from 'lucide-react'

interface Artwork {
  id: number
  title: string
  description: string | null
  category: string
  technique: string
  year: number
  dimensions: string | null
  price: number
  imageUrl: string
  featured: boolean
  available: boolean
}

interface Message {
  id: number
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

interface SocialPost {
  id: number
  platform: string
  postUrl: string
  imageUrl: string
  caption: string | null
  isActive: boolean
}

interface ContentSection {
  id: number
  page: string
  sectionKey: string
  title: string | null
  subtitle: string | null
  content: string | null
  imageUrl: string | null
  buttonText: string | null
  buttonLink: string | null
  order: number
}

interface Order {
  id: number
  stripeSessionId: string
  stripePaymentId: string | null
  customerEmail: string
  customerName: string
  customerPhone: string | null
  shippingAddress: string | null
  artworkId: number
  artworkTitle: string
  artworkPrice: number
  status: string
  estimatedDays: number | null
  trackingNumber: string | null
  notes: string | null
  createdAt: string
}

type Tab = 'dashboard' | 'artworks' | 'content' | 'orders' | 'messages' | 'social'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedPage, setSelectedPage] = useState('home')
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [showArtworkModal, setShowArtworkModal] = useState(false)
  const [showSocialModal, setShowSocialModal] = useState(false)
  const [showContentModal, setShowContentModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null)
  const [editingSocial, setEditingSocial] = useState<SocialPost | null>(null)
  const [editingContent, setEditingContent] = useState<ContentSection | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderForm, setOrderForm] = useState({
    estimatedDays: 0,
    trackingNumber: '',
    notes: '',
    status: 'pending'
  })

  // Form states
  const [artworkForm, setArtworkForm] = useState({
    title: '', description: '', category: 'Paisajes', technique: 'Óleo sobre lienzo',
    year: new Date().getFullYear(), dimensions: '', price: 0, imageUrl: '', featured: false, available: true
  })
  const [socialForm, setSocialForm] = useState({
    platform: 'instagram', postUrl: '', imageUrl: '', caption: '', isActive: true
  })
  const [contentForm, setContentForm] = useState({
    page: 'about', sectionKey: '', title: '', subtitle: '', content: '', imageUrl: '', buttonText: '', buttonLink: '', order: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const [artworksRes, messagesRes, socialRes, contentRes, ordersRes] = await Promise.all([
        fetch('/api/artworks'),
        fetch('/api/contact'),
        fetch('/api/social'),
        fetch('/api/content'),
        fetch('/api/orders')
      ])
      setArtworks(await artworksRes.json())
      setMessages(await messagesRes.json())
      setSocialPosts(await socialRes.json())
      setContentSections(await contentRes.json())
      setOrders(await ordersRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Order functions
  const openOrderModal = (order: Order) => {
    setSelectedOrder(order)
    setOrderForm({
      estimatedDays: order.estimatedDays || 0,
      trackingNumber: order.trackingNumber || '',
      notes: order.notes || '',
      status: order.status
    })
    setShowOrderModal(true)
  }

  const saveOrder = async () => {
    if (!selectedOrder) return
    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedOrder.id,
          ...orderForm
        })
      })
      fetchData()
      setShowOrderModal(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Content CRUD
  const openContentModal = (section?: ContentSection) => {
    if (section) {
      setEditingContent(section)
      setContentForm({
        page: section.page, sectionKey: section.sectionKey, title: section.title || '',
        subtitle: section.subtitle || '', content: section.content || '',
        imageUrl: section.imageUrl || '', buttonText: section.buttonText || '',
        buttonLink: section.buttonLink || '', order: section.order
      })
    } else {
      setEditingContent(null)
      const maxOrder = contentSections.filter(s => s.page === selectedPage).length
      setContentForm({
        page: selectedPage, sectionKey: '', title: '', subtitle: '', content: '',
        imageUrl: '', buttonText: '', buttonLink: '', order: maxOrder
      })
    }
    setShowContentModal(true)
  }

  const saveContent = async () => {
    const url = editingContent ? `/api/content/${editingContent.id}` : '/api/content'
    const method = editingContent ? 'PUT' : 'POST'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentForm)
    })
    setShowContentModal(false)
    fetchData()
  }

  const deleteContent = async (id: number) => {
    if (confirm('¿Eliminar esta sección?')) {
      await fetch(`/api/content/${id}`, { method: 'DELETE' })
      fetchData()
    }
  }

  const moveSection = async (section: ContentSection, direction: 'up' | 'down') => {
    const pageSections = contentSections
      .filter(s => s.page === section.page)
      .sort((a, b) => a.order - b.order)
    
    const currentIndex = pageSections.findIndex(s => s.id === section.id)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex < 0 || newIndex >= pageSections.length) return
    
    const otherSection = pageSections[newIndex]
    
    // Swap orders
    await Promise.all([
      fetch(`/api/content/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...section, order: otherSection.order })
      }),
      fetch(`/api/content/${otherSection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...otherSection, order: section.order })
      })
    ])
    fetchData()
  }

  const filteredSections = contentSections
    .filter(s => s.page === selectedPage)
    .sort((a, b) => a.order - b.order)

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin')
  }

  // Artwork CRUD
  const openArtworkModal = (artwork?: Artwork) => {
    if (artwork) {
      setEditingArtwork(artwork)
      setArtworkForm({
        title: artwork.title, description: artwork.description || '', category: artwork.category,
        technique: artwork.technique, year: artwork.year, dimensions: artwork.dimensions || '',
        price: artwork.price, imageUrl: artwork.imageUrl, featured: artwork.featured, available: artwork.available
      })
    } else {
      setEditingArtwork(null)
      setArtworkForm({
        title: '', description: '', category: 'Paisajes', technique: 'Óleo sobre lienzo',
        year: new Date().getFullYear(), dimensions: '', price: 0, imageUrl: '', featured: false, available: true
      })
    }
    setShowArtworkModal(true)
  }

  const saveArtwork = async () => {
    const url = editingArtwork ? `/api/artworks/${editingArtwork.id}` : '/api/artworks'
    const method = editingArtwork ? 'PUT' : 'POST'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artworkForm)
    })
    setShowArtworkModal(false)
    fetchData()
  }

  const deleteArtwork = async (id: number) => {
    if (confirm('¿Eliminar esta obra?')) {
      await fetch(`/api/artworks/${id}`, { method: 'DELETE' })
      fetchData()
    }
  }

  // Social CRUD
  const openSocialModal = (post?: SocialPost) => {
    if (post) {
      setEditingSocial(post)
      setSocialForm({
        platform: post.platform, postUrl: post.postUrl, imageUrl: post.imageUrl,
        caption: post.caption || '', isActive: post.isActive
      })
    } else {
      setEditingSocial(null)
      setSocialForm({ platform: 'instagram', postUrl: '', imageUrl: '', caption: '', isActive: true })
    }
    setShowSocialModal(true)
  }

  const saveSocial = async () => {
    const url = editingSocial ? `/api/social/${editingSocial.id}` : '/api/social'
    const method = editingSocial ? 'PUT' : 'POST'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(socialForm)
    })
    setShowSocialModal(false)
    fetchData()
  }

  const deleteSocial = async (id: number) => {
    if (confirm('¿Eliminar esta publicación?')) {
      await fetch(`/api/social/${id}`, { method: 'DELETE' })
      fetchData()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'artworks', label: 'Obras de Arte', icon: ImageIcon },
    { id: 'content', label: 'Contenido Web', icon: FileText },
    { id: 'orders', label: 'Pedidos', icon: Settings },
    { id: 'messages', label: 'Mensajes', icon: MessageSquare },
    { id: 'social', label: 'Redes Sociales', icon: Instagram },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-[#2C3E50] text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <h1 className="font-display text-lg font-bold">Pili Rey Admin</h1>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-white/10 rounded-lg"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-[55]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-[#2C3E50] text-white min-h-screen fixed left-0 top-0 z-[58] transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6 border-b border-white/10">
          <h1 className="font-display text-xl font-bold">Pili Rey</h1>
          <p className="text-gray-400 text-sm">Panel Admin</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as Tab); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-[#FF7A50] text-white' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white mb-3 text-sm">
            <ExternalLink className="h-4 w-4" /> Ver sitio web
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total de Obras</p>
                    <p className="text-4xl font-bold text-gray-900">{artworks.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Obras Disponibles</p>
                    <p className="text-4xl font-bold text-gray-900">{artworks.filter(a => a.available).length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Mensajes</p>
                    <p className="text-4xl font-bold text-gray-900">{messages.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Obras Destacadas</p>
                    <p className="text-4xl font-bold text-gray-900">{artworks.filter(a => a.featured).length}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FF7A50] rounded-xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access & Welcome */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Accesos Rápidos</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('artworks')}
                    className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <p className="font-medium text-gray-900">Gestionar Obras</p>
                    <p className="text-sm text-gray-500">Añadir, editar o eliminar obras de arte</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('messages')}
                    className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <p className="font-medium text-gray-900">Ver Mensajes</p>
                    <p className="text-sm text-gray-500">Revisar mensajes de contacto</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('social')}
                    className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <p className="font-medium text-gray-900">Redes Sociales</p>
                    <p className="text-sm text-gray-500">Configurar APIs de redes sociales</p>
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Bienvenida</h3>
                <p className="text-gray-600 mb-4">
                  ¡Bienvenida al panel de administración de tu sitio web! Desde aquí puedes gestionar todas tus obras de arte, revisar mensajes de clientes y configurar tus redes sociales.
                </p>
                <div className="bg-amber-50 rounded-lg p-4">
                  <p className="font-medium text-amber-800 mb-2">💡 Consejos:</p>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Mantén actualizadas las obras destacadas</li>
                    <li>• Responde rápidamente a los mensajes</li>
                    <li>• Configura Instagram para mostrar tu proceso creativo</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Artworks */}
        {activeTab === 'artworks' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-display text-3xl font-bold text-gray-900">Gestión de Obras</h2>
              <button
                onClick={() => openArtworkModal()}
                className="flex items-center gap-2 bg-[#FF7A50] hover:bg-[#FF5722] text-white px-6 py-3 rounded-xl transition-colors"
              >
                <Plus className="h-5 w-5" /> Nueva Obra
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map(artwork => (
                <div key={artwork.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative h-64">
                    <Image src={artwork.imageUrl} alt={artwork.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg">{artwork.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                        {artwork.category}
                      </span>
                      {artwork.featured && (
                        <span className="bg-[#FF7A50] text-white text-xs px-3 py-1 rounded-full">
                          Destacada
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{artwork.year} • {artwork.dimensions}</p>
                    <p className="text-[#FF7A50] font-bold text-xl mt-2">€{artwork.price.toLocaleString('es-ES', {minimumFractionDigits: 2})}</p>
                    
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => openArtworkModal(artwork)}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="h-4 w-4" /> Editar
                      </button>
                      <button
                        onClick={() => deleteArtwork(artwork.id)}
                        className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Management */}
        {activeTab === 'content' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900">Gestión de Contenido</h2>
                <p className="text-gray-500">Edita textos, imágenes y crea nuevas secciones para tu sitio web</p>
              </div>
              <button 
                onClick={() => openContentModal()}
                className="flex items-center gap-2 bg-[#FF7A50] hover:bg-[#FF5722] text-white px-6 py-3 rounded-xl"
              >
                <Plus className="h-5 w-5" /> Nueva Sección
              </button>
            </div>

            {/* Page Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Página</label>
              <select 
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="about">Sobre Pili</option>
                <option value="home">Inicio</option>
                <option value="gallery">Galería</option>
                <option value="contact">Contacto</option>
              </select>
            </div>
            
            {/* Content Sections */}
            <div className="space-y-6">
              {filteredSections.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay secciones en esta página</p>
                  <button 
                    onClick={() => openContentModal()}
                    className="mt-4 text-[#FF7A50] hover:underline"
                  >
                    + Crear primera sección
                  </button>
                </div>
              ) : (
                filteredSections.map((section, index) => (
                  <div key={section.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            section.imageUrl ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {section.imageUrl ? 'Texto + Imagen' : 'Solo Texto'}
                          </span>
                          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                            {section.sectionKey}
                          </span>
                        </div>
                        <h3 className="font-semibold text-xl text-gray-900">{section.title}</h3>
                        {section.subtitle && (
                          <p className="text-gray-500 text-sm mt-1">{section.subtitle}</p>
                        )}
                        {section.content && (
                          <p className="text-gray-600 mt-3 text-sm leading-relaxed line-clamp-2">
                            {section.content}
                          </p>
                        )}
                        {section.imageUrl && (
                          <div className="mt-4 flex gap-2">
                            <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden relative">
                              <Image src={section.imageUrl} alt="Preview" fill className="object-cover" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button 
                          onClick={() => moveSection(section, 'up')}
                          disabled={index === 0}
                          className={`p-2 rounded-lg ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                          ↑
                        </button>
                        <button 
                          onClick={() => moveSection(section, 'down')}
                          disabled={index === filteredSections.length - 1}
                          className={`p-2 rounded-lg ${index === filteredSections.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                          ↓
                        </button>
                        <button 
                          onClick={() => openContentModal(section)}
                          className="p-2 hover:bg-gray-100 rounded-lg border flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" /> Editar
                        </button>
                        <button 
                          onClick={() => deleteContent(section.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Social Posts */}
        {activeTab === 'social' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900">Configuración de Redes Sociales</h2>
                <p className="text-gray-500">Configura las APIs de tus redes sociales para mostrar contenido en tu sitio web</p>
              </div>
              <button
                onClick={() => openSocialModal()}
                className="flex items-center gap-2 bg-[#FF7A50] hover:bg-[#FF5722] text-white px-6 py-3 rounded-xl"
              >
                <Plus className="h-5 w-5" /> Añadir Red Social
              </button>
            </div>

            <h3 className="font-semibold text-xl text-gray-900 mb-6">Redes Sociales Principales</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Instagram */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Instagram className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Instagram</h4>
                    <p className="text-sm text-gray-500">@pilireyarte</p>
                  </div>
                  <span className="ml-auto bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">Activo</span>
                </div>

                <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                  📋 Instrucciones: Ve a Instagram Developers → Crear App → Obtén Access Token
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Ingresa tu API Key" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Secret (Opcional)</label>
                    <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Ingresa tu API Secret" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Access Token (Opcional)</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Ingresa tu Access Token" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usuario/Perfil</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" defaultValue="@pilireyarte" />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#FF7A50] hover:bg-[#FF5722] text-white py-2 rounded-lg">
                    <Save className="h-4 w-4" /> Guardar
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">
                    Activar
                  </button>
                </div>
              </div>

              {/* Facebook */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">f</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Facebook</h4>
                    <p className="text-sm text-gray-500">@usuario</p>
                  </div>
                  <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">Inactivo</span>
                </div>

                <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                  📋 Instrucciones: Ve a Facebook Developers → Crear App → Obtén App ID y Secret
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Ingresa tu API Key" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Secret (Opcional)</label>
                    <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Ingresa tu API Secret" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Access Token (Opcional)</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Ingresa tu Access Token" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usuario/Perfil</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="@usuario" />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#FF7A50] hover:bg-[#FF5722] text-white py-2 rounded-lg">
                    <Save className="h-4 w-4" /> Guardar
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">
                    Activar
                  </button>
                </div>
              </div>
            </div>

            {/* Integration Guide */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                📝 Guía de Integración
              </h4>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Instagram:</strong> Necesitas crear una aplicación en <a href="https://developers.facebook.com" className="text-[#FF7A50] hover:underline">Facebook Developers</a> y obtener un Access Token de Instagram Basic Display API.</p>
                <p><strong>Facebook:</strong> Crea una app en Facebook Developers para obtener App ID y App Secret.</p>
                <p><strong>Redes Personalizadas:</strong> Puedes añadir cualquier red social o servicio que tenga una API REST. Solo necesitas las credenciales correspondientes.</p>
              </div>
              <div className="mt-4 bg-amber-50 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  💡 <strong>Tip:</strong> Para simplificar la configuración de Instagram, puedes usar las claves de Emergent LLM que gestionan la autenticación automáticamente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {activeTab === 'messages' && (
          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-8">Mensajes</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6">Nombre</th>
                    <th className="text-left py-4 px-6">Email</th>
                    <th className="text-left py-4 px-6">Asunto</th>
                    <th className="text-left py-4 px-6">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(msg => (
                    <tr key={msg.id} className="border-t hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{msg.name}</td>
                      <td className="py-4 px-6 text-gray-600">{msg.email}</td>
                      <td className="py-4 px-6">{msg.subject}</td>
                      <td className="py-4 px-6 text-gray-500 text-sm">
                        {new Date(msg.createdAt).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders/Pedidos */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-8">Gestión de Pedidos</h2>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Total Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Pagados</p>
                <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'paid').length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Ingresos</p>
                <p className="text-2xl font-bold text-[#FF7A50]">€{orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.artworkPrice, 0).toFixed(2)}</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">Sin pedidos aún</h3>
                <p className="text-gray-500">
                  Los pedidos aparecerán aquí cuando los clientes compren obras a través de la tienda.
                </p>
              </div>
            ) : (
              <>
                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl shadow-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-gray-900">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'paid' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'expired' ? 'bg-red-100 text-red-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status === 'paid' ? 'Pagado' : 
                           order.status === 'pending' ? 'Pendiente' : 
                           order.status === 'expired' ? 'Expirado' :
                           order.status === 'shipped' ? 'Enviado' : order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-2">{order.artworkTitle}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-[#FF7A50]">€{order.artworkPrice.toFixed(2)}</p>
                        <button
                          onClick={() => openOrderModal(order)}
                          className="text-[#FF7A50] hover:text-[#FF5722] text-sm font-medium"
                        >
                          Ver detalles →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Obra</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entrega</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-500">#{order.id}</td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                              <p className="text-sm text-gray-500">{order.customerEmail}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{order.artworkTitle}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">€{order.artworkPrice.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                order.status === 'expired' ? 'bg-red-100 text-red-700' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {order.status === 'paid' ? 'Pagado' : 
                                 order.status === 'pending' ? 'Pendiente' : 
                                 order.status === 'expired' ? 'Expirado' :
                                 order.status === 'shipped' ? 'Enviado' : order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {order.estimatedDays ? `${order.estimatedDays} días` : '-'}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => openOrderModal(order)}
                                className="text-[#FF7A50] hover:text-[#FF5722] text-sm font-medium"
                              >
                                Ver detalles
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Artwork Modal */}
      {showArtworkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="font-display text-xl font-bold">
                {editingArtwork ? 'Editar Obra' : 'Nueva Obra'}
              </h3>
              <button onClick={() => setShowArtworkModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <input
                    type="text"
                    value={artworkForm.title}
                    onChange={e => setArtworkForm({...artworkForm, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <select
                    value={artworkForm.category}
                    onChange={e => setArtworkForm({...artworkForm, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option>Paisajes</option>
                    <option>Bodegones</option>
                    <option>Retratos</option>
                    <option>Abstracto</option>
                    <option>Marino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Técnica</label>
                  <input
                    type="text"
                    value={artworkForm.technique}
                    onChange={e => setArtworkForm({...artworkForm, technique: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Año</label>
                  <input
                    type="number"
                    value={artworkForm.year}
                    onChange={e => setArtworkForm({...artworkForm, year: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dimensiones</label>
                  <input
                    type="text"
                    value={artworkForm.dimensions}
                    onChange={e => setArtworkForm({...artworkForm, dimensions: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="60x80 cm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precio (€)</label>
                  <input
                    type="number"
                    value={artworkForm.price}
                    onChange={e => setArtworkForm({...artworkForm, price: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL de Imagen</label>
                <input
                  type="text"
                  value={artworkForm.imageUrl}
                  onChange={e => setArtworkForm({...artworkForm, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  value={artworkForm.description}
                  onChange={e => setArtworkForm({...artworkForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={artworkForm.featured}
                    onChange={e => setArtworkForm({...artworkForm, featured: e.target.checked})}
                    className="w-4 h-4 text-[#FF7A50]"
                  />
                  <span className="text-sm">Destacada</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={artworkForm.available}
                    onChange={e => setArtworkForm({...artworkForm, available: e.target.checked})}
                    className="w-4 h-4 text-[#FF7A50]"
                  />
                  <span className="text-sm">Disponible</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowArtworkModal(false)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveArtwork}
                className="flex items-center gap-2 bg-[#FF7A50] hover:bg-[#FF5722] text-white px-6 py-2 rounded-lg"
              >
                <Save className="h-4 w-4" /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Modal */}
      {showSocialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="font-display text-xl font-bold">
                {editingSocial ? 'Editar Publicación' : 'Nueva Publicación'}
              </h3>
              <button onClick={() => setShowSocialModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Plataforma</label>
                <select
                  value={socialForm.platform}
                  onChange={e => setSocialForm({...socialForm, platform: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL del Post</label>
                <input
                  type="text"
                  value={socialForm.postUrl}
                  onChange={e => setSocialForm({...socialForm, postUrl: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL de Imagen</label>
                <input
                  type="text"
                  value={socialForm.imageUrl}
                  onChange={e => setSocialForm({...socialForm, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  value={socialForm.caption}
                  onChange={e => setSocialForm({...socialForm, caption: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowSocialModal(false)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveSocial}
                className="flex items-center gap-2 bg-[#FF7A50] hover:bg-[#FF5722] text-white px-6 py-2 rounded-lg"
              >
                <Save className="h-4 w-4" /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Modal */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="font-display text-xl font-bold">
                {editingContent ? 'Editar Sección' : 'Nueva Sección'}
              </h3>
              <button onClick={() => setShowContentModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Página</label>
                  <select
                    value={contentForm.page}
                    onChange={e => setContentForm({...contentForm, page: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="home">Inicio</option>
                    <option value="about">Sobre Pili</option>
                    <option value="gallery">Galería</option>
                    <option value="contact">Contacto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Clave de Sección</label>
                  <input
                    type="text"
                    value={contentForm.sectionKey}
                    onChange={e => setContentForm({...contentForm, sectionKey: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="hero, historia, estudio..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={contentForm.title}
                  onChange={e => setContentForm({...contentForm, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={contentForm.subtitle}
                  onChange={e => setContentForm({...contentForm, subtitle: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contenido</label>
                <textarea
                  value={contentForm.content}
                  onChange={e => setContentForm({...contentForm, content: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL de Imagen (opcional)</label>
                <input
                  type="text"
                  value={contentForm.imageUrl}
                  onChange={e => setContentForm({...contentForm, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="https://..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Texto del Botón (opcional)</label>
                  <input
                    type="text"
                    value={contentForm.buttonText}
                    onChange={e => setContentForm({...contentForm, buttonText: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Ver más..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL del Botón (opcional)</label>
                  <input
                    type="text"
                    value={contentForm.buttonLink}
                    onChange={e => setContentForm({...contentForm, buttonLink: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="/galeria"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowContentModal(false)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveContent}
                className="flex items-center gap-2 bg-[#FF7A50] hover:bg-[#FF5722] text-white px-6 py-2 rounded-lg"
              >
                <Save className="h-4 w-4" /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="font-display text-xl font-bold">
                Pedido #{selectedOrder.id}
              </h3>
              <button onClick={() => setShowOrderModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Datos del Cliente</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nombre:</span>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Teléfono:</span>
                    <p className="font-medium">{selectedOrder.customerPhone || 'No proporcionado'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha pedido:</span>
                    <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Dirección de Envío</h4>
                <p className="text-gray-700 whitespace-pre-line">{selectedOrder.shippingAddress || 'No proporcionada'}</p>
              </div>

              {/* Order Info */}
              <div className="bg-orange-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Detalles del Pedido</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{selectedOrder.artworkTitle}</p>
                    <p className="text-sm text-gray-500">ID Obra: {selectedOrder.artworkId}</p>
                  </div>
                  <p className="text-2xl font-bold text-[#FF7A50]">€{selectedOrder.artworkPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <select
                      value={orderForm.status}
                      onChange={e => setOrderForm({...orderForm, status: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="paid">Pagado</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="expired">Expirado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Días estimados de entrega</label>
                    <input
                      type="number"
                      min="0"
                      value={orderForm.estimatedDays}
                      onChange={e => setOrderForm({...orderForm, estimatedDays: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="7"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Número de seguimiento</label>
                  <input
                    type="text"
                    value={orderForm.trackingNumber}
                    onChange={e => setOrderForm({...orderForm, trackingNumber: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="ES123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notas internas</label>
                  <textarea
                    value={orderForm.notes}
                    onChange={e => setOrderForm({...orderForm, notes: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Notas sobre el envío, empaquetado, etc."
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveOrder}
                className="flex items-center gap-2 bg-[#FF7A50] hover:bg-[#FF5722] text-white px-6 py-2 rounded-lg"
              >
                <Save className="h-4 w-4" /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
