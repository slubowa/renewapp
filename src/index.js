import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.js';
import { AuthProvider } from './context/AuthContext.js'; 
import Footer from './components/Footer.jsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <AuthProvider>
    <App />
    <Footer />
  </AuthProvider>
  </React.StrictMode>
);



