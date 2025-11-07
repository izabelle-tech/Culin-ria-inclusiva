
import React from 'react';
import { ChefHatIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
         <ChefHatIcon className="h-8 w-8 text-indigo-400 mr-3"/>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Culinária <span className="text-indigo-400">Criativa</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
