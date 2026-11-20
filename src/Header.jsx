// Header.js
import React from 'react';

function Header({ title, currentUser }) {
  return (
    <header className="bg-gradient-to-r from-gray-500 to-blue-300 text-white p-4 shadow-lg w-auto rounded-lg justify-center mt-0 mx-0">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        {currentUser && (
          <p className="text-sm mt-1">Bienvenido, <span className="font-semibold">{currentUser}</span></p>
        )}
      </div>
    </header>
  );
}

export default Header;
