
import React from 'react';
import Button from './Button';
import { ICONS } from '../constants';

interface PrivacyPolicyPageProps {
  onExit: () => void;
}

const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-primary mb-3">{title}</h2>
        <div className="space-y-3 text-brand-text-secondary leading-relaxed">
            {children}
        </div>
    </div>
);

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onExit }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button onClick={onExit} variant="ghost">
          {ICONS.ARROW_LEFT}
          <span>Back to Home</span>
        </Button>
      </div>
      <div className="bg-brand-surface p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-center mb-6">Privacy Policy</h1>

        <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-300 p-4 rounded-lg text-sm mb-8">
            <h3 className="font-bold text-lg mb-2">Disclaimer</h3>
            <p>This is a template and not legal advice. You should consult with a qualified legal professional to create a Privacy Policy that is tailored to your specific business needs and complies with privacy laws like GDPR, CCPA, etc.</p>
        </div>
        
        <LegalSection title="Introduction">
            <p>Welcome to AMA Fi. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
        </LegalSection>

        <LegalSection title="Information We Collect">
            <p>We collect personal information that you voluntarily provide to us when you register on the Service, express an interest in obtaining information about us or our products and services, when you participate in activities on the Service or otherwise when you contact us.</p>
            <p>The personal information that we collect depends on the context of your interactions with us and the Service, the choices you make and the products and features you use. The personal information we collect may include: name, email address, password, user-generated content, and payment information.</p>
        </LegalSection>

        <LegalSection title="How We Use Your Information">
            <p>We use personal information collected via our Service for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
        </LegalSection>

        <LegalSection title="Data Sharing">
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may share your data with third-party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work.</p>
        </LegalSection>

        <LegalSection title="Data Security">
            <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
        </LegalSection>

        <LegalSection title="Your Rights">
            <p>In some regions (like the European Economic Area), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.</p>
        </LegalSection>
        
        <LegalSection title="Contact Us">
             <p>If you have questions or comments about this policy, you may contact us at [Your Contact Email].</p>
        </LegalSection>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
