import styled from "styled-components";
import Animated from "../components/common/Animated";
import ContactUsSection from "../components/Home/ContactUsSection";

function Contact() {
  return (
    <Animated>
      <Container>
        <ContactUsSection />
      </Container>
    </Animated>
  );
}

const Container = styled.div`
  /* border: 2px solid red; */
  min-width: 100vw;
`;
export default Contact;
