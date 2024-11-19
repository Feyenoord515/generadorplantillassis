// Header.js
import React from 'react';

function Header({ title }) {
  return (
    <header className="bg-gradient-to-r from-gray-500 to-blue-300 text-white py-4 shadow-lg">
      <h1 className="text-center text-2xl font-bold">{title}</h1>
    </header>
  );
}

export default Header;
