// Pure state machine for the Contact "decrypt" flow. All phase transitions
// live here so illegal ones are impossible to express from the component —
// this logic has a history of timing regressions when spread across effects.

export type ConfigKey = "protocol" | "cipher" | "key_exchange";

export type ConfigOption = { value: string; secure: boolean; tag?: string };

export const CONFIG_OPTIONS: Record<ConfigKey, ConfigOption[]> = {
  protocol: [
    { value: "TLS 1.3", secure: true },
    { value: "TLS 1.2", secure: true },
    { value: "QUIC", secure: true },
    { value: "SSH-2", secure: true },
    { value: "SSL 3.0", secure: false, tag: "DEPRECATED" },
    { value: "TLS 1.0", secure: false, tag: "VULNERABLE" },
  ],
  cipher: [
    { value: "AES-256-GCM", secure: true },
    { value: "ChaCha20-Poly1305", secure: true },
    { value: "AES-128-CBC", secure: true },
    { value: "Camellia-256", secure: true },
    { value: "RC4", secure: false, tag: "BROKEN" },
    { value: "DES-CBC", secure: false, tag: "DEPRECATED" },
    { value: "NULL", secure: false, tag: "NO ENCRYPTION" },
  ],
  key_exchange: [
    { value: "X25519", secure: true },
    { value: "P-384", secure: true },
    { value: "RSA-4096", secure: true },
    { value: "DH-2048", secure: true },
    { value: "RSA-512", secure: false, tag: "BREAKABLE" },
    { value: "DH-768", secure: false, tag: "WEAK" },
    { value: "NULL", secure: false, tag: "NO KEY EXCHANGE" },
  ],
};

export const CONFIG_KEYS = Object.keys(CONFIG_OPTIONS) as ConfigKey[];

export type ContactPhase = "idle" | "scanning" | "decrypting" | "revealed" | "hacked";

export type ContactConfig = Record<ConfigKey, string>;

export type ContactState = {
  phase: ContactPhase;
  config: ContactConfig;
  expandedLine: ConfigKey | null;
  pendingChange: { key: ConfigKey; value: string } | null;
  showConfigWarning: boolean;
};

export const INITIAL_CONTACT_STATE: ContactState = {
  phase: "idle",
  config: { protocol: "", cipher: "", key_exchange: "" },
  expandedLine: null,
  pendingChange: null,
  showConfigWarning: false,
};

export function isOptionSecure(key: ConfigKey, value: string): boolean {
  const opt = CONFIG_OPTIONS[key].find((o) => o.value === value);
  return opt ? opt.secure : true;
}

export function isConfigured(config: ContactConfig): boolean {
  return CONFIG_KEYS.every((key) => config[key] !== "");
}

export function insecureCount(config: ContactConfig): number {
  return CONFIG_KEYS.filter((key) => config[key] !== "" && !isOptionSecure(key, config[key]))
    .length;
}

export function isSecureConfig(config: ContactConfig): boolean {
  return isConfigured(config) && insecureCount(config) === 0;
}

/** Two or more weak parameters: decrypting through this breaches the system. */
export function isCriticallyInsecure(config: ContactConfig): boolean {
  return insecureCount(config) >= 2;
}

export type ContactEvent =
  | { type: "TOGGLE_LINE"; key: ConfigKey }
  | { type: "SELECT_OPTION"; key: ConfigKey; value: string }
  | { type: "CONFIRM_CHANGE" }
  | { type: "CANCEL_CHANGE" }
  | { type: "DECRYPT_PRESSED" }
  | { type: "SCAN_COMPLETE" }
  | { type: "BREACH_COMPLETE" }
  | { type: "SCRAMBLE_DONE" }
  | { type: "HIDE_CONFIG_WARNING" };

export function contactReducer(state: ContactState, event: ContactEvent): ContactState {
  switch (event.type) {
    case "TOGGLE_LINE":
      return {
        ...state,
        expandedLine: state.expandedLine === event.key ? null : event.key,
      };

    case "SELECT_OPTION":
      if (event.value === state.config[event.key]) {
        return { ...state, expandedLine: null };
      }
      return { ...state, pendingChange: { key: event.key, value: event.value } };

    case "CONFIRM_CHANGE": {
      if (!state.pendingChange) return state;
      return {
        ...state,
        config: { ...state.config, [state.pendingChange.key]: state.pendingChange.value },
        pendingChange: null,
        expandedLine: null,
        // Any config change invalidates a finished or in-flight decrypt.
        // Hacked recovery still requires a full re-decrypt through a secure
        // config, so global hacked state is left to the component.
        phase: "idle",
      };
    }

    case "CANCEL_CHANGE":
      return { ...state, pendingChange: null };

    case "DECRYPT_PRESSED": {
      if (state.phase !== "idle") return state;
      if (!isConfigured(state.config)) {
        return { ...state, expandedLine: null, showConfigWarning: true };
      }
      // A critically insecure decrypt skips the scan and breaches almost
      // immediately (BREACH_COMPLETE follows after a short timer).
      return {
        ...state,
        expandedLine: null,
        showConfigWarning: false,
        phase: isCriticallyInsecure(state.config) ? "decrypting" : "scanning",
      };
    }

    case "SCAN_COMPLETE":
      return state.phase === "scanning" ? { ...state, phase: "decrypting" } : state;

    case "BREACH_COMPLETE":
      return state.phase === "decrypting" && isCriticallyInsecure(state.config)
        ? { ...state, phase: "hacked" }
        : state;

    case "SCRAMBLE_DONE":
      // Ignored when a breach is imminent — under reduced motion the scramble
      // resolves instantly and must not outrun the breach timer.
      return state.phase === "decrypting" && !isCriticallyInsecure(state.config)
        ? { ...state, phase: "revealed" }
        : state;

    case "HIDE_CONFIG_WARNING":
      return { ...state, showConfigWarning: false };
  }
}
