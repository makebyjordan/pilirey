import Image from 'next/image'
import Link from 'next/link'

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
}

export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <Link href={`/galeria/${artwork.id}`}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </div>
        <div className="p-5">
          <span className="text-xs uppercase tracking-wider text-[#FF7A50] font-semibold">
            {artwork.category}
          </span>
          <h3 className="text-xl font-display mt-1 text-gray-900 group-hover:text-[#FF7A50] transition-colors">
            {artwork.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{artwork.technique}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-[#FF7A50] font-semibold">
              {artwork.price.toLocaleString('es-ES')} €
            </span>
            <span className="text-sm text-gray-400">{artwork.year}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
