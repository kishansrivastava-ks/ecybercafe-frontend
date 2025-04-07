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

function Refunds() {
  return (
    <Animated>
      <Container>
        <Heading>Refund Policy</Heading>
        <p>Last updated: April 7, 2025</p>

        <SectionTitle>1. General Policy</SectionTitle>
        <p>
          At <strong>eCyber Cafe</strong>, we aim to deliver digital services
          efficiently and transparently. Due to the nature of our services,
          which often involve processing and document preparation, all payments
          made on our platform are generally considered non-refundable.
        </p>

        <SectionTitle>2. Non-Refundable Services</SectionTitle>
        <p>
          Once a user applies for a service and the processing has begun, the
          payment cannot be refunded. This includes, but is not limited to:
        </p>
        <ul>
          <li>PAN card application processing</li>
          <li>Digital document requests</li>
          <li>Form submissions and government-related services</li>
        </ul>

        <SectionTitle>3. Exceptions</SectionTitle>
        <p>Refunds may be granted under specific conditions, such as:</p>
        <ul>
          <li>
            Payment was deducted, but the service was not initiated due to a
            technical error
          </li>
          <li>Duplicate payments made by the user</li>
        </ul>
        <p>
          In such cases, users must contact our support team within 7 days of
          the transaction. All refund requests will be reviewed and processed at
          our sole discretion.
        </p>

        <SectionTitle>4. Processing Time</SectionTitle>
        <p>
          Approved refunds will be processed within 7–10 business days to the
          original payment method. We will notify you via email once the refund
          has been initiated.
        </p>

        <SectionTitle>5. Contact Us</SectionTitle>
        <p>
          For any queries or to request a refund under eligible circumstances,
          please contact our support team via the <strong>Contact</strong> page.
          Please include your transaction ID, service applied for, and the
          reason for the refund request.
        </p>
      </Container>
    </Animated>
  );
}

export default Refunds;
