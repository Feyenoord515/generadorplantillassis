import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Login from "./Login";

const THEME_STORAGE_KEY = "distrinando-theme";
const USER_STORAGE_KEY = "distrinando-user";

const RootComponent = () => {
  const [currentUser, setCurrentUser] = useState(() =>
    sessionStorage.getItem(USER_STORAGE_KEY)
  );
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(sessionStorage.getItem(USER_STORAGE_KEY))
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_STORAGE_KEY) || "dark"
  );

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogin = (status, username) => {
    setIsAuthenticated(status);
    setCurrentUser(username);
    if (status && username) {
      sessionStorage.setItem(USER_STORAGE_KEY, username);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    sessionStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <React.StrictMode>
      {isAuthenticated ? (
        <App
          currentUser={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
        />
      ) : (
        <Login
          onLogin={handleLogin}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RootComponent />);

