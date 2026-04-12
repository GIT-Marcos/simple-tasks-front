import React from "react";
import { Loader2 } from "lucide-react";

interface ColdStartOverlayProps {
  isVisible: boolean;
}

export const ColdStartOverlay: React.FC<ColdStartOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="rounded-xl bg-white p-8 shadow-2xl flex flex-col items-center max-w-sm text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Despertando al servidor</h2>
        <p className="text-gray-600">
          La API se está iniciando tras un período de inactividad. Esto puede tardar hasta 2 minutos. Gracias por tu paciencia.
        </p>
      </div>
    </div>
  );
};

interface AppLayoutProps {
  children: React.ReactNode;
  isSlow: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, isSlow }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Simple Task</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
              v1.0.0
            </span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="w-full bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Simple Tasks by Marcos.
        </div>
      </footer>

      <ColdStartOverlay isVisible={isSlow} />
    </div>
  );
};
