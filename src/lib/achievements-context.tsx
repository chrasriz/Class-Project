"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Achievement =
  | "decrypted_email"
  | "breached_system"
  | "restored_system"
  | "found_terminal"
  | "konami";

export const ACHIEVEMENT_LABELS: Record<Achievement, string> = {
  decrypted_email: "SIGNAL DECRYPTED",
  breached_system: "SYSTEM BREACHED",
  restored_system: "SYSTEM RESTORED",
  found_terminal: "SHELL DISCOVERED",
  konami: "CHEAT CODE ACCEPTED",
};

const STORAGE_KEY = "rskh:achievements";

function readStored(): Achievement[] {
  // Guarded: runs in the useState initializer, which also executes during SSR.
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((a): a is Achievement => typeof a === "string" && a in ACHIEVEMENT_LABELS);
  } catch {
    return [];
  }
}

type AchievementsContextType = {
  unlocked: readonly Achievement[];
  unlock: (achievement: Achievement) => void;
  /** Most recently *new* unlock — consumed by the toast layer. */
  lastUnlock: Achievement | null;
  clearLastUnlock: () => void;
};

const AchievementsContext = createContext<AchievementsContextType>({
  unlocked: [],
  unlock: () => {},
  lastUnlock: null,
  clearLastUnlock: () => {},
});

/**
 * Session-scoped meta-game: interactions around the site (decrypting the
 * email, breaching/restoring the system, finding the terminal) unlock
 * achievements. Resets per session, like the rest of the reveal mechanics.
 */
export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<Achievement[]>(readStored);
  const [lastUnlock, setLastUnlock] = useState<Achievement | null>(null);

  const unlock = useCallback(
    (achievement: Achievement) => {
      if (unlocked.includes(achievement)) return;
      setUnlocked((prev) => (prev.includes(achievement) ? prev : [...prev, achievement]));
      setLastUnlock(achievement);
    },
    [unlocked]
  );

  const clearLastUnlock = useCallback(() => setLastUnlock(null), []);

  // Persist react state → storage (never the other direction after init).
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
    } catch {
      // storage unavailable — achievements just won't survive a reload
    }
  }, [unlocked]);

  return (
    <AchievementsContext.Provider value={{ unlocked, unlock, lastUnlock, clearLastUnlock }}>
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  return useContext(AchievementsContext);
}
