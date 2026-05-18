import { sendEmail } from "@/lib/resend";

export const sendContactEmail = async (data: { 
  name: string; 
  email: string; 
  phone?: string; 
  subject: string; 
  message: string 
}) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "hello@prettychihairs.com";
    
    return await sendEmail({
      to: adminEmail,
      subject: `New Contact: ${data.subject} from ${data.name}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #FF4D8D; margin-bottom: 20px;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${data.message}</p>
        </div>
      `
    });
  } catch (error) {
    console.error("[Email] Failed to send contact email:", error);
  }
};
