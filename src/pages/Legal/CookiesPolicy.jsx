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

function CookiesPolicy() {
  return (
    <Animated>
      <Container>
        <Heading>Cookies Policy</Heading>
        <p>Last updated: April 7, 2025</p>

        <SectionTitle>1. What Are Cookies?</SectionTitle>
        <p>
          Cookies are small text files that are stored on your device when you
          visit a website. They help improve your browsing experience by
          remembering your preferences and login status.
        </p>

        <SectionTitle>2. How We Use Cookies</SectionTitle>
        <p>
          <strong>eCyber Cafe</strong> uses cookies to:
        </p>
        <ul>
          <li>Maintain user sessions and authentication</li>
          <li>Store user preferences such as theme or language</li>
          <li>Analyze traffic and usage patterns to improve the website</li>
          <li>Help ensure the security and integrity of our platform</li>
        </ul>

        <SectionTitle>3. Types of Cookies We Use</SectionTitle>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> Required for basic functionality
            like login and account access.
          </li>
          <li>
            <strong>Performance Cookies:</strong> Help us understand how users
            interact with the site.
          </li>
          <li>
            <strong>Preference Cookies:</strong> Remember your settings and
            preferences.
          </li>
        </ul>

        <SectionTitle>4. Managing Cookies</SectionTitle>
        <p>
          You can manage or disable cookies through your browser settings.
          However, disabling essential cookies may impact your ability to use
          certain features on our website.
        </p>

        <SectionTitle>5. Third-Party Cookies</SectionTitle>
        <p>
          We may use third-party services (e.g., analytics tools) that set their
          own cookies to help us analyze site usage. These cookies are governed
          by their respective privacy policies.
        </p>

        <SectionTitle>6. Updates to This Policy</SectionTitle>
        <p>
          We may update this Cookies Policy from time to time. Any changes will
          be posted on this page with the updated date above.
        </p>

        <SectionTitle>7. Contact</SectionTitle>
        <p>
          If you have any questions regarding our use of cookies, please reach
          out to us through the <strong>Contact</strong> page.
        </p>
      </Container>
    </Animated>
  );
}

export default CookiesPolicy;
