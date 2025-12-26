import Image from "next/image";

export default function SobreMiPage() {
  return (
    <div className="py-12">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80"
              alt="Pili Rey en su estudio"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="font-display text-5xl font-bold text-[#FF7A50] mb-6">Pili Rey</h1>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              Artista visual apasionada por capturar la esencia de las emociones 
              a través del color y la forma.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Con más de 20 años de trayectoria artística, mi trabajo ha evolucionado 
              desde los paisajes tradicionales hasta exploraciones más abstractas 
              de la naturaleza y el alma humana. Cada pincelada es una conversación 
              entre el lienzo y mis sentimientos más profundos.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-gray-900 text-center mb-12">Mi <span className="font-script text-[#E8B87D]">Historia</span></h2>
          
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <p>
              Nací en Madrid, donde desde pequeña mostré una inclinación natural hacia 
              las artes visuales. Los paseos por el Museo del Prado con mi abuela 
              despertaron en mí una fascinación por la capacidad del arte para 
              transmitir emociones que las palabras no pueden expresar.
            </p>
            <p>
              Estudié Bellas Artes en la Universidad Complutense de Madrid, donde 
              descubrí mi amor por el óleo y las técnicas mixtas. Durante esos años, 
              experimenté con diferentes estilos hasta encontrar mi voz única: 
              una fusión entre lo figurativo y lo abstracto que caracteriza mi trabajo actual.
            </p>
            <p>
              Hoy, mi estudio es mi santuario. Un espacio donde la luz natural 
              baña los lienzos y donde cada día es una nueva oportunidad para 
              explorar los límites de la expresión artística.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-gray-900 text-center mb-12">Mi <span className="font-script text-[#E8B87D]">Filosofía</span></h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-[#FF7A50]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#FF7A50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-[#FF7A50] mb-4">Emoción</h3>
              <p className="text-gray-600">
                Cada obra nace de un sentimiento genuino. No pinto para decorar, 
                pinto para conectar.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-[#FF7A50]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#FF7A50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-[#FF7A50] mb-4">Autenticidad</h3>
              <p className="text-gray-600">
                Cada pieza es única e irrepetible, reflejo de un momento específico 
                en mi viaje artístico.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-[#FF7A50]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#FF7A50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-[#FF7A50] mb-4">Conexión</h3>
              <p className="text-gray-600">
                El arte es un puente entre almas. Mis obras buscan crear diálogos 
                silenciosos pero profundos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-gray-900 text-center mb-12">Mi <span className="font-script text-[#E8B87D]">Trayectoria</span></h2>
          
          <div className="space-y-8">
            {[
              { year: '2024', event: 'Exposición individual "Naturaleza Interior" - Galería Arte Madrid' },
              { year: '2023', event: 'Participación en ARCO Madrid' },
              { year: '2022', event: 'Colección permanente en Hotel Ritz Madrid' },
              { year: '2020', event: 'Premio Nacional de Pintura Contemporánea' },
              { year: '2015', event: 'Primera exposición internacional - París' },
              { year: '2005', event: 'Apertura de mi estudio propio en Madrid' },
            ].map((item) => (
              <div key={item.year} className="flex gap-6 items-start">
                <span className="text-2xl font-display text-[#FF7A50] w-20 flex-shrink-0">
                  {item.year}
                </span>
                <div className="flex-1 pb-8 border-b border-gray-200">
                  <p className="text-gray-700">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
