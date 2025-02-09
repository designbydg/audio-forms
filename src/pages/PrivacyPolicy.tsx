import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto prose prose-slate space-y-8">
          <h1>Privacy Policy for Audioforms Platform Operated by Go Ikigai LLC.</h1>

          <h2 className="mt-12">Privacy Policy</h2>
          <p className="lead mb-8">Effective Date: February 6, 2025</p>

          <h3 className="mt-12">1. Introduction</h3>
          <p className="mb-8">Welcome to Audioforms, a platform operated by Go Ikigai LLC. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we handle your information when you use our audio survey platform.</p>

          <h3 className="mt-12">2. Information We Collect</h3>
          <h4 className="mt-8">2.1 Survey Responses</h4>
          <p className="mb-4">When you participate in audio surveys, we collect:</p>
          <ul className="mb-8 space-y-2">
            <li>Audio recordings of your responses</li>
            <li>Transcriptions of audio content</li>
            <li>Survey completion data</li>
          </ul>

          <h4 className="mt-8">2.2 Personal Information</h4>
          <p className="mb-8">We may collect personal information such as your name, email address, demographic details, and other identifiers.</p>

          <h4 className="mt-8">2.3 Usage Data</h4>
          <p className="mb-8">We collect information about how you interact with the Platform, including IP address, browser type, and device information.</p>

          <h3 className="mt-12">3. How We Use Your Information</h3>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="mb-8 space-y-2">
            <li>Conduct and analyze surveys</li>
            <li>Improve the functionality and user experience of the Platform</li>
            <li>Communicate with you regarding updates or responses to your feedback</li>
          </ul>

          <h3 className="mt-12">4. Sharing of Information</h3>
          <p className="mb-4">We do not sell or rent your personal information. We may share your information with:</p>
          <ul className="mb-8 space-y-2">
            <li>Service providers who assist in operating the Platform</li>
            <li>Legal authorities if required by law</li>
          </ul>

          <h3 className="mt-12">5. Data Security</h3>
          <p className="mb-8">We implement security measures to protect your information. However, no system is 100% secure, and we cannot guarantee absolute security.</p>

          <h3 className="mt-12">6. Your Rights</h3>
          <p className="mb-8">Depending on your jurisdiction, you may have rights to access, correct, or delete your personal information. Contact us at hello[at]getaudioforms[dot]com to exercise these rights.</p>

          <h3 className="mt-12">7. Cookies and Tracking Technologies</h3>
          <p className="mb-8">We may use cookies and similar technologies to enhance your experience. You can control cookies through your browser settings.</p>

          <h3 className="mt-12">8. Children's Privacy</h3>
          <p className="mb-8">Our Platform is not intended for children under the age of 13. We do not knowingly collect personal information from children.</p>

          <h3 className="mt-12">9. International Data Transfers</h3>
          <p className="mb-8">Your information may be transferred to and processed in countries outside of your country of residence.</p>

          <h3 className="mt-12">10. Changes to This Privacy Policy</h3>
          <p className="mb-8">We may update this Privacy Policy periodically. We encourage you to review it regularly.</p>

          <h3 className="mt-12">11. Contact Us</h3>
          <p className="mb-8">If you have any questions about this Privacy Policy, please contact us at hello[at]getaudioforms[dot]com.</p>

          <p className="mt-12 font-bold">By using our Platform, you acknowledge that you have read and understood the Privacy Policy and agree to be bound by them.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
