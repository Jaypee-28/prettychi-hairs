import { sendEmail } from "@/lib/resend";

export const sendNewsletterBroadcast = async (
  subscribers: string[],
  subject: string,
  message: string
) => {
  let successCount = 0;
  let failCount = 0;

  // Send sequentially to avoid hitting rate limits too fast in sandbox, 
  // but could be Promise.all for production if limits allow.
  for (const email of subscribers) {
    try {
      await sendEmail({
        to: email,
        subject: subject,
        html: `<div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${message.replace(/\n/g, "<br/>")}
          <br/><br/>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">You are receiving this because you subscribed to Pretty Chi Hairs's Beauty Circle.</p>
        </div>`,
      });
      successCount++;
    } catch (error) {
      console.error(`[Newsletter] Failed to send to ${email}`, error);
      failCount++;
    }
  }

  return { successCount, failCount };
};
