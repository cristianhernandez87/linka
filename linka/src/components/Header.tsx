import React from 'react';
import Brand from './Brand';
import MainMenu from './MainMenu';
import ShopMenu from './ShopMenu';
import logo from '../assets/images/logo.svg';



interface HeaderProps {
    title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => (
    <header className='fixed-top start-0 w-100 d-flex justify-content-between align-items-center px-3'>
        <MainMenu></MainMenu>
        
        <Brand
            url='/'
            className='img-fluid'
            src={logo}
            alt={title}
            width={260}
        />

        <ShopMenu></ShopMenu>
    </header>
);

export default Header;