"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type HackedContextType = {
  isHacked: boolean;
  setHacked: (value: boolean) => void;
};

const HackedContext = createContext<HackedContextType>({
  isHacked: false,
  setHacked: () => {},
});

export function HackedProvider({ children }: { children: ReactNode }) {
  const [isHacked, setIsHacked] = useState(false);

  const setHacked = useCallback((value: boolean) => {
    setIsHacked(value);
    // Toggle data attribute on document for CSS overrides
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-hacked", String(value));
    }
  }, []);

  return (
    <HackedContext.Provider value={{ isHacked, setHacked }}>
      {children}
    </HackedContext.Provider>
  );
}

export function useHacked() {
  return useContext(HackedContext);
}
