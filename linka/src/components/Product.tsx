// src/components/Product.tsx

import React from 'react';

export interface ProductProps {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string; 
    onAddToCart?: (id: string) => void;
}

const Product: React.FC<ProductProps> = ({
    id,
    title,
    description,
    imageUrl, 
}) => {
    return (
        <div className="product-card text-center position-absolute animate" id={id}>
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={title}
                    className='img img-fluid animate'
                />
            )}
            <h2 className='title'>{description}</h2>
            {title && <p className='text'>{title}</p>}
        </div>
    );
};

export default Product;