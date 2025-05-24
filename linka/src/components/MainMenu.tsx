import React from 'react';
import { Link } from 'react-router-dom';

interface MainMenuProps {
    title?: string;
}

const MainMenu: React.FC<MainMenuProps> = () => {
    return (
        <nav className='navbar list-group list-group-horizontal list'>
            <li className='list-group-item'>
                <Link 
                    className='text'
                    to="/">Home</Link>
            </li>
            <li className='list-group-item'>
                <Link 
                    className='text'
                    to="/about">Shop</Link>
            </li>
            <li className='list-group-item'>
                <Link 
                    className='text'
                    to="/contact">About Us</Link>
            </li>
            <li className='list-group-item'>
                <Link 
                    className='text'
                    to="/blog">Blog</Link>
            </li>
        </nav>
    );
};

export default MainMenu;
