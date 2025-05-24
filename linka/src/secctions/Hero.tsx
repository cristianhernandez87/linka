import React, { useState, useEffect, useRef } from 'react';
import brand_hero from '../assets/images/letters.svg';
import plants_1 from '../assets/images/Layer_1.png';
import container from '../assets/images/no_cap.png';
import lead from '../assets/images/cap.png';
import ProductList from '../components/ProductList';

const Hero: React.FC = () => {
  const [heroNameOpacity, setHeroNameOpacity] = useState<number>(1);

  const plantsSectionRef = useRef<HTMLElement>(null);
  const cremeSectionRef = useRef<HTMLElement>(null);
  const leadImageRef = useRef<HTMLImageElement>(null);
  const productsSectionRef = useRef<HTMLElement>(null);

  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
        const vh = window.innerHeight;
        setViewportHeight(vh);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (viewportHeight === 0) return;

    let animationFrameId: number | null = null;

    const handleScroll = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        animationFrameId = requestAnimationFrame(() => {
            const scrollPosition = window.scrollY;
            setHeroNameOpacity(scrollPosition > 0 ? 0.3 : 1);

            if (plantsSectionRef.current) {
                const plantsAnimationStart = 0;
                const plantsAnimationEnd = viewportHeight / 2;
                let plantsProgress = 0;

                if (scrollPosition <= plantsAnimationStart) {
                    plantsProgress = 0;
                } else if (scrollPosition >= plantsAnimationEnd) {
                    plantsProgress = 1;
                } else if (plantsAnimationEnd > plantsAnimationStart) {
                    plantsProgress = (scrollPosition - plantsAnimationStart) / (plantsAnimationEnd - plantsAnimationStart);
                }
                
                plantsProgress = Math.min(Math.max(plantsProgress, 0), 1);
                const marginTopValue = plantsProgress * viewportHeight;
                const opacityValue = 1 - plantsProgress;
                plantsSectionRef.current.style.marginTop = `${marginTopValue}px`;
                plantsSectionRef.current.style.opacity = `${opacityValue}`;
            }

            if (cremeSectionRef.current && leadImageRef.current) {
                const cremeSectionRect = cremeSectionRef.current.getBoundingClientRect();
                const cremeSectionTopRelativeToDocument = cremeSectionRect.top + window.scrollY;
                const cremeSectionHeight = cremeSectionRect.height;
                const leadAnimationStartScroll = cremeSectionTopRelativeToDocument - viewportHeight * 0.5; 
                const leadAnimationEndScroll = cremeSectionTopRelativeToDocument; 

                let leadProgress = 0;
                if (scrollPosition <= leadAnimationStartScroll) {
                leadProgress = 0;
                } else if (scrollPosition >= leadAnimationEndScroll) {
                leadProgress = 1;
                } else if (leadAnimationEndScroll > leadAnimationStartScroll) {
                leadProgress = (scrollPosition - leadAnimationStartScroll) / (leadAnimationEndScroll - leadAnimationStartScroll);
                }
                leadProgress = Math.min(Math.max(leadProgress, 0), 1);

                const initialTopPx = -viewportHeight;
                const finalTopPercentOfCremeHeight = 0.13; 
                const finalTopPx = finalTopPercentOfCremeHeight * cremeSectionHeight;
                const currentTopPx = initialTopPx + (finalTopPx - initialTopPx) * leadProgress;
                const currentOpacity_lead = leadProgress; 
                leadImageRef.current.style.top = `${currentTopPx}px`;
                leadImageRef.current.style.opacity = `${currentOpacity_lead}`;       
                
            }

        if (productsSectionRef.current && cremeSectionRef.current) {
            
            const plantsEffectiveHeight = plantsSectionRef.current ? (plantsSectionRef.current.offsetHeight + parseFloat(plantsSectionRef.current.style.marginTop || '0')) : 0;
            const cremeIsAtTopScrollPosition = plantsEffectiveHeight;

            const productsAnimationStartScroll = cremeIsAtTopScrollPosition; 
            const productsAnimationEndScroll = cremeIsAtTopScrollPosition + viewportHeight / 30; 

            let productsProgress = 0;
            if (scrollPosition <= productsAnimationStartScroll) {
              productsProgress = 0;
            } else if (scrollPosition >= productsAnimationEndScroll) {
              productsProgress = 1;
            } else if (productsAnimationEndScroll > productsAnimationStartScroll) {
              productsProgress = (scrollPosition - productsAnimationStartScroll) / (productsAnimationEndScroll - productsAnimationStartScroll);
            }
            productsProgress = Math.min(Math.max(productsProgress, 0), 1);
    
            const productsMarginTop = -productsProgress * viewportHeight; 
            productsSectionRef.current.style.marginTop = `${productsMarginTop}px`;

            const productsMarginBottom = productsProgress * viewportHeight; 
            productsSectionRef.current.style.marginBottom = `${productsMarginBottom}px`;

            if (productsProgress === 1) {
                productsSectionRef.current.style.opacity = '1';
                
                if (!productsSectionRef.current.classList.contains('animate-on')) {
                    cremeSectionRef.current.classList.add('animate-on');
                    productsSectionRef.current.classList.add('animate-on');

                    setTimeout(() => {
                        if (productsSectionRef.current && cremeSectionRef.current) {
                            cremeSectionRef.current.classList.remove('animate-off');
                            productsSectionRef.current.classList.remove('animate-off');
                        }
                    }, 1000);
                }
            } else {
                productsSectionRef.current.style.opacity = '0';
                if (productsSectionRef.current.classList.contains('animate-on')) {
                    cremeSectionRef.current.classList.add('animate-off');
                    productsSectionRef.current.classList.add('animate-off');
                    setTimeout(() => {
                        if (productsSectionRef.current && cremeSectionRef.current) {
                            cremeSectionRef.current.classList.remove('animate-on');
                            productsSectionRef.current.classList.remove('animate-on');
                        }
                    }, 1000);
                }
            }
        }
            
        
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [viewportHeight]); 

  return (
    <div className="hero w-100 bg bg-color-secondary overflow-hidden position-relative">
      <section
        className="hero-name position-fixed vh-100 d-flex"
        style={{ opacity: heroNameOpacity, transition: 'opacity 0.5s ease-in-out'}}
      >
        <img src={brand_hero} alt="brand hero" className="img w-100" />
      </section>

      <section
        ref={plantsSectionRef}
        data-section="plants"
        className={`hero-plants w-100 vh-100`}
      >
        <img src={plants_1} alt="plants" className='img img-fluid img-plant_1' />
      </section>

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

      <section
        ref={productsSectionRef}
        data-section="products"
        className={`hero-products w-100 vh-100 position-relative z-index-1`}
        style={{ marginTop: '0px', marginBottom: '0px', opacity: 0}} 
      >
        <ProductList />
      </section>

    </div>
  );
};

export default Hero;