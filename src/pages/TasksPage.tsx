import React, { useState, useEffect } from "react";
import { useQueryClient, useIsFetching, useIsMutating } from "@tanstack/react-query";
import { AppLayout } from "../components/AppLayout";
import { TaskForm } from "../components/TaskForm";
import { TaskFiltersComponent } from "../components/TaskFilters";
import { TaskList } from "../components/TaskList";
import { ErrorNotifier } from "../components/ErrorNotifier";
import { TaskFilters } from "../types";
import { useColdStartDetector } from "../api/queries";

/**
 * TasksPage: Componente principal que integra todas las funcionalidades del sistema.
 * Maneja el estado global de filtros, la detección de errores y el layout principal.
 */
export const TasksPage: React.FC = () => {
  const [filters, setFilters] = useState<TaskFilters>({
    description: "",
    minDate: "",
    maxDate: "",
    completed: undefined,
  });
  
  const [lastError, setLastError] = useState<any>(null);
  const qc = useQueryClient();

  // Suscripción global a errores de Query y Mutation para notificaciones
  useEffect(() => {
    const unsubscribeQuery = qc.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.query.state.status === 'error') {
        setLastError(event.query.state.error);
      }
    });
    
    const unsubscribeMutation = qc.getMutationCache().subscribe((event) => {
      if (event.type === 'updated' && event.mutation.state.status === 'error') {
        setLastError(event.mutation.state.error);
      }
    });

    return () => {
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [qc]);

  // Detección de arranque en frío (10s de inactividad de la API)
  const fetchingCount = useIsFetching();
  const mutatingCount = useIsMutating();
  const isSlow = useColdStartDetector(fetchingCount > 0 || mutatingCount > 0);

  return (
    <AppLayout isSlow={isSlow}>
      {/* Notificador de errores global */}
      <ErrorNotifier error={lastError} onClear={() => setLastError(null)} />

      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
        {/* Encabezado de la página */}
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              Gestión de Tareas
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-xl">
              Organiza, filtra y completa tus objetivos diarios con esta plataforma.
            </p>
          </div>
        </header>

        {/* Sección de Creación */}
        <section className="relative z-30">
          <TaskForm />
        </section>

        {/* Sección de Filtros */}
        <section className="relative z-20">
          <TaskFiltersComponent 
            initialFilters={filters} 
            onFilterChange={setFilters} 
          />
        </section>

        {/* Listado de Tareas con Paginación */}
        <section className="relative z-10 min-h-[400px]">
          <TaskList filters={filters} />
        </section>
      </div>
    </AppLayout>
  );
};
