import { z } from "zod";

export const TaskSchema = z.object({
  id: z.number(),
  description: z.string().min(1, "La descripción es requerida").max(140, "Máximo 140 caracteres"),
  completed: z.boolean(),
  creationDate: z.string(), // ISO 8601 UTC
});

export const TaskCreateRequestSchema = z.object({
  description: z.string().min(1, "La descripción es requerida").max(140, "Máximo 140 caracteres"),
});

export const TaskPatchRequestSchema = z.object({
  description: z.string().min(1, "La descripción es requerida").max(140, "Máximo 140 caracteres").optional(),
  completed: z.boolean().optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskCreateRequest = z.infer<typeof TaskCreateRequestSchema>;
export type TaskPatchRequest = z.infer<typeof TaskPatchRequestSchema>;

export interface WindowSchema<T> {
  content: T[];
  empty: boolean;
  last: boolean;
}

export interface TaskFilters {
  description?: string;
  minDate?: string;
  maxDate?: string;
  completed?: boolean;
}

export interface PaginationParams {
  lastId?: number;
  lastDate?: string;
  size?: number;
}
