import React from 'react';

const MisFormulaciones = ({
    listaFormulaciones, isLoading, error, handleShowForm, handleShowEditForm,
    setFormulaParaEliminar, renderModalConfirmacion, mensajeExito
}) => {
    
    if (isLoading && (listaFormulaciones && listaFormulaciones.length === 0)) {
        return (
            <div className="dashboard-content">
                <p>Cargando formulaciones...</p>
            </div>
        );
    }

    // Usamos el chequeo de nulos '&&' en la lista principal
    const formulasDisponibles = listaFormulaciones && listaFormulaciones.length > 0;

    return (
        <div className="dashboard-content">
            {mensajeExito && (
                <div className="success-message">
                    {mensajeExito}
                </div>
            )}
            <div className="list-header">
                <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-secondary)', margin: 0 }}>Mis Formulaciones</h2>
                
                <button className="new-formula-button" onClick={handleShowForm}>
                    + Nueva Formulación
                </button>
            </div>
            
            <div className="category-filters" style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                {['Todas', 'Panadería', 'Confitería', 'Bebidas'].map(cat => (
                    <button key={cat} style={{ background: 'var(--bg-primary)', padding: 'var(--spacing-sm) var(--spacing-lg)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)' }}>
                        {cat}
                    </button>
                ))}
            </div>

            {error && <p className="error-message">{error}</p>}
            
            {/* CORRECCIÓN DE LA LÍNEA 36 (ahora 42): Chequeamos que no sea null/undefined */}
            {!formulasDisponibles && !isLoading && (
                <p>No tienes formulaciones guardadas. ¡Crea una nueva!</p>
            )}

            <div className="formula-list">
                {/* CORRECCIÓN: Chequeamos que listaFormulaciones exista antes de hacer map */}
                {formulasDisponibles && listaFormulaciones.map((formula) => (
                    <div key={formula.id} className="formula-card">
                        
                        <div style={{ width: '100%', height: '10rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)', marginBottom: 'var(--spacing-md)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <span>[Imagen de Producto Omitida]</span> 
                        </div>

                        <div className="card-header">
                            <h3>{formula.nombre}</h3>
                            <span className="categoria-tag">{formula.categoria.nombre}</span>
                        </div>
                        
                        <div className="formula-description-area">
                            <p>{formula.descripcion}</p>
                            
                            <p style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-xs)', color: 'var(--text-light)' }}>
                                {formula.ingredientes.length} ingredientes | Harina, Azúcar, Mantequilla...
                            </p>
                        </div>
                        
                        <div className="card-actions">
                            <a href={`/formulacion/${formula.id}`} className="action-link">
                                Ver Fórmula &gt;
                            </a>

                            <button 
                                className="edit-button"
                                onClick={() => {
                                    handleShowEditForm(formula);
                                }}
                            >
                                Editar
                            </button>
                            <button 
                                className="delete-button"
                                onClick={() => setFormulaParaEliminar(formula)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {renderModalConfirmacion && renderModalConfirmacion()}
        </div>
    );
};

export default MisFormulaciones;