import { TaskFilters } from "../types";

/**
 * Normaliza los filtros de fecha para asegurar que se envíen en formato ISO 8601 UTC.
 * Corrige el error de "Invalid time value" al evitar doble normalización y
 * ajusta el límite superior para no incluir resultados del día siguiente.
 */
export function normalizeDateFilters(filters: TaskFilters): TaskFilters {
  const normalize = (dateValue: string | undefined, endOfDay: boolean) => {
    if (!dateValue || dateValue.trim() === "") return undefined;
    
    // Si ya es un formato ISO completo (contiene 'T'), no normalizar de nuevo para evitar "Invalid time value"
    if (dateValue.includes('T')) return dateValue;

    try {
      // Intentar construir el objeto Date asumiendo formato YYYY-MM-DD del input de tipo date
      const suffix = endOfDay ? "T23:59:59.999Z" : "T00:00:00.000Z";
      const isoString = dateValue + suffix;
      const d = new Date(isoString);
      
      if (isNaN(d.getTime())) {
        console.error("Invalid date value encountered:", dateValue);
        return undefined;
      }
      
      return d.toISOString();
    } catch (e) {
      console.error("Error normalizing date:", e);
      return undefined;
    }
  };

  return {
    ...filters,
    minDate: normalize(filters.minDate, false),
    maxDate: normalize(filters.maxDate, true),
  };
}