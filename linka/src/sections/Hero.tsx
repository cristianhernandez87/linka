import React, { useState, useEffect, useRef } from 'react';
import brand_hero from '../assets/images/letters.svg';
import plants_1 from '../assets/images/Layer_1.png';
import container from '../assets/images/no_cap.png';
import lead from '../assets/images/cap.png';

import ProductList from '../components/ProductList';

const Hero: React.FC = () => {
  
  const [heroNameOpacity, setHeroNameOpacity] = useState<number>(1);

  // Referencias a secciones y elementos DOM para manipular estilos directamente
  const plantsSectionRef = useRef<HTMLElement>(null);
  const cremeSectionRef = useRef<HTMLElement>(null);
  const leadImageRef = useRef<HTMLImageElement>(null);
  const productsSectionRef = useRef<HTMLElement>(null);

  // Estado para la altura del viewport (altura visible de la ventana)
  const [viewportHeight, setViewportHeight] = useState(0);

  // Efecto para actualizar la altura del viewport cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
        const vh = window.innerHeight;
        setViewportHeight(vh);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Se llama inmediatamente para definir el valor inicial
    return () => window.removeEventListener('resize', handleResize); // Limpia el evento al desmontar
  }, []);

  // Efecto principal: gestiona las animaciones en el scroll
  useEffect(() => {
    if (viewportHeight === 0) return; // Evita ejecutar si la altura es cero

    let animationFrameId: number | null = null; // Almacena el id de la animación para cancelarla si es necesario

    const handleScroll = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId); // Cancela frame previo si existe

        animationFrameId = requestAnimationFrame(() => { // Usa requestAnimationFrame para eficiencia y suavidad
            const scrollPosition = window.scrollY; // Obtiene la posición vertical del scroll
            setHeroNameOpacity(scrollPosition > 0 ? 0.3 : 1); // Cambia opacidad del nombre según scroll

            // Animación de la sección de plantas
            if (plantsSectionRef.current) {
                const plantsAnimationStart = 0;
                const plantsAnimationEnd = viewportHeight / 2; // La animación termina a la mitad del viewport
                let plantsProgress = 0;

                if (scrollPosition <= plantsAnimationStart) {
                    plantsProgress = 0;
                } else if (scrollPosition >= plantsAnimationEnd) {
                    plantsProgress = 1;
                } else if (plantsAnimationEnd > plantsAnimationStart) {
                    plantsProgress = (scrollPosition - plantsAnimationStart) / (plantsAnimationEnd - plantsAnimationStart);
                }

                plantsProgress = Math.min(Math.max(plantsProgress, 0), 1); // Asegura que esté en [0,1]
                const marginTopValue = plantsProgress * viewportHeight; // Calcula desplazamiento vertical
                const opacityValue = 1 - plantsProgress; // Calcula opacidad inversa al progreso

                // Aplica estilos a la sección de plantas
                plantsSectionRef.current.style.marginTop = `${marginTopValue}px`;
                plantsSectionRef.current.style.opacity = `${opacityValue}`;
            }

            // Animación de la imagen "lead" en la sección crema
            if (cremeSectionRef.current && leadImageRef.current) {
                const cremeSectionRect = cremeSectionRef.current.getBoundingClientRect(); // Rectángulo de la sección
                const cremeSectionTopRelativeToDocument = cremeSectionRect.top + window.scrollY; // Posición de la sección respecto al documento
                const cremeSectionHeight = cremeSectionRect.height;
                const leadAnimationStartScroll = cremeSectionTopRelativeToDocument - viewportHeight * 0.5; // Empieza a la mitad del viewport
                const leadAnimationEndScroll = cremeSectionTopRelativeToDocument; // Termina cuando la sección está en la parte superior

                let leadProgress = 0;
                if (scrollPosition <= leadAnimationStartScroll) {
                    leadProgress = 0;
                } else if (scrollPosition >= leadAnimationEndScroll) {
                    leadProgress = 1;
                } else if (leadAnimationEndScroll > leadAnimationStartScroll) {
                    leadProgress = (scrollPosition - leadAnimationStartScroll) / (leadAnimationEndScroll - leadAnimationStartScroll);
                }
                leadProgress = Math.min(Math.max(leadProgress, 0), 1); // Limita progreso a [0,1]

                const initialTopPx = -viewportHeight; // Comienza fuera del viewport hacia arriba
                const finalTopPercentOfCremeHeight = 0.13; // Posición final: 13% de la altura de la sección crema
                const finalTopPx = finalTopPercentOfCremeHeight * cremeSectionHeight;
                const currentTopPx = initialTopPx + (finalTopPx - initialTopPx) * leadProgress; // Interpolación de posición vertical
                const currentOpacity_lead = leadProgress; // Opacidad crece con el progreso

                // Aplica posición y opacidad actuales
                leadImageRef.current.style.top = `${currentTopPx}px`;
                leadImageRef.current.style.opacity = `${currentOpacity_lead}`;
            }

            // Animación de la sección de productos
            if (productsSectionRef.current && cremeSectionRef.current) {
                // Calcula la altura efectiva de la sección de plantas (incluyendo marginTop)
                const plantsEffectiveHeight = 
                  plantsSectionRef.current ? 
                  (plantsSectionRef.current.offsetHeight + parseFloat(plantsSectionRef.current.style.marginTop || '0')) : 0;
                const cremeIsAtTopScrollPosition = plantsEffectiveHeight;

                const productsAnimationStartScroll = cremeIsAtTopScrollPosition;
                const productsAnimationEndScroll = cremeIsAtTopScrollPosition + viewportHeight / 40; // Intervalo muy corto

                let productsProgress = 0;
                if (scrollPosition <= productsAnimationStartScroll) {
                    productsProgress = 0;
                } else if (scrollPosition >= productsAnimationEndScroll) {
                    productsProgress = 1;
                } else if (productsAnimationEndScroll > productsAnimationStartScroll) {
                    productsProgress = (scrollPosition - productsAnimationStartScroll) / (productsAnimationEndScroll - productsAnimationStartScroll);
                }
                productsProgress = Math.min(Math.max(productsProgress, 0), 1); // Limita progreso a [0,1]

                // Calcula desplazamientos verticales superior e inferior
                const productsMarginTop = -productsProgress * viewportHeight;
                productsSectionRef.current.style.marginTop = `${productsMarginTop}px`;

                const productsMarginBottom = productsProgress * viewportHeight;
                productsSectionRef.current.style.marginBottom = `${productsMarginBottom}px`;

                if (productsProgress === 1) {
                    productsSectionRef.current.style.opacity = '1';
                    // Activa clases de animación solo si aún no están activas
                    if (!productsSectionRef.current.classList.contains('animate-on')) {
                        cremeSectionRef.current.classList.add('animate-on');
                        productsSectionRef.current.classList.add('animate-on');

                        // Elimina clases 'animate-off' después de 2 segundo
                        setTimeout(() => {
                            if (productsSectionRef.current && cremeSectionRef.current) {
                                cremeSectionRef.current.classList.remove('animate-off');
                                productsSectionRef.current.classList.remove('animate-off');
                            }
                        }, 2000);
                    }
                } else {
                    productsSectionRef.current.style.opacity = '0';
                    // Activa 'animate-off' si estaba activo 'animate-on'
                    if (productsSectionRef.current.classList.contains('animate-on')) {
                        cremeSectionRef.current.classList.add('animate-off');
                        productsSectionRef.current.classList.add('animate-off');
                        setTimeout(() => {
                            if (productsSectionRef.current && cremeSectionRef.current) {
                                cremeSectionRef.current.classList.remove('animate-on');
                                productsSectionRef.current.classList.remove('animate-on');
                            }
                        }, 2000);
                    }
                }
            }

        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true }); // Escucha el evento de scroll
    handleScroll(); // Ejecuta una vez al montar
    return () => {
      window.removeEventListener('scroll', handleScroll); // Limpia al desmontar
      if (animationFrameId) cancelAnimationFrame(animationFrameId); // Cancela animación si estaba activa
    };
  }, [viewportHeight]); // Dependencia del efecto: altura del viewport

  // Renderiza las secciones del Hero
  return (
    <div className="hero w-100 bg bg-color-secondary overflow-hidden position-relative">
      {/* Sección fija del nombre, con opacidad controlada */}
      <section
        className="hero-name position-fixed vh-100 d-flex"
        style={{ opacity: heroNameOpacity, transition: 'opacity 0.5s ease-in-out'}}
      >
        <img src={brand_hero} alt="brand hero" className="img w-100" />
      </section>

      {/* Sección de plantas */}
      <section
        ref={plantsSectionRef}
        data-section="plants"
        className={`hero-plants w-100 vh-100`}
      >
        <img src={plants_1} alt="plants" className='img img-fluid img-plant_1' />
      </section>

      {/* Sección crema con imágenes */}
      <section
        ref={cremeSectionRef}
        data-section="creme"
        className={`hero-creme w-100 vh-100 position-relative z-index-1`}
        style={{ top: 0 }}
      >
        <img
          ref={leadImageRef}
          src={lead}
          alt="Tapa del producto"
          className='img img-fluid img-1 animate'
        />
        <img src={container} alt="Envase del producto" className='img img-fluid img-2 animate' />
      </section>

      {/* Sección de productos */}
      <section
        ref={productsSectionRef}
        data-section="products"
        className={`hero-products w-100 vh-100 position-relative z-index-1`}
        style={{ marginTop: '0px', marginBottom: '0px', opacity: 0}}
      >
        <ProductList /> {/* Renderiza el componente con la lista de productos */}
      </section>
    </div>
  );
};

export default Hero; // Exporta el componente
