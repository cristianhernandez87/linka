import { HeartIcon, ShoppingBagIcon } from 'lucide-react';
import React from 'react';

const ShopMenu: React.FC = () => {
    return (
        <nav>
            <ul className='list-group list-group-horizontal list'>
                <li className='list-group-item'><HeartIcon className="w-6 h-6" /></li>
                <li className='list-group-item'><ShoppingBagIcon className="w-6 h-6" /></li>
                <li className='list-group-item'>Profile</li>
            </ul>
        </nav>
    );
};

export default ShopMenu;