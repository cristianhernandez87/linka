# Linka - Ecommerce con Animaciones Avanzadas y Strapi CMS

## Descripción del Proyecto

Linka es una plataforma de ecommerce que combina:

* Animaciones fluidas basadas en scroll
* Integración con Strapi CMS para gestión de productos
* Diseño moderno y experiencia de usuario inmersiva

## Características Principales

### 1. Sistema de Animaciones Avanzadas

El componente `Hero` implementa un sofisticado sistema de animaciones que responden al scroll:

```javascript
// Ejemplo de animación basada en scroll
useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setHeroNameOpacity(scrollPosition > 0 ? 0.3 : 1);
    
    // Animación de plantas
    if (plantsSectionRef.current) {
      const progress = calculateProgress(scrollPosition, 0, viewportHeight / 2);
      plantsSectionRef.current.style.marginTop = `${progress * viewportHeight}px`;
      plantsSectionRef.current.style.opacity = `${1 - progress}`;
    }
    // ... más animaciones
  };
  window.addEventListener('scroll', handleScroll);
}, [viewportHeight]);
```

Animaciones implementadas:

* Efecto parallax en elementos de plantas
* Transición suave de opacidad para el logo
* Animación de "caída" para la tapa del producto
* Revelado progresivo de la lista de productos

### 2. Integración con Strapi CMS

El componente `ProductList` se conecta a una API de Strapi para obtener los productos:

```javascript
const fetchProducts = async () => {
  const response = await axios.get<{ data: StrapiProductData[] }>(
    `${STRAPI_BASE_URL}/api/products?populate=Image`
  );
  
  // Transformación de datos de Strapi
  const transformedProducts = response.data.data.map(strapiProduct => ({
    id: strapiProduct.id.toString(),
    title: extractRichText(strapiProduct.Title),
    description: strapiProduct.Description,
    imageUrl: strapiProduct.Image?.[0]?.url 
      ? `${STRAPI_BASE_URL}${strapiProduct.Image[0].url}`
      : undefined
  }));
  
  setFetchedProducts(transformedProducts);
};
```

## Tecnologías Utilizadas

**Frontend:**

* React 18
* TypeScript
* Bootstrap 5
* Axios para llamadas API

**Backend:**

* Strapi CMS (v4)
* REST API

## Configuración del Proyecto

### Requisitos Previos

* Node.js (v16+)
* npm o yarn
* Strapi CMS ejecutándose localmente (opcional)

### Instalación

Clonar el repositorio:

```bash
git clone https://github.com/cristianhernandez87/linka.git
cd linka
```

Instalar dependencias:

```bash
npm install
# o
yarn install
```

Configurar variables de entorno:
Crear un archivo `.env` en la raíz con:

```env
REACT_APP_STRAPI_URL=http://localhost:1337
```

### Ejecución

**Frontend (React):**

```bash
npm run dev
# o
yarn run dev
```

**Backend (Strapi - opcional si usas instancia remota):**

```bash
cd strapi-app
npm run develop
```

## Estructura del Proyecto

```
src/
├── assets/          # Imágenes y recursos estáticos
├── components/      # Componentes reutilizables
│   ├── Header.tsx
│   ├── Product.tsx
│   └── ProductList.tsx
├── secctions/       # Secciones principales
│   └── Hero.tsx     # Componente con animaciones
├── App.tsx          # Componente principal
└── main.tsx         # Punto de entrada
```

## Personalización

**Animaciones:**
Para ajustar las animaciones, modifica los parámetros en `Hero.tsx`:

```javascript
// Ajustar velocidad/duración de animaciones
const plantsAnimationEnd = viewportHeight / 2; // Cambiar divisor para ajustar punto de finalización

// Ajustar efectos visuales
leadImageRef.current.style.top = `${currentTopPx}px`;
leadImageRef.current.style.opacity = `${currentOpacity_lead}`;
```

**Conexión con Strapi:**
Para cambiar la fuente de datos:

* Actualiza `STRAPI_BASE_URL` en `ProductList.tsx`
* Asegúrate que la API de Strapi tenga los campos correctos:

  * Title (Rich Text)
  * Description (Text)
  * Image (Media)

## Contribución

1. Haz fork del proyecto
2. Crea una rama (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añade nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

MIT © \[Cristian Hernandez]

## Notas Adicionales
