import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Pretty Chi Hairs",
  description: "Privacy Policy for Pretty Chi Hairs.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="bg-gray-50/50 pt-32 pb-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 font-medium">
            Last updated: October 2023
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-16 md:py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 text-gray-600 font-medium leading-relaxed">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">1. Introduction</h2>
            <p>
              Welcome to Pretty Chi Hairs. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">2. Data Collection</h2>
            <p>
              We may collect, use, store, and transfer different kinds of personal data about you, which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>Identity Data:</strong> First name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
              <li><strong>Financial Data:</strong> Payment card details (processed securely via Paystack).</li>
              <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products and services you have purchased from us.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">3. Usage of Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., fulfilling an order or booking).</li>
              <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal or regulatory obligation.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">4. Cookies</h2>
            <p>
              Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. For detailed information on the cookies we use, please refer to our <a href="/cookies" className="text-[#FF4D8D] font-bold hover:underline">Cookies Policy</a>.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">5. Third-Party Services (Paystack)</h2>
            <p>
              We use Paystack for payment processing. Paystack collects identifying information about the devices that connect to its services and uses this information to operate, improve, and secure its services, including for fraud detection. You can learn more about Paystack and read its privacy policy at paystack.com/privacy.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">6. Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">7. User Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data. You have the right to request access to your personal data, request correction of your personal data, request erasure of your personal data, and object to the processing of your personal data.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, including any requests to exercise your legal rights, please contact us using the details set out below:
            </p>
            <p className="font-bold text-gray-900">
              Email: hello@prettychihairs.com<br />
              Address: 123 Luxury Ave, NY
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
