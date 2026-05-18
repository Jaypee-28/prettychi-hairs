import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies Policy | Pretty Chi Hairs",
  description: "Information about how Pretty Chi Hairs uses cookies.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="bg-gray-50/50 pt-32 pb-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Cookies Policy
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
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">1. What Cookies Are</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">2. How Pretty Chi Hairs Uses Cookies</h2>
            <p>
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>Essential Cookies:</strong> These are strictly necessary for the operation of our website, such as managing your shopping cart and facilitating the checkout process.</li>
              <li><strong>Analytical/Performance Cookies:</strong> They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works.</li>
              <li><strong>Functionality Cookies:</strong> These are used to recognize you when you return to our website, allowing us to personalize our content for you and remember your preferences.</li>
              <li><strong>Targeting/Marketing Cookies:</strong> These cookies record your visit to our website, the pages you have visited, and the links you have followed. We may use this information to make our website and the advertising displayed on it more relevant to your interests.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">3. User Choices and Opting Out</h2>
            <p>
              Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit www.aboutcookies.org or www.allaboutcookies.org.
            </p>
            <p>
              Please note that if you choose to disable essential cookies, certain features of our website (such as adding items to your cart or logging into your account) may not function correctly.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">4. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at:
            </p>
            <p className="font-bold text-gray-900">
              Email: hello@prettychihairs.com
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
