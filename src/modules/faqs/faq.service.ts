import { faqRepository } from "./faq.repository";
import { CreateFAQInput, UpdateFAQInput } from "./faq.schema";

export const faqService = {
  async createFAQ(data: CreateFAQInput) {
    return faqRepository.create(data);
  },

  async getAllFAQs() {
    return faqRepository.findAll(false);
  },

  async getActiveFAQs() {
    return faqRepository.findAll(true);
  },

  async updateFAQ(id: string, data: UpdateFAQInput) {
    return faqRepository.update(id, data);
  },

  async deleteFAQ(id: string) {
    return faqRepository.delete(id);
  }
};
