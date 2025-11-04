import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Tailwind base styles
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // we'll create this context
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <ThemeProvider>
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </UserProvider>
  </React.StrictMode>
);
