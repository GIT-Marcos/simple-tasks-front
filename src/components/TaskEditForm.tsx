import React, { useState } from "react";
import { Check, X, Loader2, AlertCircle } from "lucide-react";
import { Task, TaskCreateRequestSchema } from "../types";
import { usePatchTask } from "../api/queries";
import { z } from "zod";

interface TaskEditFormProps {
  task: Task;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const TaskEditForm: React.FC<TaskEditFormProps> = ({ task, onCancel, onSuccess }) => {
  const [description, setDescription] = useState(task.description);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const patchTask = usePatchTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      // Validar con Zod: longitud 1 a 140 (usamos el mismo schema de creación)
      TaskCreateRequestSchema.parse({ description });

      if (description === task.description) {
        onCancel();
        return;
      }

      await patchTask.mutateAsync({
        id: task.id,
        data: { description },
      });

      if (onSuccess) onSuccess();
      onCancel();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrorMessage(err.issues[0].message);
        return;
      }
    
      if (err.status === 404) {
        setErrorMessage("La tarea ya no existe o fue eliminada");
        return;
      }
    
      if (err.status === 409) {
        setErrorMessage("Ya existe una tarea con esa descripción");
        return;
      }
    
      if (err.status === 429) {
        setErrorMessage("Demasiadas solicitudes, intente más tarde");
        return;
      }
    
      if (err.validationError) {
        setErrorMessage(err.validationError.message || "Error de validación");
        return;
      }
    
      setErrorMessage(err.message || "Error inesperado");
    }
  };

  const isTooLong = description.length > 140;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-start gap-2">
        <div className="flex-1 relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoFocus
            rows={2}
            className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-base font-bold text-slate-800 placeholder:text-slate-300 transition-all outline-none resize-none ${
              errorMessage 
                ? "border-red-100 focus:border-red-200 focus:ring-4 focus:ring-red-50" 
                : "border-slate-100 focus:border-blue-200 focus:ring-4 focus:ring-blue-50"
            }`}
            placeholder="Edita la descripción..."
            disabled={patchTask.isPending}
          />
          <div className="absolute right-3 bottom-2">
             <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
              isTooLong ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-400 border-slate-100"
            }`}>
              {description.length}/140
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={patchTask.isPending || !description.trim() || isTooLong}
            className="p-3 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-90"
            title="Guardar cambios"
          >
            {patchTask.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={patchTask.isPending}
            className="p-3 bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-all active:scale-90"
            title="Cancelar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {errorMessage && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs font-bold animate-in slide-in-from-left-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}
    </form>
  );
};
