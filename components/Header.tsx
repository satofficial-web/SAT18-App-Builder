
import React from 'react';
import { CubeIcon } from './icons/CubeIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center space-x-3">
          <CubeIcon className="h-8 w-8 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white tracking-wider">
            SAT18 App Builder
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
