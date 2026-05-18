import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }: { to: string | string[], subject: string, html: string }) => {
  try {
    const data = await resend.emails.send({
      from: "Pretty Chi Hairs <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default resend;
