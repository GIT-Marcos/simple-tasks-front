import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TasksPage } from "./pages/TasksPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TasksPage />
    </QueryClientProvider>
  );
};

export default App;
