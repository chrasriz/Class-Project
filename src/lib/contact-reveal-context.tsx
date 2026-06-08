"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ContactRevealContextType = {
  emailRevealed: boolean;
  revealEmail: () => void;
};

const ContactRevealContext = createContext<ContactRevealContextType>({
  emailRevealed: false,
  revealEmail: () => {},
});

/**
 * Tracks whether the visitor has completed the Contact "decrypt" interaction.
 * Until they have, the email stays masked everywhere else (e.g. the footer) so
 * the reveal isn't spoiled. Resets on reload, which is fine — re-decrypting is
 * part of the bit.
 */
export function ContactRevealProvider({ children }: { children: ReactNode }) {
  const [emailRevealed, setEmailRevealed] = useState(false);
  const revealEmail = useCallback(() => setEmailRevealed(true), []);

  return (
    <ContactRevealContext.Provider value={{ emailRevealed, revealEmail }}>
      {children}
    </ContactRevealContext.Provider>
  );
}

export function useContactReveal() {
  return useContext(ContactRevealContext);
}
