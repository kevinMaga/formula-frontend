import React, { useEffect, useState } from 'react';
import Boton from './Boton';

const NuevaFormulacion = ({
    isFormVisible, error, formulaParaEditar, handleSubmitFormula, nombreFormula, setNombreFormula,
    descripcion, setDescripcion, categoriaId, setCategoriaId, listaCategorias,
    searchTerm, setSearchTerm, handleSearch, isLoading, resultadosBusqueda,
    handleAddIngrediente, cantidad, setCantidad, unidad, setUnidad,
    listaIngredientes, handleShowForm, handleHideForm, renderModalConfirmacion, activePath, mensajeExito, totalesNutricionales
}) => {
    // Mostrar formulario solo si isFormVisible es true o se está editando
    if (isFormVisible || formulaParaEditar) {
        return (
            <div className="form-container">
                {mensajeExito && (
                    <div className="success-message">
                        {mensajeExito}
                    </div>
                )}
                <h2>{formulaParaEditar ? 'Editar Formulación: ' + formulaParaEditar.nombre : 'Crear Nueva Formulación'}</h2>
                
                <form onSubmit={handleSubmitFormula}>
                    <div className="form-group">
                        <label>Nombre de la Fórmula:</label>
                        <input type="text" value={nombreFormula} onChange={(e) => setNombreFormula(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Descripción (Opcional):</label>
                        <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Categoría:</label>
                        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
                            <option value="" disabled>-- Selecciona una categoría --</option>
                            {listaCategorias && listaCategorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>
                    
                    <hr style={{ margin: 'var(--spacing-3xl) 0' }} />
                    
                    <h3 style={{ marginBottom: 'var(--spacing-xl)' }}>Añadir Ingredientes (Máx. 5)</h3>
                    <div className="search-section">
                        <div className="form-group-inline">
                            <input
                                type="text"
                                placeholder="Buscar ingrediente (ej. Harina)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="button" onClick={handleSearch} disabled={isLoading}>
                                {isLoading ? 'Buscando...' : 'Buscar'}
                            </button>
                        </div>
                        {resultadosBusqueda && resultadosBusqueda.length > 0 && (
                            <ul className="search-results">
                                {resultadosBusqueda.map((ing) => (
                                    <li key={ing.id}>
                                        <span>{ing.nombre}</span>
                                        <button type="button" onClick={() => handleAddIngrediente(ing)}>
                                            Añadir
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    <div className="form-group-inline">
                        <label>Cantidad:</label>
                        <input
                            type="number"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                        />
                        <label>Unidad:</label>
                        <select value={unidad} onChange={(e) => setUnidad(e.target.value)}>
                            <option value="g">g</option>
                            <option value="ml">ml</option>
                            <option value="oz">oz</option>
                            <option value="unidad">unidad</option>
                        </select>
                    </div>
                    
                    <hr style={{ margin: 'var(--spacing-3xl) 0' }} />
                    <h3 style={{ marginBottom: 'var(--spacing-xl)' }}>Ingredientes en esta Fórmula ({listaIngredientes && listaIngredientes.length}/5)</h3>
                    <ul className="ingredient-list">
                        {listaIngredientes && listaIngredientes.map((ing, index) => (
                            <li key={index}>
                                {ing.nombre} - {ing.cantidad} {ing.unidad}
                            </li>
                        ))}
                    </ul>

                    {listaIngredientes && listaIngredientes.length > 0 && totalesNutricionales && (
                        <div className="nutritional-summary">
                            <p><strong>Calorías:</strong> {totalesNutricionales.calorias.toFixed(2)} kcal</p>
                            <p><strong>Proteínas:</strong> {totalesNutricionales.proteinas.toFixed(2)} g</p>
                            <p><strong>Grasas:</strong> {totalesNutricionales.grasas.toFixed(2)} g</p>
                            <p><strong>Carbohidratos:</strong> {totalesNutricionales.carbohidratos.toFixed(2)} g</p>
                        </div>
                    )}

                    {error && <p className="error-message">{error}</p>}
                    
                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={handleHideForm}>
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={isLoading || (listaIngredientes && listaIngredientes.length === 0)}
                        >
                            {isLoading ? 'Guardando...' : (formulaParaEditar ? 'Actualizar Fórmula' : 'Guardar Fórmula')}
                        </button>
                    </div>
                </form>
                {renderModalConfirmacion && renderModalConfirmacion()}
            </div>
        );
    }
    
    // Pantalla de Bienvenida (si isFormVisible es false y no hay fórmula siendo editada)
    return (
        <div className="dashboard-container">
            <div className="dashboard-logo-section">
                <img 
                    src="/images/solinal_formula_logo_grande.svg" 
                    alt="Solinal Fórmula Logo"
                    className="dashboard-logo-lg"
                />
            </div>
            <h1 className="dashboard-title">
                Bienvenido a Fórmula el creador de recetas que trabaja con IA
            </h1>
            <p className="dashboard-description">
                No sabes que dosis máxima puedes usar en un aditivo? Fácil, crea tus recetas o fórmulas de tus productos alimenticios y utiliza en vivo la base de datos de aditivos actualizada con la Inteligencia Artificial para que tus productos cumplan con la normativa.
            </p>
            <div className="welcome-row">
                <div className="welcome-actions" style={{ gridColumn: '1 / 3', marginTop: 'var(--spacing-3xl)' }}>
                    <button 
                        type="button"
                        className="new-formula-button" 
                        onClick={handleShowForm}
                    >
                        Crea tu primera fórmula
                    </button>
                </div>

                <div className="dashboard-image-wrapper">
                    <img 
                        src="/images/img_ilustracion_chica_probeta.png" 
                        alt="Ilustración de una persona con bata y una probeta"
                        className="dashboard-illustration"
                    />
                </div>
            </div>
        </div>
    );
};

export default NuevaFormulacion;