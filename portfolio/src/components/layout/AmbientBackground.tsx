"use client";

export function AmbientBackground() {
  return (
    <>
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>
      <div className="grid-pattern" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
    </>
  );
}
