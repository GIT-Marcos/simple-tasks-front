import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "./client";
import { TaskFilters, TaskCreateRequest, TaskPatchRequest } from "../types";
import { useState, useEffect } from "react";

export function useTasks(filters: TaskFilters) {
  return useInfiniteQuery({
    queryKey: ["tasks", filters],
    queryFn: ({ pageParam }) =>
      taskApi.getTasks(filters, {
        lastId: pageParam?.lastId,
        lastDate: pageParam?.lastDate,
        size: 10,
      }),
    initialPageParam: undefined as { lastId: number; lastDate: string } | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.last || lastPage.empty) return undefined;
      const lastItem = lastPage.content[lastPage.content.length - 1];
      return { lastId: lastItem.id, lastDate: lastItem.creationDate };
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskCreateRequest) => taskApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function usePatchTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskPatchRequest }) =>
      taskApi.patchTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Global state tracking for "Cold Start"
export function useColdStartDetector(isFetching: boolean) {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    let timer: number;
    if (isFetching) {
      timer = window.setTimeout(() => {
        setIsSlow(true);
      }, 10000);
    } else {
      setIsSlow(false);
    }
    return () => clearTimeout(timer);
  }, [isFetching]);

  return isSlow;
}
