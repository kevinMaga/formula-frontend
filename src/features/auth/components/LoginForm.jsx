import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './LoginForm.css';

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login, isLoading, error } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Solinal Fórmula</h1>
        <p className="login-subtitle">Inicia sesión en tu cuenta</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-alert">
              {error.response?.data?.message || 'Error al iniciar sesión'}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};