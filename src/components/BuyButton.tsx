'use client'

import { useState } from 'react'
import { ShoppingCart, X, Loader2 } from 'lucide-react'

interface BuyButtonProps {
  artworkId: number
  artworkTitle: string
  artworkPrice: number
  available: boolean
}

export default function BuyButton({ artworkId, artworkTitle, artworkPrice, available }: BuyButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar el pago. Por favor, inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!available) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-medium cursor-not-allowed"
      >
        Vendido
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-3 bg-[#FF7A50] hover:bg-[#FF5722] text-white py-4 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
      >
        <ShoppingCart className="h-5 w-5" />
        Comprar por €{artworkPrice.toFixed(2)}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="font-display text-xl font-bold text-gray-900">Comprar Obra</h3>
                <p className="text-sm text-gray-500">{artworkTitle}</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7A50] focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7A50] focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7A50] focus:border-transparent"
                  placeholder="+34 600 000 000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección de envío *
                </label>
                <textarea
                  required
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7A50] focus:border-transparent"
                  rows={3}
                  placeholder="Calle, número, piso, código postal, ciudad"
                />
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total a pagar</span>
                  <span className="text-2xl font-bold text-[#FF7A50]">
                    €{artworkPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Envío incluido en España peninsular
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#FF7A50] hover:bg-[#FF5722] disabled:bg-gray-300 text-white py-4 rounded-xl font-medium transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Proceder al pago
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Pago seguro procesado por Stripe. Tus datos están protegidos.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
