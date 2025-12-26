'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Mail, ArrowLeft } from 'lucide-react'

export default function CheckoutSuccess() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7A50]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            ¡Gracias por tu compra!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Tu pedido ha sido procesado correctamente.
          </p>

          {/* Order Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">¿Qué sigue?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#FF7A50]/10 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-[#FF7A50]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Confirmación por email</h3>
                  <p className="text-gray-600 text-sm">
                    Recibirás un email con los detalles de tu pedido y la factura.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#FF7A50]/10 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-[#FF7A50]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Preparación y envío</h3>
                  <p className="text-gray-600 text-sm">
                    Prepararemos tu obra con el máximo cuidado. Te notificaremos cuando sea enviada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-amber-50 rounded-xl p-6 mb-8">
            <p className="text-amber-800">
              ¿Tienes alguna pregunta? Contáctanos en{' '}
              <a href="mailto:info@pilirey.com" className="font-medium underline">
                info@pilirey.com
              </a>
            </p>
          </div>

          {/* Back Button */}
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 bg-[#FF7A50] hover:bg-[#FF5722] text-white px-8 py-4 rounded-xl font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver a la galería
          </Link>
        </div>
      </div>
    </div>
  )
}
