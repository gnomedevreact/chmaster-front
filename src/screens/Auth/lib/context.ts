// MyContext.tsx
import { createContext, useContext } from 'react';

interface GlobalLoadingContextType {
  isGlobalLoading: boolean;
  setIsGlobalLoading: (e: boolean) => void;
}

export const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(
  undefined,
);

export const useGlobalLoadingContext = () => {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('Context must be used within a ContextProvider');
  }
  return context;
};

export default GlobalLoadingContext;
