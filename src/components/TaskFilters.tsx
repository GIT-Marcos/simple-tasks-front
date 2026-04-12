import React, { useState, useEffect } from "react";
import { Search, Calendar, Filter, RotateCcw } from "lucide-react";
import { TaskFilters } from "../types";

interface TaskFiltersProps {
  onFilterChange: (filters: TaskFilters) => void;
  initialFilters: TaskFilters;
}

interface FilterState {
  description: string;
  minDate: string;
  maxDate: string;
  completed: string;
}

/**
 * Transforma el estado interno de los filtros al tipo global TaskFilters.
 * La normalización ISO final ocurre en la capa de la API para mayor consistencia.
 */
const transformFilters = (filters: FilterState): TaskFilters => {
  return {
    description: filters.description.trim() || undefined,
    completed: filters.completed === "" ? undefined : filters.completed === "true",
    minDate: filters.minDate.trim() || undefined,
    maxDate: filters.maxDate.trim() || undefined,
  };
};

export const TaskFiltersComponent: React.FC<TaskFiltersProps> = ({ onFilterChange, initialFilters }) => {
  const [localFilters, setLocalFilters] = useState<FilterState>({
    description: initialFilters.description || "",
    minDate: initialFilters.minDate?.split("T")[0] || "",
    maxDate: initialFilters.maxDate?.split("T")[0] || "", // This might be tricky because of normalization +86400000
    completed: initialFilters.completed === undefined ? "" : String(initialFilters.completed),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    const resetState = {
      description: "",
      minDate: "",
      maxDate: "",
      completed: "",
    };
    setLocalFilters(resetState);
    onFilterChange(transformFilters(resetState));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(transformFilters(localFilters));
    }, 400);

    return () => clearTimeout(timer);
  }, [localFilters, onFilterChange]);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-8 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest">
          <Filter className="h-4 w-4 text-blue-600" />
          Filtros de Búsqueda
        </h3>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors group"
        >
          <RotateCcw className="h-3 w-3 group-hover:rotate-[-45deg] transition-transform" />
          Limpiar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Búsqueda por descripción */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
            Descripción
          </label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              name="description"
              value={localFilters.description}
              onChange={handleInputChange}
              placeholder="Ej: Comprar pan..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Fecha Desde */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
            Desde (Fecha)
          </label>
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
            <input
              type="date"
              name="minDate"
              value={localFilters.minDate}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Fecha Hasta */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
            Hasta (Fecha)
          </label>
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
            <input
              type="date"
              name="maxDate"
              value={localFilters.maxDate}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
            Estado de Tarea
          </label>
          <div className="relative">
            <select
              name="completed"
              value={localFilters.completed}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Todos los estados</option>
              <option value="false">Pendientes</option>
              <option value="true">Completadas</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Etiquetas de filtros activos */}
      {(localFilters.description || localFilters.minDate || localFilters.maxDate || localFilters.completed !== "") && (
        <div className="mt-6 pt-4 border-t border-slate-50 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1">
          {localFilters.description && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-black uppercase rounded-full border border-blue-100">
              Texto: {localFilters.description}
            </span>
          )}
          {localFilters.completed !== "" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-[11px] font-black uppercase rounded-full border border-purple-100">
              Estado: {localFilters.completed === "true" ? "Completadas" : "Pendientes"}
            </span>
          )}
          {(localFilters.minDate || localFilters.maxDate) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 text-[11px] font-black uppercase rounded-full border border-amber-100">
              Rango de fechas activo
            </span>
          )}
        </div>
      )}
    </div>
  );
};