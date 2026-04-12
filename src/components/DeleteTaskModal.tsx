import React, { useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { useDeleteTask } from "../api/queries";

interface DeleteTaskModalProps {
  taskId: number;
  taskDescription: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  taskId,
  taskDescription,
  isOpen,
  onClose,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const deleteTask = useDeleteTask();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setErrorMessage(null);
    try {
      await deleteTask.mutateAsync(taskId);
      onClose();
    } catch (err: any) {
      if (err.status === 404) {
        onClose();
        return;
      }
    
      if (err.status === 409) {
        setErrorMessage("Ya existe una tarea con esa descripción");
      } else if (err.status === 429) {
        setErrorMessage("Demasiadas solicitudes, intente más tarde");
      } else if (err.validationError) {
        setErrorMessage(err.validationError.message);
      } else {
        setErrorMessage(err.message || "Error inesperado");
      }
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center mb-6">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">
              ¿Eliminar tarea?
            </h3>
            
            <p className="text-slate-500 font-medium mb-6">
              Estás a punto de borrar permanentemente:
              <span className="block mt-2 text-slate-800 font-black italic px-4 py-2 bg-slate-50 rounded-xl line-clamp-2">
                "{taskDescription}"
              </span>
            </p>

            {errorMessage && (
              <div className="w-full mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-in slide-in-from-top-2">
                {errorMessage}
              </div>
            )}

            <div className="flex w-full gap-3">
              <button
                onClick={onClose}
                disabled={deleteTask.isPending}
                className="flex-1 px-6 py-4 font-black text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={deleteTask.isPending}
                className="flex-1 px-6 py-4 font-black text-white bg-red-600 hover:bg-red-700 rounded-2xl transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {deleteTask.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};