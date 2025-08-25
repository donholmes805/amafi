
import React from 'react';
import Button from './Button';
import { ICONS } from '../constants';

interface TermsOfServicePageProps {
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

const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onExit }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button onClick={onExit} variant="ghost">
          {ICONS.ARROW_LEFT}
          <span>Back to Home</span>
        </Button>
      </div>
      <div className="bg-brand-surface p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-center mb-6">Terms of Service</h1>
        
        <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-300 p-4 rounded-lg text-sm mb-8">
            <h3 className="font-bold text-lg mb-2">Disclaimer</h3>
            <p>This is a template and not legal advice. You should consult with a qualified legal professional to create a Terms of Service agreement that is tailored to your specific business needs and complies with all applicable laws.</p>
        </div>

        <LegalSection title="1. Acceptance of Terms">
            <p>By accessing or using AMA Fi ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, do not use the Service.</p>
        </LegalSection>

        <LegalSection title="2. User Conduct">
            <p>You agree not to use the Service to post or transmit any material which is knowingly false and/or defamatory, inaccurate, abusive, vulgar, hateful, harassing, obscene, profane, sexually oriented, threatening, invasive of a person's privacy, or otherwise violative of any law.</p>
        </LegalSection>

        <LegalSection title="3. Content Ownership">
            <p>You retain copyright over any content you submit to the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content in connection with the Service.</p>
        </LegalSection>

        <LegalSection title="4. Termination">
            <p>We may terminate or suspend your access to the Service at any time, without prior notice or liability, for any reason, including if you breach the Terms.</p>
        </LegalSection>
        
        <LegalSection title="5. Disclaimer of Warranties">
            <p>The Service is provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </LegalSection>

        <LegalSection title="6. Limitation of Liability">
            <p>In no event shall AMA Fi or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AMA Fi's website.</p>
        </LegalSection>

        <LegalSection title="7. Governing Law">
            <p>These Terms shall be governed by and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.</p>
        </LegalSection>

      </div>
    </div>
  );
};

export default TermsOfServicePage;
