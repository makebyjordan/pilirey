import { prisma } from "@/lib/prisma";
import ArtworkCard from "@/components/ArtworkCard";

interface Artwork {
  id: number;
  title: string;
  description: string | null;
  category: string;
  technique: string;
  year: number;
  dimensions: string | null;
  price: number;
  imageUrl: string;
}

async function getArtworks(): Promise<Artwork[]> {
  return await prisma.artwork.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export default async function GaleriaPage() {
  const artworks = await getArtworks();
  const categories: string[] = [...new Set(artworks.map((a: Artwork) => a.category))];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4">Galería</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explora mi colección completa de obras. Cada pieza es única y está disponible para adquisición.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <span className="px-4 py-2 bg-[#FF7A50] text-white rounded-full cursor-pointer">
            Todas
          </span>
          {categories.map((category) => (
            <span 
              key={category}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full cursor-pointer hover:bg-[#FF7A50] hover:text-white transition-colors"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((artwork: Artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>

        {artworks.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>No hay obras disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
