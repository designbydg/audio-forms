import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/layout/Footer";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto prose prose-slate space-y-8">
        <h1>Terms of Use for Audioforms Platform Operated by Go Ikigai LLC</h1>
        <p className="lead mb-8">Effective Date: February 6, 2025</p>

        <h2 className="mt-12">Terms of Use</h2>
        <p className="mb-8">Welcome to the Audioforms ("Platform"), operated by Go Ikigai LLC ("Company," "we," "us," or "our") registered in the State of Illinois. By accessing or using our Platform, you agree to comply with and be bound by these Terms of Use ("Terms"). If you do not agree with these Terms, please do not use our Platform.</p>

        <h3 className="mt-12">1. Acceptance of Terms</h3>
        <p className="mb-8">By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.</p>

        <h3 className="mt-12">2. Use of the Platform</h3>
        <p className="mb-8">You agree to use the Platform only for lawful purposes and in accordance with these Terms. You shall not:</p>
        <ul className="mb-8 space-y-2">
          <li>Use the Platform in any way that violates applicable laws or regulations.</li>
          <li>Submit false, misleading, or fraudulent information.</li>
          <li>Interfere with or disrupt the integrity or performance of the Platform.</li>
        </ul>

        <h3 className="mt-12">3. User Content</h3>
        <p className="mb-8">By submitting audio feedback, surveys, or other content ("User Content"), you grant Go Ikigai LLC a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute such content for the purpose of operating and improving the Platform.</p>

        <h3 className="mt-12">4. Intellectual Property</h3>
        <p className="mb-8">All content, features, and functionality on the Platform, including text, graphics, logos, and software, are the property of Go Ikigai LLC and protected by intellectual property laws.</p>

        <h3 className="mt-12">5. Termination</h3>
        <p className="mb-8">We reserve the right to cease operations at any time. Continued use of the Service following such changes constitutes your acceptance of the changes.</p>

        <h3 className="mt-12">6. Disclaimers and Limitation of Liability</h3>
        <p className="mb-8">The Platform is provided "as is" without warranties of any kind. Go Ikigai LLC shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform.</p>

        <h3 className="mt-12">7. Governing Law</h3>
        <p className="mb-8">These Terms shall be governed by and construed in accordance with the laws of Illinois, USA, without regard to its conflict of law principles.</p>

        <h3 className="mt-12">8. Changes to Terms</h3>
        <p className="mb-8">We may update these Terms from time to time. Your continued use of the Platform after such changes constitutes your acceptance of the new Terms.</p>

        <p className="mt-12 font-bold mb-8">By using our Platform, you acknowledge that you have read and understood these Terms of Use and agree to be bound by them.</p>

        <h2 className="mt-12">1. Acceptance of Terms</h2>
        <p className="mb-8">
          By accessing or using AudioForms, a product of A LLC, you agree to be bound by these Terms of Use and all applicable laws and regulations.
        </p>

        <h2 className="mt-12">2. Service Description</h2>
        <p className="mb-8">
          AudioForms is a platform that enables users to create, distribute, and analyze audio-based surveys and feedback forms.
        </p>

        <h2 className="mt-12">3. Account Terms</h2>
        <ul className="mb-8 space-y-2">
          <li>You must provide accurate account information</li>
          <li>You are responsible for maintaining account security</li>
          <li>You may not use the service for unauthorized purposes</li>
          <li>Free accounts are limited to 10 responses per survey</li>
        </ul>

        <h2 className="mt-12">4. User Content</h2>
        <p className="mb-8">
          When using AudioForms, you retain ownership of your content but grant us license to:
        </p>
        <ul className="mb-8 space-y-2">
          <li>Store and process audio recordings</li>
          <li>Generate and store transcriptions</li>
          <li>Create analytics and insights</li>
        </ul>

        <h2 className="mt-12">5. Acceptable Use</h2>
        <p className="mb-8">You agree not to:</p>
        <ul className="mb-8 space-y-2">
          <li>Violate any laws or regulations</li>
          <li>Infringe on intellectual property rights</li>
          <li>Upload malicious content</li>
          <li>Attempt to breach system security</li>
        </ul>

        <h2 className="mt-12">6. Service Limitations</h2>
        <ul className="mb-8 space-y-2">
          <li>Free accounts have response limits</li>
          <li>Audio recordings have maximum duration limits</li>
          <li>We may impose usage restrictions to prevent abuse</li>
        </ul>

        <h2 className="mt-12">7. Termination</h2>
        <p className="mb-8">
          We reserve the right to terminate or suspend accounts that violate these terms or for any other reason at our discretion.
        </p>

        <h2 className="mt-12">8. Contact</h2>
        <p className="mb-8">
          For questions about these terms, please contact us at hello[at]getaudioforms[dot]com
        </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfUse;
