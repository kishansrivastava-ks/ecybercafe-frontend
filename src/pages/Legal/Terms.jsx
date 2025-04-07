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

function Terms() {
  return (
    <Animated>
      <Container>
        <Heading>Terms of Service</Heading>

        <p>Last updated: April 7, 2025</p>

        <SectionTitle>1. Introduction</SectionTitle>
        <p>
          Welcome to <strong>eCyber Cafe</strong>. By accessing and using our
          platform, you agree to abide by the following terms and conditions.
          Please read them carefully before using our services.
        </p>

        <SectionTitle>2. Use of Services</SectionTitle>
        <p>
          Our platform allows users to view, apply, and receive various online
          services such as document processing, PAN card applications, and more.
          By registering and applying for services, you confirm that all
          information you provide is accurate and up to date.
        </p>

        <SectionTitle>3. Account Responsibility</SectionTitle>
        <p>
          Users are responsible for maintaining the confidentiality of their
          login credentials. Any activity conducted under your account is your
          responsibility. Notify us immediately of any unauthorized use.
        </p>

        <SectionTitle>4. Payment & Refunds</SectionTitle>
        <p>
          All payments made for services are non-refundable unless otherwise
          stated. Each service may have specific terms regarding processing time
          and deliverables, which users are expected to review before making
          payments.
        </p>

        <SectionTitle>5. Document Delivery</SectionTitle>
        <p>
          Once a service is completed, users will receive a soft copy of the
          processed document via their dashboard. It is the user's
          responsibility to download and securely store the document for future
          use.
        </p>

        <SectionTitle>6. Prohibited Activities</SectionTitle>
        <p>
          Users may not misuse the platform for any unlawful or unauthorized
          purposes. Fraudulent activity, submission of fake documents, or misuse
          of services may result in account suspension or legal action.
        </p>

        <SectionTitle>7. Modification of Terms</SectionTitle>
        <p>
          eCyber Cafe reserves the right to update or modify these terms at any
          time. Continued use of the platform following any changes indicates
          your acceptance of the new terms.
        </p>

        <SectionTitle>8. Contact</SectionTitle>
        <p>
          If you have any questions about these Terms of Service, please contact
          us through the details provided on our <strong>Contact</strong> page.
        </p>
      </Container>
    </Animated>
  );
}

export default Terms;
