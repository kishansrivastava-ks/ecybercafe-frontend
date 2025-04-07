import Animated from "../../components/common/Animated";
import styled from "styled-components";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.7;
  font-size: 1rem;
`;

const Heading = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
`;

function PrivacyPolicy() {
  return (
    <Animated>
      <Container>
        <Heading>Privacy Policy</Heading>
        <p>Last updated: April 7, 2025</p>

        <SectionTitle>1. Introduction</SectionTitle>
        <p>
          At <strong>eCyber Cafe</strong>, your privacy is important to us. This
          Privacy Policy outlines how we collect, use, and safeguard your
          personal information when you use our services.
        </p>

        <SectionTitle>2. Information We Collect</SectionTitle>
        <p>We may collect the following types of information:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> Name, email address, phone
            number, government ID numbers, and address details when applying for
            services.
          </li>
          <li>
            <strong>Account Information:</strong> Login credentials,
            authentication data, and user preferences.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you interact with
            our website and services.
          </li>
        </ul>

        <SectionTitle>3. How We Use Your Information</SectionTitle>
        <p>Your data is used for the following purposes:</p>
        <ul>
          <li>To process and fulfill service applications</li>
          <li>To provide status updates and document delivery</li>
          <li>To improve user experience and platform functionality</li>
          <li>To comply with legal and regulatory requirements</li>
        </ul>

        <SectionTitle>4. Data Security</SectionTitle>
        <p>
          We implement appropriate technical and organizational measures to
          protect your data from unauthorized access, alteration, or disclosure.
          However, no method of online transmission is 100% secure.
        </p>

        <SectionTitle>5. Sharing of Information</SectionTitle>
        <p>
          We do not sell or rent your personal information. Information may be
          shared with trusted third-party partners only for the purpose of
          completing service requests (e.g., document verification agencies) and
          always in compliance with privacy laws.
        </p>

        <SectionTitle>6. Your Rights</SectionTitle>
        <p>
          You have the right to access, correct, or delete your personal data.
          You may also request to restrict certain processing or object to how
          your data is used.
        </p>

        <SectionTitle>7. Cookies</SectionTitle>
        <p>
          Our website may use cookies and similar tracking technologies to
          enhance user experience and analyze website usage. You can choose to
          disable cookies in your browser settings.
        </p>

        <SectionTitle>8. Changes to This Policy</SectionTitle>
        <p>
          We may update this Privacy Policy from time to time. All changes will
          be posted on this page with the updated date.
        </p>

        <SectionTitle>9. Contact Us</SectionTitle>
        <p>
          If you have any questions or concerns regarding this Privacy Policy,
          please contact us via the details on our <strong>Contact</strong>{" "}
          page.
        </p>
      </Container>
    </Animated>
  );
}

export default PrivacyPolicy;
