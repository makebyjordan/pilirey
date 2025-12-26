'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, Palette, Heart, Star } from 'lucide-react';
import InteractiveCarousel from '@/components/InteractiveCarousel';

interface Artwork {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

export default function Home() {
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch('/api/artworks?featured=true')
      .then(res => res.json())
      .then(data => setFeaturedArtworks(data.slice(0, 5)))
      .catch(console.error);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArtworks.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredArtworks.length) % featuredArtworks.length);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Descubre la belleza 
              <span className="block font-script text-[#E8B87D] text-5xl md:text-6xl mt-2">
                del arte al óleo
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
              Explora mi colección de obras pintadas con pasión y dedicación. Más de 50 años capturando la esencia del color y la luz mediterránea.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/galeria">
                <button className="bg-[#FF7A50] hover:bg-[#FF5722] text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center">
                  Explorar Colección
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
              <Link href="/contacto">
                <button className="border-2 border-gray-300 hover:border-[#FF7A50] px-8 py-4 text-lg rounded-xl transition-all">
                  Contactar
                </button>
              </Link>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="relative">
            {featuredArtworks.length > 0 && (
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                {featuredArtworks.map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                      <h3 className="text-white text-2xl font-display font-semibold mb-1">
                        {artwork.title}
                      </h3>
                      <p className="text-white/90 text-sm">{artwork.category}</p>
                    </div>
                  </div>
                ))}
                
                {/* Navigation Buttons */}
                <div className="absolute bottom-6 right-6 flex space-x-2 z-10">
                  <button
                    onClick={prevSlide}
                    className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-800" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="bg-[#FF7A50] p-3 rounded-full hover:bg-[#FF5722] transition-all shadow-lg"
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </div>

                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-6 flex space-x-2 z-10">
                  {featuredArtworks.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? 'bg-[#FF7A50] w-8'
                          : 'bg-white/60 w-2'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About the Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sobre la 
              <span className="font-script text-[#E8B87D] text-4xl md:text-5xl ml-2">
                Galería
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Bienvenido a mi galería, donde la creatividad florece. Presento colecciones diversas, desde clásicos atemporales hasta arte contemporáneo, conectando artistas y audiencias a través de exposiciones inspiradoras.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center border-none shadow-xl rounded-2xl hover:shadow-2xl transition-shadow bg-neutral-50 p-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF7A50]/10 rounded-full mb-6">
                <Palette className="h-10 w-10 text-[#FF7A50]" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">50+ Años de Arte</h3>
              <p className="text-gray-600 leading-relaxed">
                Medio siglo dedicado al arte de la pintura al óleo con pasión y dedicación.
              </p>
            </div>

            <div className="text-center border-none shadow-xl rounded-2xl hover:shadow-2xl transition-shadow bg-neutral-50 p-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF7A50]/10 rounded-full mb-6">
                <Heart className="h-10 w-10 text-[#FF7A50]" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">Obras Únicas</h3>
              <p className="text-gray-600 leading-relaxed">
                Cada pieza es una creación original, pintada a mano con atención al detalle.
              </p>
            </div>

            <div className="text-center border-none shadow-xl rounded-2xl hover:shadow-2xl transition-shadow bg-neutral-50 p-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF7A50]/10 rounded-full mb-6">
                <Star className="h-10 w-10 text-[#FF7A50]" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">Entrega Segura</h3>
              <p className="text-gray-600 leading-relaxed">
                Envío cuidadoso y certificado para que tu obra llegue en perfecto estado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Carousel */}
      <InteractiveCarousel />

      {/* Featured Artworks Section - Dark Background */}
      <section className="py-20 bg-[#2C3E50]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                Obras 
                <span className="font-script text-[#F5D9B8] ml-2">Destacadas</span>
              </h2>
              <p className="text-white/70 text-lg">Una selección de mis trabajos más queridos</p>
            </div>
            <Link href="/galeria">
              <button className="border border-white text-white hover:bg-white hover:text-[#2C3E50] rounded-xl hidden md:inline-flex px-6 py-3 items-center transition-all">
                Ver Toda la Galería
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredArtworks.slice(0, 3).map((artwork) => (
              <Link href={`/galeria/${artwork.id}`} key={artwork.id} className="group">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white">
                      <h3 className="font-display text-xl font-semibold mb-1">{artwork.title}</h3>
                      <p className="text-sm opacity-90">{artwork.category}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link href="/galeria">
              <button className="border border-white text-white hover:bg-white hover:text-[#2C3E50] rounded-xl px-6 py-3 transition-all">
                Ver Toda la Galería
                <ChevronRight className="ml-2 h-5 w-5 inline" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF7A50] to-[#FF5722] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            ¿Buscas una Obra Especial?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-95">
            Explora mi galería o contáctame para encargos personalizados
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/galeria">
              <button className="bg-white text-[#FF7A50] hover:bg-neutral-100 px-8 py-4 text-lg rounded-xl shadow-lg transition-all">
                Ver Galería
              </button>
            </Link>
            <Link href="/contacto">
              <button className="border-2 border-white text-white hover:bg-white hover:text-[#FF7A50] px-8 py-4 text-lg rounded-xl transition-all">
                Contáctame
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
