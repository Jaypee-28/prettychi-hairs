import { testimonialRepository } from "./testimonial.repository";
import { z } from "zod";
import { CreateTestimonialSchema, UpdateTestimonialSchema } from "./testimonial.schema";

export const testimonialService = {
  createTestimonial: async (data: z.infer<typeof CreateTestimonialSchema>) => {
    return testimonialRepository.create({
      ...data,
      isApproved: false,
    });
  },

  getApprovedTestimonials: async () => {
    return testimonialRepository.findApproved();
  },

  getAllTestimonialsAdmin: async () => {
    return testimonialRepository.findAllAdmin();
  },

  updateApproval: async (id: string, data: z.infer<typeof UpdateTestimonialSchema>) => {
    return testimonialRepository.update(id, data);
  },

  deleteTestimonial: async (id: string) => {
    return testimonialRepository.delete(id);
  }
};
