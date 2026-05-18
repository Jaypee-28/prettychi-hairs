import { settingRepository } from "./setting.repository";
import { UpdateSettingsInput } from "./setting.schema";

export class SettingService {
  async getSettings() {
    return settingRepository.getSettings();
  }

  async updateSettings(data: UpdateSettingsInput) {
    return settingRepository.updateSettings(data);
  }

  /**
   * Returns the delivery fee for a given country.
   * Used by the Order Service to calculate dynamic delivery fees.
   */
  async getDeliveryFee(country: string): Promise<number> {
    const settings = await settingRepository.getSettings();
    // Brand is nationwide. We return the Nationwide Delivery Fee (stored in ukDeliveryFee).
    return Number(settings.ukDeliveryFee);
  }
}

export const settingService = new SettingService();
