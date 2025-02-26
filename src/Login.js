import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const userCredentials = {
  admin: process.env.REACT_APP_ADMIN,
  Mauricio: process.env.REACT_APP_MAURICIO,
  Matias: process.env.REACT_APP_MATIAS,
  Octavio: process.env.REACT_APP_OCTAVIO,
  Guillermo: process.env.REACT_APP_GUILLERMO,
};

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();

    if (userCredentials[username] && userCredentials[username] === password) {
      onLogin(true, username); // Pasar estado y nombre de usuario al componente raíz
    } else {
      toast.error('Credenciales incorrectas', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-500 to-blue-300 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <form onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Iniciar sesión
          </h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-100"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-100"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Entrar
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
