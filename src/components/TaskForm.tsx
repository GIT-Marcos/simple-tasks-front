import React, { useState } from "react";
import { PlusCircle, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useCreateTask } from "../api/queries";
import { TaskCreateRequestSchema } from "../types";
import { z } from "zod";

export const TaskForm: React.FC = () => {
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const createTask = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setShowSuccess(false);

    try {
      // Validar con Zod: longitud 1 a 140
      TaskCreateRequestSchema.parse({ description });
      
      await createTask.mutateAsync({ description });
      
      setDescription("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrorMessage(err.issues[0].message);
      } else if (err.status === 409) {
        setErrorMessage("Ya existe una tarea con esa descripción");
      } else if (err.status === 429) {
        setErrorMessage("Demasiadas solicitudes, intente más tarde");
      } else if (err.validationError) {
        setErrorMessage(err.validationError.message || "Error de validación");
      } else {
        setErrorMessage("Error inesperado");
      }
    }
  };

  const charCount = description.length;
  const isTooLong = charCount > 140;

  return (
  <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-sm p-6 mb-8 transition-all hover:shadow-md">
    
    {/* Header */}
    <div className="flex items-center gap-4 mb-6">
      <div className="h-11 w-11 bg-blue-100 rounded-2xl flex items-center justify-center">
        <PlusCircle className="h-6 w-6 text-blue-600" />
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Nueva tarea
        </h3>
        <p className="text-slate-900 font-semibold text-lg">
          ¿Qué quieres hacer hoy?
        </p>
      </div>
    </div>

    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escribe tu tarea..."
          className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl text-base text-slate-800 placeholder:text-slate-400 resize-none min-h-[110px] outline-none transition
            ${
              errorMessage
                ? "border-red-300 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            }`}
          disabled={createTask.isPending}
          maxLength={150}
        />

        {/* contador */}
        <div className="absolute right-3 bottom-3">
          <span
            className={`text-[11px] px-2 py-1 rounded-lg border font-medium ${
              isTooLong
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-white text-slate-500 border-slate-200"
            }`}
          >
            {charCount}/140
          </span>
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Success */}
      {showSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm">
          <CheckCircle2 className="h-4 w-4" />
          <p>¡Tarea creada con éxito!</p>
        </div>
      )}

      {/* Button */}
      <button
        type="submit"
        disabled={createTask.isPending || !description.trim() || isTooLong}
        className="w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {createTask.isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <PlusCircle className="h-5 w-5" />
        )}
        {createTask.isPending ? "Creando..." : "Crear tarea"}
      </button>
    </form>
  </div>
);
};
