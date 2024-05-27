"use client";
import React, { createContext, ReactNode, useContext } from "react";

interface StoreProviderProps {
  storeId: string;
  children: ReactNode;
}

const StoreContext = createContext<string | undefined>(undefined);

export function StoreProvider({ storeId, children }: StoreProviderProps) {
  return (
    <StoreContext.Provider value={storeId}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
