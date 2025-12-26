import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BuyButton from "@/components/BuyButton";

async function getArtwork(id: number) {
  return await prisma.artwork.findUnique({
    where: { id }
  });
}

export default async function ArtworkDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const artwork = await getArtwork(parseInt(id));

  if (!artwork) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link 
          href="/galeria"
          className="inline-flex items-center text-[#FF7A50] hover:text-[#FF5722] mb-8"
        >
          ← Volver a la galería
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <span className="text-sm uppercase tracking-wider text-[#FF7A50] font-semibold mb-2">
              {artwork.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
              {artwork.title}
            </h1>
            
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 md:flex md:gap-8 gap-4 text-gray-600">
                <div>
                  <span className="text-sm text-gray-400">Técnica</span>
                  <p className="text-sm md:text-base">{artwork.technique}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Año</span>
                  <p className="text-sm md:text-base">{artwork.year}</p>
                </div>
                {artwork.dimensions && (
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-sm text-gray-400">Dimensiones</span>
                    <p className="text-sm md:text-base">{artwork.dimensions}</p>
                  </div>
                )}
              </div>
            </div>

            {artwork.description && (
              <p className="text-gray-600 leading-relaxed mb-8">
                {artwork.description}
              </p>
            )}

            <div className="border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-sm text-gray-400">Precio</span>
                  <p className="text-3xl font-semibold text-[#FF7A50]">
                    {artwork.price.toLocaleString('es-ES')} €
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm ${
                  artwork.available 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {artwork.available ? 'Disponible' : 'Vendida'}
                </span>
              </div>

              <BuyButton
                artworkId={artwork.id}
                artworkTitle={artwork.title}
                artworkPrice={artwork.price}
                available={artwork.available}
              />
              
              <Link
                href={`/contacto?artwork=${artwork.id}`}
                className="block w-full text-center mt-4 text-[#FF7A50] hover:text-[#FF5722] font-medium"
              >
                ¿Tienes dudas? Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
