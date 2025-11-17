import React from 'react';

// Mapea las variantes a las clases CSS puras que tienes definidas
const obtenerClaseDeVariante = (variante) => {
    switch (variante) {
        case 'principal':
        case 'enviar':
            return 'submit-button'; // Botón principal (verde/azul)
        case 'peligro':
            return 'delete-button'; // Botón de eliminación (rojo)
        case 'cancelar':
            return 'cancel-button'; // Botón de cancelación (gris/claro)
        case 'outline-secundario':
            // Se usa para el botón "Crea tu primera fórmula" en el landing page
            return 'new-formula-button-outline'; 
        default:
            return 'submit-button';
    }
};

const Boton = ({
    texto,
    variante = 'enviar', 
    claseAdicional = '',
    deshabilitado = false,
    onClick,
    type = 'button',
    children,
    ...props
}) => {
    
    const claseBase = obtenerClaseDeVariante(variante);
    
    return (
        <button
            type={type}
            disabled={deshabilitado}
            onClick={onClick}
            className={`${claseBase} ${claseAdicional}`}
            aria-disabled={deshabilitado}
            {...props}
        >
            {children || texto}
        </button>
    );
};

export default Boton;