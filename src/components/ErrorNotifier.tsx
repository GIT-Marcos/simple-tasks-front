import React, { useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

interface ErrorNotifierProps {
  error: any;
  onClear: () => void;
}

/**
 * ErrorNotifier Component
 * Muestra notificaciones de error descriptivas basadas en el código de respuesta de la API.
 */
export const ErrorNotifier: React.FC<ErrorNotifierProps> = ({ error, onClear }) => {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onClear();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, onClear]);

  if (!error) return null;

  if (error.status === 404) {
  return null;
  }

  // Implementación de reglas de negocio para mensajes de error
  let errorMessage = "Error inesperado";
  
  if (error.status === 409) {
    errorMessage = "Ya existe una tarea con esa descripción";
  } else if (error.status === 429) {
    errorMessage = "Demasiadas solicitudes, intente más tarde";
  } else if (error.validationError) {
    // Si la API devuelve un objeto de validación con mensaje
    errorMessage = error.validationError.message || "Error de validación";
  } else if (error.message) {
    errorMessage = error.message;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-10 duration-300">
      <div className="bg-white border-l-4 border-red-600 rounded-xl shadow-2xl p-4 flex items-start gap-4 min-w-[320px] max-w-md ring-1 ring-black/5">
        <div className="bg-red-50 p-2 rounded-full">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">
            Error detectado
          </h4>
          <p className="text-sm font-medium text-slate-600 leading-relaxed">
            {errorMessage}
          </p>
        </div>
        <button 
          onClick={onClear}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-slate-600 active:scale-95"
          aria-label="Cerrar notificación"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
