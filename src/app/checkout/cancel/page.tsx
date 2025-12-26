'use client'

import Link from 'next/link'
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react'

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Cancel Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Pago cancelado
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Tu pedido ha sido cancelado. No se ha realizado ningún cargo.
          </p>

          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-left">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">¿Tuviste algún problema?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Si experimentaste algún problema durante el proceso de pago o tienes alguna pregunta, 
                  no dudes en contactarnos. Estaremos encantados de ayudarte.
                </p>
                <a 
                  href="mailto:info@pilirey.com" 
                  className="text-[#FF7A50] hover:underline font-medium"
                >
                  info@pilirey.com
                </a>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/galeria"
              className="inline-flex items-center justify-center gap-2 bg-[#FF7A50] hover:bg-[#FF5722] text-white px-8 py-4 rounded-xl font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver a la galería
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-medium transition-colors border border-gray-200"
            >
              Contactar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
