import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoginForm } from './features/auth/components/LoginForm';
import { useAuthStore } from './features/auth/stores/authStore'; // Lógica de Auth RESTAURADA

import Sidebar from './components/Sidebar'; 
import './Layout.css'; 
import './features/formulaciones/components/Dashboard.css';

import Dashboard from './features/formulaciones/components/Dashboard'; 
// Componentes de Vistas Faltantes
import NuevaFormulacion from './features/formulaciones/components/NuevaFormulacion'; 
import MisFormulaciones from './features/formulaciones/components/MisFormulaciones'; 
import Proveedores from './features/formulaciones/components/Proveedores';
import Eliminados from './features/formulaciones/components/Eliminados'; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Componente para proteger rutas (Lógica RESTAURADA)
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Componente de Envoltura Lógica para Formulaciones
const FormulasLayout = () => {
    const location = useLocation();
    // Dashboard (Lógica) envuelve a los componentes visuales de formulaciones
    return (
        <Dashboard activePath={location.pathname}>
            <Outlet />
        </Dashboard>
    );
};


const AppLayout = () => {
    return (
        <div className="app-layout"> 
            <Sidebar /> 
            <main className="app-content">
                <Outlet /> {/* Outlet renderiza FormulasLayout o Proveedores/Eliminados */}
            </main>
        </div>
    );
};


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          
          <Route path="/login" element={<LoginForm />} />
          
          {/* Envolvemos todo el Layout con la Autenticación */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            
            {/* 1. Rutas que NO necesitan la Lógica Completa del Dashboard (Van directo a Outlet) */}
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/eliminados" element={<Eliminados />} />
            
            {/* 2. Rutas que NECESITAN la Lógica del Dashboard (Envueltas en FormulasLayout) */}
            <Route element={<FormulasLayout />}>
              <Route path="/nueva-formulacion" element={<NuevaFormulacion />} />
              <Route path="/mis-formulaciones" element={<MisFormulaciones />} />
            </Route>
            
            {/* Redirecciones */}
            <Route path="/" element={<Navigate to="/nueva-formulacion" replace />} />
            <Route path="/dashboard" element={<Navigate to="/nueva-formulacion" replace />} />

          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;