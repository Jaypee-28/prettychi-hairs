import { settingService } from "@/modules/settings/setting.service";
import { HeroContent, HeroData } from "./hero-content";

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_HERO_WORDS = [
  "Raw Donor Hair",
  "Luxury Wigs",
  "Bone Straight",
  "Frontals & Closures",
  "Seamless Installs",
  "Bespoke Coloring",
];

// ── Server Component ─────────────────────────────────────────────────────────
// Fetches from DB, normalises data, passes to client component.
// Falls back gracefully if settings row doesn't exist or hero fields are null.

export async function HeroSection() {
  let heroData: HeroData;

  try {
    const settings = await settingService.getSettings();

    // Parse heroWords from JSON (stored as Json? in Prisma)
    let heroWords: string[] = DEFAULT_HERO_WORDS;
    if (settings.heroWords) {
      const raw = settings.heroWords;
      if (Array.isArray(raw) && raw.every((w) => typeof w === "string")) {
        heroWords = raw as string[];
      }
    }

    heroData = {
      heroVideoUrl: (settings as any).heroVideoUrl ?? null,
      heroTopLabel: (settings as any).heroTopLabel ?? null,
      heroTitle: (settings as any).heroTitle ?? null,
      heroWords,
      heroSubtitle: (settings as any).heroSubtitle ?? null,
      heroPrimaryCTA: (settings as any).heroPrimaryCTA ?? null,
      heroSecondaryCTA: (settings as any).heroSecondaryCTA ?? null,
    };
  } catch {
    // Fallback — hero must NEVER break the page
    heroData = {
      heroVideoUrl: null,
      heroTopLabel: null,
      heroTitle: null,
      heroWords: DEFAULT_HERO_WORDS,
      heroSubtitle: null,
      heroPrimaryCTA: null,
      heroSecondaryCTA: null,
    };
  }

  return <HeroContent data={heroData} />;
}
