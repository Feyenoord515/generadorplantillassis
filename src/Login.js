import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      onLogin(true);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-500 to-blue-300 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <form>
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
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-100"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Entrar
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          ¿Olvidaste tu contraseña?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Recupérala aquí
          </a>
        </p>
        </form>
      </div>
    </div>
  );
}

export default Login;


// import React, { useState } from 'react';

// function Login({ onLogin }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     if (username === 'admin' && password === '1234') {
//       onLogin(true);
//     } else {
//       alert('Credenciales incorrectas');
//     }
//   };
// //bg-gradient-to-r from-blue-500 to-purple-600
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-300 p-20px">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar sesión</h2>
        
//         <div className="mb-4">
//           <input
//             type="text"
//             placeholder="Usuario"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-100"
//           />
//         </div>
        
//         <div className="mb-6">
//           <input
//             type="password"
//             placeholder="Contraseña"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-100"
//           />
//         </div>
        
//         <button
//           onClick={handleLogin}
//           className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200"
//         >
//           Entrar
//         </button>
        
//         <p className="text-sm text-gray-500 mt-4 text-center">
//           ¿Olvidaste tu contraseña? <a href="#" className="text-purple-600 hover:underline">Recupérala aquí</a>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;