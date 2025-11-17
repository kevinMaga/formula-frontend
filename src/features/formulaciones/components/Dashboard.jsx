import React, { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '../../auth/stores/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import NuevaFormulacion from './NuevaFormulacion';
import MisFormulaciones from './MisFormulaciones';

import { ingredientesApi } from '../../ingredientes/api/ingredientesApi';
import { formulacionesApi } from '../../formulaciones/api/formulacionesApi';
import { categoriasApi } from '../../categorias/api/categoriasApi';

const CONVERSION_A_GRAMOS = {
  g: 1,
  kg: 1000,
  ml: 1, 
  oz: 28.3495,
  lb: 453.592,
  unidad: 100, 
};

const Dashboard = ({ activePath }) => { 
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [listaFormulaciones, setListaFormulaciones] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formulaParaEliminar, setFormulaParaEliminar] = useState(null);
  const [formulaParaEditar, setFormulaParaEditar] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);  const [nombreFormula, setNombreFormula] = useState('');
  const [categoriaId, setCategoriaId] = useState(''); 
  const [descripcion, setDescripcion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [listaIngredientes, setListaIngredientes] = useState([]);
  const [cantidad, setCantidad] = useState(100);
  const [unidad, setUnidad] = useState('g');

  const cargarFormulaciones = async () => {
    setIsLoading(true);
    try {
      const data = await formulacionesApi.getAll();
      setListaFormulaciones(data);
    } catch (err) {
      setError('Error al cargar formulaciones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await categoriasApi.getAll();
        setListaCategorias(data);
      } catch (err) {
        console.error('Error al cargar categorías', err);
      }
    };
    
    cargarCategorias();
    cargarFormulaciones();
  }, []);

  useEffect(() => {
    // Solo limpiar el formulario si cambiamos de ruta Y NO estamos en modo edición
    if (activePath === '/nueva-formulacion' && !formulaParaEditar) {
      console.log('Reseteando formulario en Nueva Formulación');
      setIsFormVisible(false);
      setNombreFormula('');
      setDescripcion('');
      setCategoriaId('');
      setListaIngredientes([]);
      setSearchTerm('');
      setResultadosBusqueda([]);
      setError(null);
    }
  }, [activePath]);

  const totalesNutricionales = useMemo(() => {
    const totales = { calorias: 0, proteinas: 0, grasas: 0, carbohidratos: 0 };

    listaIngredientes.forEach(ing => {
      const factor = ing.cantidad / 100;
      
      totales.calorias += (ing.calorias || 0) * factor;
      totales.proteinas += (ing.proteinas || 0) * factor;
      totales.grasas += (ing.grasas || 0) * factor;
      totales.carbohidratos += (ing.carbohidratos || 0) * factor;
    });

    return totales;
  }, [listaIngredientes]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim().length < 2) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await ingredientesApi.search(searchTerm);
      setResultadosBusqueda(data);
    } catch (err) {
      setError('Error al buscar ingredientes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIngrediente = (ingrediente) => {
    if (listaIngredientes.length >= 5) {
      alert('Error: El plan Emprendedor solo permite 5 ingredientes.');
      return;
    }

    const factor = CONVERSION_A_GRAMOS[unidad] || 1;
    const cantidadEnGramos = parseFloat(cantidad) * factor;

    setListaIngredientes([
      ...listaIngredientes,
      {
        ingredienteId: ingrediente.id,
        nombre: ingrediente.nombre, 
        cantidad: cantidadEnGramos,
        unidad: 'g',
        calorias: ingrediente.calorias,
        proteinas: ingrediente.proteinas,
        grasas: ingrediente.grasas,
        carbohidratos: ingrediente.carbohidratos,
      },
    ]);
    
    setSearchTerm('');
    setResultadosBusqueda([]);
    setCantidad(100);
    setUnidad('g');
  };

  const limpiarFormulario = () => {
    setNombreFormula('');
    setDescripcion('');
    setCategoriaId('');
    setListaIngredientes([]);
    setSearchTerm('');
    setResultadosBusqueda([]);
    setError(null);
    setFormulaParaEditar(null);
  };
  
  const handleShowForm = () => {
    limpiarFormulario();
    setIsFormVisible(true);
    navigate('/nueva-formulacion');
  };  const handleShowEditForm = (formula) => {
    setFormulaParaEditar(formula);
    setNombreFormula(formula.nombre);
    setDescripcion(formula.descripcion || '');
    setCategoriaId(String(formula.categoria.id));
    
    setListaIngredientes(formula.ingredientes.map(ing => ({
      ingredienteId: ing.ingrediente.id,
      nombre: ing.ingrediente.nombre,
      cantidad: ing.cantidad,
      unidad: ing.unidad,
      calorias: ing.ingrediente.calorias,
      proteinas: ing.ingrediente.proteinas,
      grasas: ing.ingrediente.grasas,
      carbohidratos: ing.ingrediente.carbohidratos,
    })));
    
    setSearchTerm('');
    setResultadosBusqueda([]);
    setError(null);
    setIsFormVisible(true);
    
    // Navegar a nueva-formulacion para mostrar el formulario
    navigate('/nueva-formulacion');
  };

  const handleHideForm = () => {
    limpiarFormulario();
    setIsFormVisible(false);
    
    // Si estábamos editando, volver a mis-formulaciones
    if (formulaParaEditar) {
      navigate('/mis-formulaciones');
    }
  };

  const handleSubmitFormula = async (e) => {
    e.preventDefault();
    if (!categoriaId) {
        setError('Por favor, selecciona una categoría');
        return;
    }
    
    setIsLoading(true);
    setError(null);

    const dto = {
        nombre: nombreFormula,
        descripcion: descripcion,
        categoriaId: categoriaId, 
        ingredientes: listaIngredientes.map((ing) => ({
            ingredienteId: ing.ingredienteId,
            cantidad: ing.cantidad,
            unidad: ing.unidad,
        })),
    };

    try {
        if (formulaParaEditar) {
            await formulacionesApi.update(formulaParaEditar.id, dto);
            setMensajeExito('¡Formulación actualizada correctamente!');
            limpiarFormulario(); 
            await cargarFormulaciones();
            setIsFormVisible(false);
            navigate('/mis-formulaciones');
        } else {
            await formulacionesApi.create(dto);
            setMensajeExito('¡Formulación creada correctamente!');
            limpiarFormulario(); 
            await cargarFormulaciones();
            setIsFormVisible(false);
            navigate('/mis-formulaciones');
        }
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
            setMensajeExito(null);
        }, 3000);
        
    } catch (err) {
        const action = formulaParaEditar ? 'actualizar' : 'crear';
        setError(`Error al ${action} la fórmula: ` + (err.response?.data?.message || err.message));
    } finally {
        setIsLoading(false);
    }
  };

  const handleConfirmarEliminacion = async () => {
    if (!formulaParaEliminar) return;

    setIsLoading(true);
    setError(null);
    try {
      await formulacionesApi.delete(formulaParaEliminar.id);
      
      setFormulaParaEliminar(null);
      await cargarFormulaciones();
      setMensajeExito('¡Formulación eliminada correctamente!');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setMensajeExito(null);
      }, 3000);
    } catch (err) {
      setError('Error al eliminar la fórmula');
    } finally {
      setIsLoading(false);
    }
  };  const handleCancelarEliminacion = () => {
    setFormulaParaEliminar(null);
  };

  const renderModalConfirmacion = () => {
    if (!formulaParaEliminar) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Confirmar Eliminación</h2>
          <p>
            ¿Estás seguro de que deseas eliminar la fórmula
            <strong> "{formulaParaEliminar.nombre}"</strong>?
          </p>
          <p>Esta acción no se puede deshacer.</p>
          
          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={handleCancelarEliminacion}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="delete-button" 
              onClick={handleConfirmarEliminacion}
              disabled={isLoading}
            >
              {isLoading ? 'Eliminando...' : 'Sí, Eliminar'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const sharedProps = {
    user, logout,
    isFormVisible, setIsFormVisible,
    listaFormulaciones, listaCategorias, isLoading, error, 
    formulaParaEliminar, formulaParaEditar, totalesNutricionales,
    setFormulaParaEliminar, mensajeExito,
    nombreFormula, setNombreFormula, descripcion, setDescripcion, 
    categoriaId, setCategoriaId, searchTerm, setSearchTerm, 
    resultadosBusqueda, setCantidad, setUnidad, cantidad, unidad,
    listaIngredientes, setListaIngredientes, 
    handleSearch, handleAddIngrediente, handleShowForm, 
    handleShowEditForm, handleHideForm, handleSubmitFormula,
    renderModalConfirmacion,
    activePath
  };  if (activePath === '/nueva-formulacion') {
    return <NuevaFormulacion {...sharedProps} />;
  } else if (activePath === '/mis-formulaciones') {
    return <MisFormulaciones {...sharedProps} />;
  }

  return null;
};

export default Dashboard;