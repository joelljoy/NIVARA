"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ElderlyModeContextValue {
  elderlyMode: boolean;
  toggleElderlyMode: () => void;
}

const ElderlyModeContext = createContext<ElderlyModeContextValue>({
  elderlyMode: false,
  toggleElderlyMode: () => {},
});

export function ElderlyModeProvider({ children }: { children: React.ReactNode }) {
  const [elderlyMode, setElderlyMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("nivara-elderly-mode");
    if (stored === "true") setElderlyMode(true);
  }, []);

  useEffect(() => {
    if (elderlyMode) {
      document.documentElement.classList.add("elderly-mode");
    } else {
      document.documentElement.classList.remove("elderly-mode");
    }
    localStorage.setItem("nivara-elderly-mode", String(elderlyMode));
  }, [elderlyMode]);

  const toggleElderlyMode = () => setElderlyMode((prev) => !prev);

  return (
    <ElderlyModeContext.Provider value={{ elderlyMode, toggleElderlyMode }}>
      {children}
    </ElderlyModeContext.Provider>
  );
}

export function useElderlyMode() {
  return useContext(ElderlyModeContext);
}
