import React from "react";
import { useTasks } from "../api/queries";
import { TaskItem } from "./TaskItem";
import { TaskFilters } from "../types";
import { Loader2, LayoutList } from "lucide-react";

interface TaskListProps {
  filters: TaskFilters;
}

export const TaskList: React.FC<TaskListProps> = ({ filters }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useTasks(filters);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Cargando tus tareas...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto">
        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 font-bold text-2xl">!</span>
        </div>
        <h3 className="text-lg font-bold text-red-900 mb-2">Ha ocurrido un error</h3>
        <p className="text-red-700">{(error as any)?.message || "No se pudieron cargar las tareas"}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const tasks = data?.pages.flatMap((page) => page.content) || [];

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 shadow-sm">
        <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <LayoutList className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No hay tareas</h3>
        <p className="text-gray-500 max-w-xs mx-auto mb-6">
          Parece que no tienes tareas que coincidan con tus filtros. ¿Por qué no creas una nueva?
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-8 pb-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl shadow-sm transition-all hover:shadow-md disabled:opacity-50"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando más...
              </>
            ) : (
              "Ver más tareas"
            )}
          </button>
        </div>
      )}
    </div>
  );
};
