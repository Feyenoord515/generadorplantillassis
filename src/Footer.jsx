// Footer.js
import React from 'react';

function Footer({ text }) {
  return (
    <footer className="bg-gradient-to-r from-gray-500 to-blue-300 text-white py-2 shadow-inner w-auto rounded-lg justify-center mb-0">
      <p className="text-center text-md my-4">{text}</p>
    </footer>
  );
}

export default Footer;
