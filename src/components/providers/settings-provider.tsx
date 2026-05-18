"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface SettingsContextType {
  currency: string;
}

const SettingsContext = createContext<SettingsContextType>({
  currency: "NGN",
});

export function SettingsProvider({ 
  children, 
  currency 
}: { 
  children: ReactNode; 
  currency: string; 
}) {
  return (
    <SettingsContext.Provider value={{ currency }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
