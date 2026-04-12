import React, { useState } from "react";
import { Trash2, CheckCircle, Circle, Clock, Loader2, Edit3 } from "lucide-react";
import { Task } from "../types";
import { usePatchTask } from "../api/queries";
import { DeleteTaskModal } from "./DeleteTaskModal";
import { TaskEditForm } from "./TaskEditForm";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const patchTask = usePatchTask();

  const handleToggle = async () => {
    try {
      await patchTask.mutateAsync({
        id: task.id,
        data: { completed: !task.completed },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const formattedDate = format(new Date(task.creationDate), "PPP p", { locale: es });

  return (
    <>
      <div className={`group relative bg-white p-5 rounded-xl border transition-all duration-200 hover:shadow-md ${task.completed ? 'border-green-100 bg-green-50/20' : 'border-gray-200'}`}>
        {isEditing ? (
          <TaskEditForm 
            task={task} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <div className="flex items-start gap-4">
            <button
              onClick={handleToggle}
              disabled={patchTask.isPending}
              className={`flex-shrink-0 mt-1 transition-colors ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'}`}
            >
              {patchTask.isPending ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : task.completed ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <Circle className="h-6 w-6" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <p className={`text-base font-medium transition-all ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {task.description}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                  <Clock className="h-3 w-3" />
                  {formattedDate}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${task.completed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {task.completed ? 'Completado' : 'Pendiente'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar tarea"
              >
                <Edit3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar tarea"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteTaskModal
        taskId={task.id}
        taskDescription={task.description}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};
