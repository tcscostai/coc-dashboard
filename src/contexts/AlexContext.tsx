import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AlexContextType {
  isOpen: boolean;
  openAlex: () => void;
  closeAlex: () => void;
}

const AlexContext = createContext<AlexContextType | undefined>(undefined);

interface AlexProviderProps {
  children: ReactNode;
}

export const AlexProvider: React.FC<AlexProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openAlex = () => setIsOpen(true);
  const closeAlex = () => setIsOpen(false);

  return (
    <AlexContext.Provider value={{ isOpen, openAlex, closeAlex }}>
      {children}
    </AlexContext.Provider>
  );
};

export const useAlex = () => {
  const context = useContext(AlexContext);
  if (context === undefined) {
    throw new Error('useAlex must be used within an AlexProvider');
  }
  return context;
};
