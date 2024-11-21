import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './Login';
import reportWebVitals from './reportWebVitals';

const RootComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (status, username) => {
    setIsAuthenticated(status);
    setCurrentUser(username); // Guardar el nombre del usuario autenticado
  };

  return (
    <React.StrictMode>
      {isAuthenticated ? (
        <App
          currentUser={currentUser}
          onLogout={() => {
            setIsAuthenticated(false);
            setCurrentUser(null);
          }}
        />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RootComponent />);

reportWebVitals();

