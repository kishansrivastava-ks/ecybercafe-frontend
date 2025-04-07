import Animated from "../components/common/Animated";
import styled from "styled-components";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.8;
  font-size: 1.1rem;
`;

const Heading = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: center;
`;

const Highlight = styled.span`
  color: #3b82f6;
  font-weight: bold;
`;

function About() {
  return (
    <Animated>
      <Container>
        <Heading>About Us</Heading>
        <p>
          Welcome to <Highlight>eCyber Cafe</Highlight> — your trusted digital
          platform for accessing essential cyber cafe services online. We
          understand the value of your time, and our mission is to simplify your
          access to crucial government and non-government services from the
          comfort of your home.
        </p>
        <p>
          At <Highlight>eCyber Cafe</Highlight>, users can browse a variety of
          available services such as PAN card applications, document processing,
          and more. Applying for a service is quick and secure through our
          user-friendly interface.
        </p>
        <p>
          Once applied, users can track the real-time status of their
          applications via their personal dashboard. We believe in transparency
          and provide continuous updates along with admin comments for better
          clarity.
        </p>
        <p>
          Upon completion, users receive a softcopy of their processed documents
          directly on their dashboard, making the entire process seamless and
          paperless.
        </p>
        <p>
          Whether you're applying for official documents or seeking online
          assistance, <Highlight>eCyber Cafe</Highlight> ensures a secure,
          smooth, and efficient experience — bridging the gap between users and
          essential digital services.
        </p>
      </Container>
    </Animated>
  );
}

export default About;
