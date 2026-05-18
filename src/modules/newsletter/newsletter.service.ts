import { newsletterRepository } from "./newsletter.repository";
import { sendNewsletterBroadcast } from "@/modules/emails/newsletter-email";
import { z } from "zod";
import { SubscribeNewsletterSchema, BroadcastNewsletterSchema } from "./newsletter.schema";

export const newsletterService = {
  subscribe: async (data: z.infer<typeof SubscribeNewsletterSchema>) => {
    const existing = await newsletterRepository.findByEmail(data.email);
    if (existing) throw new Error("Email is already subscribed.");
    return newsletterRepository.create({ email: data.email });
  },

  getAllSubscribers: async () => {
    return newsletterRepository.findAll();
  },

  deleteSubscriber: async (id: string) => {
    return newsletterRepository.delete(id);
  },

  broadcast: async (data: z.infer<typeof BroadcastNewsletterSchema>) => {
    const subscribers = await newsletterRepository.findAll();
    const emails = subscribers.map(s => s.email);
    
    if (emails.length === 0) throw new Error("No subscribers found to broadcast to.");

    return sendNewsletterBroadcast(emails, data.subject, data.message);
  }
};
