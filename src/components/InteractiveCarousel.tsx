'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

interface Artwork {
  id: number
  title: string
  description: string | null
  category: string
  year: number
  dimensions: string | null
  price: number
  imageUrl: string
  featured: boolean
}

export default function InteractiveCarousel() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const swiperRef = useRef<SwiperType | null>(null)
  const [isHoveringArrow, setIsHoveringArrow] = useState(false)

  useEffect(() => {
    fetch('/api/artworks')
      .then(res => res.json())
      .then(data => {
        setArtworks(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Auto slide continuo
  useEffect(() => {
    if (!swiperRef.current || artworks.length === 0 || isHoveringArrow) return
    
    const interval = setInterval(() => {
      if (swiperRef.current && !isHoveringArrow) {
        swiperRef.current.slideNext(2000)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [artworks, isHoveringArrow])

  const handlePrevHover = (isHovering: boolean) => {
    setIsHoveringArrow(isHovering)
    if (isHovering && swiperRef.current) {
      const fastSlide = setInterval(() => {
        if (swiperRef.current) swiperRef.current.slidePrev(300)
      }, 400)
      return () => clearInterval(fastSlide)
    }
  }

  const handleNextHover = (isHovering: boolean) => {
    setIsHoveringArrow(isHovering)
    if (isHovering && swiperRef.current) {
      const fastSlide = setInterval(() => {
        if (swiperRef.current) swiperRef.current.slideNext(300)
      }, 400)
      return () => clearInterval(fastSlide)
    }
  }

  if (loading || artworks.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF7A50]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E8B87D]/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            <span className="italic">Explora Nuestra</span>
            <span className="font-script text-[#FF7A50] text-4xl md:text-5xl ml-3 not-italic">
              Colección
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desliza para descubrir obras únicas pintadas al óleo
          </p>
        </div>

        <div className="relative px-4">
          <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper }}
            modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={true}
            coverflowEffect={{
              rotate: 25,
              stretch: 0,
              depth: 80,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 1,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              stopOnLastSlide: false,
              reverseDirection: false,
            }}
            speed={2000}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            allowTouchMove={true}
            watchSlidesProgress={true}
            className="interactive-carousel !overflow-visible"
            style={{ paddingTop: '20px', paddingBottom: '60px' }}
          >
            {artworks.map((artwork) => (
              <SwiperSlide
                key={artwork.id}
                style={{ width: '350px', maxWidth: '85vw' }}
              >
                <Link href={`/galeria/${artwork.id}`} className="block group">
                  <div className="relative">
                    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          {artwork.featured && (
                            <span className="bg-[#FF7A50] text-white text-xs px-3 py-1 rounded-full shadow-lg">
                              Destacado
                            </span>
                          )}
                          <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs px-3 py-1 rounded-full shadow-lg">
                            {artwork.category}
                          </span>
                        </div>

                        <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                          <div className="w-full">
                            <h3 className="font-display text-2xl font-bold text-white mb-2">
                              {artwork.title}
                            </h3>
                            {artwork.description && (
                              <p className="text-white/90 text-sm mb-4 line-clamp-2">
                                {artwork.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-white">
                                €{artwork.price.toLocaleString('es-ES')}
                              </span>
                              <span className="bg-[#FF7A50] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg">
                                <Eye className="h-4 w-4" />
                                Ver Detalles
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 truncate">
                              {artwork.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {artwork.year} • {artwork.dimensions}
                            </p>
                          </div>
                          <span className="text-xl font-bold text-[#FF7A50]">
                            €{artwork.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button 
            onMouseEnter={() => handlePrevHover(true)}
            onMouseLeave={() => handlePrevHover(false)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#FF7A50] hover:text-white text-gray-800 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onMouseEnter={() => handleNextHover(true)}
            onMouseLeave={() => handleNextHover(false)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#FF7A50] hover:text-white text-gray-800 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Instruction hint */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            ← Desliza o usa las flechas para navegar →
          </p>
        </div>
      </div>

      <style jsx global>{`
        .interactive-carousel .swiper-slide {
          transition: all 0.5s ease;
        }

        .interactive-carousel .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #FF7A50;
          opacity: 0.5;
        }
        
        .interactive-carousel .swiper-pagination-bullet-active {
          opacity: 1;
          width: 32px;
          border-radius: 6px;
        }

        .interactive-carousel .swiper-slide-shadow-left,
        .interactive-carousel .swiper-slide-shadow-right {
          background: linear-gradient(to left, rgba(0,0,0,0.2), transparent);
          border-radius: 24px;
        }
      `}</style>
    </section>
  )
}
