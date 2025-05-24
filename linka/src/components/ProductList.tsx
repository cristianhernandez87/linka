// src/components/ProductList.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Product, { type ProductProps } from './Product';

// Interface simplificada para el objeto de imagen de Strapi (solo lo que necesitamos)
interface SimplifiedStrapiImage {
    url: string;
    // Podrías añadir 'id' o 'name' si los necesitas para algo más, pero 'url' es lo esencial
}

// Interface para los datos del producto tal como vienen de Strapi
interface StrapiProductData {
    id: number;
    Description: string; // Tu campo de texto simple para la descripción
    Title: Array<{ type: string, children: Array<{ type: string, text: string }> }>; // Tu campo Rich Text para el título
    Image: SimplifiedStrapiImage[]; // Array de imágenes (aunque usualmente uses la primera)
    // No incluimos createdAt, updatedAt, publishedAt, documentId si no los usas en el frontend
}

const ProductList: React.FC = () => {
    const [fetchedProducts, setFetchedProducts] = useState<ProductProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const STRAPI_BASE_URL = "http://localhost:1337"; // Define la URL base de tu Strapi

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Solicitud a la API con el parámetro populate para incluir el campo 'Image'
                const response = await axios.get<{ data: StrapiProductData[] }>(`${STRAPI_BASE_URL}/api/products?populate=Image`);
                const rawStrapiProducts: StrapiProductData[] = response.data.data;

                console.log("Raw Strapi Products with Image (populada):", rawStrapiProducts);

                const transformedProducts: ProductProps[] = rawStrapiProducts.map(
                    (strapiProduct) => {
                        // Extracción del texto del título del campo Rich Text
                        const extractedTitle = strapiProduct.Title?.[0]?.children?.[0]?.text || 'No Title Provided';

                        // Extracción de la URL de la imagen
                        // El campo 'Image' es un array. Tomamos la URL de la primera imagen si existe.
                        const relativeImageUrl = strapiProduct.Image && strapiProduct.Image.length > 0
                            ? strapiProduct.Image[0].url
                            : null;

                        // Construir la URL completa de la imagen. Las URLs de Strapi son relativas.
                        const imageUrl = relativeImageUrl
                            ? `${STRAPI_BASE_URL}${relativeImageUrl}`
                            : undefined; // o una URL de imagen placeholder si lo prefieres

                        console.log(`Product ID: ${strapiProduct.id}, Title: ${extractedTitle}, Image URL: ${imageUrl}`);

                        return {
                            id: strapiProduct.id.toString(),
                            title: extractedTitle,
                            description: strapiProduct.Description || 'No Description Provided',
                            imageUrl: imageUrl,
                        };
                    }
                );
                setFetchedProducts(transformedProducts);
            } catch (err) {
                console.error("Error fetching products:", err);
                if (axios.isAxiosError(err)) {
                    console.error("Axios error details:", err.response?.data || err.message);
                }
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        console.log("Fetched Products for display (transformed):", fetchedProducts);
    }, [fetchedProducts]);

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    return (
        <div className='product-list'>
            {fetchedProducts.length > 0 ? (
                fetchedProducts.map(product => (
                    <Product
                        key={product.id}
                        {...product}
                        onAddToCart={(id) => console.log(`Product ${id} added to cart!`)}
                    />
                ))
            ) : (
                <p>No products found. Please add some in Strapi.</p>
            )}
        </div>
    );
};

export default ProductList;