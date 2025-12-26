import Link from 'next/link'
import { Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-display text-xl mb-4">Pili Rey</h3>
            <p className="text-sm leading-relaxed">
              Artista pintora especializada en óleo. Más de 50 años dedicados al arte y la belleza.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/galeria" className="text-sm hover:text-[#FF7A50] transition-colors">
                  Galería
                </Link>
              </li>
              <li>
                <Link href="/sobre-mi" className="text-sm hover:text-[#FF7A50] transition-colors">
                  Sobre Pili
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm hover:text-[#FF7A50] transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">pilirey.arte@email.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+34 600 123 456</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Valencia, España</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Sígueme</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FF7A50] p-3 rounded-full hover:bg-[#FF5722] transition-colors"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
            </div>
            <p className="text-sm mt-4">Sígueme en Instagram para ver mi proceso creativo y nuevas obras.</p>
            
            {/* Admin Panel Button */}
            <Link
              href="/admin"
              className="inline-block mt-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              PANEL
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Pili Rey. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
