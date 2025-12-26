import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@pilirey.com',
      passwordHash: hashedPassword,
    },
  })

  // Create sample artworks
  const artworks = [
    {
      title: 'Atardecer en el Mar',
      description: 'Una impresionante vista del océano al atardecer, con tonos cálidos de naranja y rosa que se reflejan en las aguas tranquilas.',
      category: 'Paisajes',
      technique: 'Óleo sobre lienzo',
      year: 2024,
      dimensions: '80 x 60 cm',
      price: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
      featured: true,
    },
    {
      title: 'Retrato de Primavera',
      description: 'Un delicado retrato que celebra la llegada de la primavera con flores y colores vibrantes.',
      category: 'Retratos',
      technique: 'Acrílico sobre lienzo',
      year: 2023,
      dimensions: '100 x 80 cm',
      price: 1800,
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
      featured: true,
    },
    {
      title: 'Abstracto en Azul',
      description: 'Exploración de emociones a través del color azul en todas sus tonalidades.',
      category: 'Abstracto',
      technique: 'Técnica mixta',
      year: 2024,
      dimensions: '120 x 90 cm',
      price: 2500,
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      featured: true,
    },
    {
      title: 'Jardín Secreto',
      description: 'Un rincón mágico de naturaleza donde la luz se filtra entre las hojas.',
      category: 'Naturaleza',
      technique: 'Óleo sobre lienzo',
      year: 2023,
      dimensions: '70 x 50 cm',
      price: 950,
      imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80',
      featured: true,
    },
  ]

  for (const artwork of artworks) {
    await prisma.artwork.upsert({
      where: { id: artworks.indexOf(artwork) + 1 },
      update: artwork,
      create: artwork,
    })
  }

  // Create content sections
  const contentSections = [
    {
      page: 'about',
      sectionKey: 'hero',
      title: 'Pili Rey',
      subtitle: 'Una vida dedicada al arte',
      content: 'Pili Rey es una pintora española que ha dedicado más de 50 años al arte de la pintura al óleo. Su trabajo se caracteriza por el uso vibrante del color y la captura de la luz mediterránea en cada pincelada.',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
      order: 0,
    },
    {
      page: 'about',
      sectionKey: 'historia',
      title: 'Mi Historia',
      subtitle: 'El camino de una artista',
      content: 'Nací en Valencia en 1950, rodeada de la luz y los colores del Mediterráneo. Desde pequeña, sentí una conexión profunda con el arte que me llevaría a dedicar mi vida entera a la pintura.',
      order: 1,
    },
    {
      page: 'about',
      sectionKey: 'estudio',
      title: 'Mi Estudio',
      subtitle: 'Donde la magia sucede',
      content: 'Mi estudio está ubicado en el corazón de Valencia, en una antigua casa con ventanales que capturan la luz perfecta de la mañana. Aquí es donde nacen todas mis obras.',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
      order: 2,
    },
    {
      page: 'home',
      sectionKey: 'hero',
      title: 'Arte que Inspira',
      subtitle: 'Descubre la belleza del óleo',
      content: 'Bienvenido a mi galería online donde podrás explorar mi colección de pinturas al óleo.',
      imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
      order: 0,
    },
    {
      page: 'home',
      sectionKey: 'about-preview',
      title: 'Sobre la Artista',
      subtitle: 'Más de 50 años de pasión',
      content: 'Cada obra es una ventana a mi alma, una expresión de mi amor por el color y la luz mediterránea.',
      buttonText: 'Conocer más',
      buttonLink: '/sobre-mi',
      order: 1,
    },
  ]

  for (const section of contentSections) {
    await prisma.siteContent.upsert({
      where: { page_sectionKey: { page: section.page, sectionKey: section.sectionKey } },
      update: section,
      create: section,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('   Admin: admin / admin123')
  console.log('   Content sections: ' + contentSections.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
