import { HeroContent } from "./hero-content";

// ── Server Component ─────────────────────────────────────────────────────────
// Wraps the client HeroContent component.
// The new luxury design uses a static mockup implementation as requested by the user,
// so dynamic DB overrides are no longer passed down here.

export function HeroSection() {
  return <HeroContent />;
}
