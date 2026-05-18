import { sendEmail } from "@/lib/resend";

interface WelcomeEmailData {
  name: string;
  email: string;
}

/**
 * Sends a welcome email to newly registered users.
 * Wrapped in try/catch — must not crash registration.
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  try {
    const html = `
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; font-family: 'Inter', sans-serif;">
        <div style="background: linear-gradient(135deg, #FF4D8D, #FF80AC); padding: 48px 32px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">Welcome to Pretty Chi Hairs ✨</h1>
          <p style="margin: 12px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Premium Hair & Beauty</p>
        </div>
        
        <div style="padding: 40px 32px;">
          <p style="font-size: 18px; color: #111827; margin: 0 0 8px; font-weight: 700;">Hi ${data.name || "there"} 👋</p>
          <p style="font-size: 15px; color: #6b7280; margin: 0 0 32px; line-height: 1.6;">
            Welcome to the Pretty Chi Hairs family! We're thrilled to have you. Your account has been successfully created and you're all set to explore our premium collection.
          </p>
          
          <div style="background: #fdf2f8; border-radius: 16px; padding: 24px; margin-bottom: 32px; border: 1px solid #fce7f3;">
            <h3 style="margin: 0 0 16px; font-size: 14px; color: #be185d; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">What you can do</h3>
            <div style="margin-bottom: 12px; display: flex; align-items: start; gap: 12px;">
              <span style="font-size: 18px;">🛍️</span>
              <div>
                <p style="margin: 0; font-size: 14px; color: #111827; font-weight: 600;">Shop Premium Products</p>
                <p style="margin: 2px 0 0; font-size: 13px; color: #6b7280;">Browse our curated collection of hair extensions, wigs, and accessories.</p>
              </div>
            </div>
            <div style="margin-bottom: 12px; display: flex; align-items: start; gap: 12px;">
              <span style="font-size: 18px;">💇‍♀️</span>
              <div>
                <p style="margin: 0; font-size: 14px; color: #111827; font-weight: 600;">Book Services</p>
                <p style="margin: 2px 0 0; font-size: 13px; color: #6b7280;">Schedule appointments for installations, styling, and more.</p>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
              <span style="font-size: 18px;">📦</span>
              <div>
                <p style="margin: 0; font-size: 14px; color: #111827; font-weight: 600;">Track Orders</p>
                <p style="margin: 2px 0 0; font-size: 13px; color: #6b7280;">Stay updated on your orders from checkout to delivery.</p>
              </div>
            </div>
          </div>

          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/products" 
             style="display: block; text-align: center; background: linear-gradient(135deg, #FF4D8D, #FF80AC); color: #ffffff; padding: 16px 24px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(255, 77, 141, 0.3);">
            Start Shopping →
          </a>

          <p style="font-size: 13px; color: #9ca3af; text-align: center; margin: 32px 0 0;">
            Questions? Reply to this email — we'd love to help.<br/>
            Pretty Chi Hairs — Premium Hair & Beauty
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: data.email,
      subject: "Welcome to Pretty Chi Hairs ✨ — Your account is ready!",
      html,
    });

    console.log(`[Email] Welcome email sent to ${data.email}`);
  } catch (error) {
    console.error(`[Email] Failed to send welcome email to ${data.email}:`, error);
  }
}
