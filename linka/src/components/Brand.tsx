import React from 'react';
import { Link } from 'react-router-dom';

interface BrandProps {
    src: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    url?: string;
}

const Brand: React.FC<BrandProps> = ({ src, alt = 'Brand', width, height, className, url }) => {
    const img = (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
        />
    );

    return url ? <Link 
                    to={url}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >{img}</Link> : img;
};

export default Brand;
