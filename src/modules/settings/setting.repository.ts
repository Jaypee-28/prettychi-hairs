import { prisma } from "@/lib/db";
import { UpdateSettingsInput } from "./setting.schema";

const DEFAULT_SETTINGS = {
  storeName: "Pretty Chi Hairs",
  supportEmail: "hello@prettychihairs.com",
  ukDeliveryFee: 2000.0,
  intlDeliveryFee: 4000.0,
  currency: "NGN",
};

export class SettingRepository {
  /**
   * Retrieves the single settings row, creating it with defaults if none exists.
   */
  async getSettings() {
    const existing = await prisma.setting.findFirst();
    if (existing) return existing;

    // Auto-create default settings row
    return prisma.setting.create({
      data: DEFAULT_SETTINGS,
    });
  }

  /**
   * Updates the single settings row — only writes fields that are provided.
   */
  async updateSettings(data: UpdateSettingsInput) {
    const current = await this.getSettings();

    return prisma.setting.update({
      where: { id: current.id },
      data: {
        // Delivery & store fields
        ...(data.storeName !== undefined && { storeName: data.storeName }),
        ...(data.supportEmail !== undefined && { supportEmail: data.supportEmail }),
        ...(data.ukDeliveryFee !== undefined && { ukDeliveryFee: data.ukDeliveryFee }),
        ...(data.intlDeliveryFee !== undefined && { intlDeliveryFee: data.intlDeliveryFee }),
        // Hero section fields
        // heroVideoUrl: null clears it, a string sets it, undefined skips it
        ...(data.heroVideoUrl !== undefined && { heroVideoUrl: data.heroVideoUrl ?? null }),
        ...(data.heroTopLabel !== undefined && { heroTopLabel: data.heroTopLabel }),
        ...(data.heroTitle !== undefined && { heroTitle: data.heroTitle }),
        ...(data.heroWords !== undefined && { heroWords: data.heroWords }),
        ...(data.heroSubtitle !== undefined && { heroSubtitle: data.heroSubtitle }),
        ...(data.heroPrimaryCTA !== undefined && { heroPrimaryCTA: data.heroPrimaryCTA }),
        ...(data.heroSecondaryCTA !== undefined && { heroSecondaryCTA: data.heroSecondaryCTA }),
        ...(data.currency !== undefined && { currency: data.currency }),
      },
    });
  }
}

export const settingRepository = new SettingRepository();
