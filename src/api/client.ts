import { Task, TaskCreateRequest, TaskPatchRequest, WindowSchema, TaskFilters, PaginationParams } from "../types";
import { normalizeDateFilters } from "../utils/date";

// @ts-ignore
const API_URL = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : null) || import.meta.env.VITE_API_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(public status: number, message: string, public validationError?: any) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = {};
    }

    if (response.status === 409) {
      throw new ApiError(409, "Ya existe una tarea con esa descripción");
    }
    if (response.status === 429) {
      throw new ApiError(429, "Demasiadas solicitudes, intente más tarde");
    }
    
    // Manejo de errores de validación
    if (errorData.message) {
      // Pasamos errorData como validationError para cumplir la regla del prompt
      throw new ApiError(response.status, errorData.message, errorData);
    }
    
    throw new ApiError(response.status, "Error inesperado");
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

export const taskApi = {
  getTasks: async (filters: TaskFilters, pagination: PaginationParams): Promise<WindowSchema<Task>> => {
    const normalizedFilters = normalizeDateFilters(filters);
    const params = new URLSearchParams();
    
    if (normalizedFilters.description) params.append("description", normalizedFilters.description);
    if (normalizedFilters.minDate) params.append("minDate", normalizedFilters.minDate);
    if (normalizedFilters.maxDate) params.append("maxDate", normalizedFilters.maxDate);
    if (normalizedFilters.completed !== undefined) params.append("completed", String(normalizedFilters.completed));
    
    if (pagination.lastId !== undefined) params.append("lastId", String(pagination.lastId));
    if (pagination.lastDate) params.append("lastDate", pagination.lastDate);
    if (pagination.size) params.append("size", String(pagination.size));

    const response = await fetch(`${API_URL}/api/tasks?${params.toString()}`);
    return handleResponse<WindowSchema<Task>>(response);
  },

  createTask: async (data: TaskCreateRequest): Promise<Task> => {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Task>(response);
  },

  patchTask: async (id: number, data: TaskPatchRequest): Promise<Task> => {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Task>(response);
  },

  deleteTask: async (id: number): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
    });
    return handleResponse<{ success: boolean }>(response);
  },
};