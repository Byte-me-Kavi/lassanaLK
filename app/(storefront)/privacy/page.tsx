import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Lassana LK collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pb-20 pt-12">
      <div className="container-main max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-heading font-semibold text-brand-purple mb-8">
          Privacy Policy
        </h1>
        
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-border max-w-none text-muted-foreground space-y-6">
          <p className="text-sm font-medium">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Lassana LK ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
          </p>
          <p>
            When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it.
          </p>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">2. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Personal Info Provided by You:</strong> We collect names; phone numbers; email addresses; mailing addresses; contact preferences; billing addresses; and other similar information.</li>
            <li><strong>Order Data:</strong> For Cash on Delivery (COD) orders, we collect the necessary address and contact information to fulfill the delivery.</li>
            <li><strong>Customization Details:</strong> Information you provide to customize your jewelry, such as names, dates, or specific design requests.</li>
          </ul>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">3. How We Use Your Information</h2>
          <p>
            We use personal information collected via our Website for a variety of business purposes described below:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>To fulfill and manage your orders:</strong> We may use your information to fulfill and manage your orders, payments, returns, and exchanges made through the Website.</li>
            <li><strong>To deliver services to the user:</strong> We may use your information to provide you with the requested service, specifically communicating with delivery partners for Cash on Delivery.</li>
            <li><strong>To respond to user inquiries/offer support to users:</strong> We may use your information to respond to your inquiries and solve any potential issues you might have with the use of our Services.</li>
            <li><strong>To send administrative information to you:</strong> We may use your personal information to send you product, service, and new feature information and/or information about changes to our terms, conditions, and policies.</li>
          </ul>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">4. Will Your Information Be Shared With Anyone?</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
          </p>
          <p className="mt-4">
            Specifically, we may need to process your data or share your personal information in the following situations:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Vendors, Consultants, and Other Third-Party Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. The most common example is sharing your address and phone number with our courier partners for Cash on Delivery fulfillment.</li>
          </ul>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">5. How Long Do We Keep Your Information?</h2>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
          </p>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">6. How Do We Keep Your Information Safe?</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">7. Contact Us</h2>
          <p>
            If you have questions or comments about this notice, you may email us or contact us via our official WhatsApp channels listed on the website.
          </p>
        </div>
      </div>
    </div>
  );
}
