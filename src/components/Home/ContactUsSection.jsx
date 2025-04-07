import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

const ContactUsSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <ContactContainer>
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeader>
          <Headline>
            Contact <HighlightText>Us</HighlightText>
          </Headline>
          <Subheadline>
            We're here to help. Reach out to us with any questions or inquiries.
          </Subheadline>
        </SectionHeader>

        <ContactContent>
          <ContactInfoColumn>
            <ContactInfoCard>
              <IconWrapper $color="var(--color-primary)">
                <Mail size={40} color="var(--color-primary)" />
              </IconWrapper>
              <ContactInfo>
                <ContactTitle>Email</ContactTitle>
                <ContactDetail>helpecybercafe@gmail.com</ContactDetail>
              </ContactInfo>
            </ContactInfoCard>

            <ContactInfoCard>
              <IconWrapper $color="var(--color-secondary)">
                <Phone size={40} color="var(--color-secondary)" />
              </IconWrapper>
              <ContactInfo>
                <ContactTitle>Phone</ContactTitle>
                <ContactDetail>+91 7091361502</ContactDetail>
              </ContactInfo>
            </ContactInfoCard>

            <ContactInfoCard>
              <IconWrapper $color="var(--color-accent)">
                <MapPin size={40} color="var(--color-accent)" />
              </IconWrapper>
              <ContactInfo>
                <ContactTitle>Address</ContactTitle>
                <ContactDetail>Gaya, Bihar</ContactDetail>
              </ContactInfo>
            </ContactInfoCard>
          </ContactInfoColumn>

          <ContactFormColumn>
            {!submitted ? (
              <ContactForm onSubmit={handleSubmit}>
                <FormTitle>Send us a Message</FormTitle>
                <InputGroup>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>

                <SubmitButton type="submit">
                  Send Message <Send size={20} />
                </SubmitButton>
              </ContactForm>
            ) : (
              <SuccessMessage
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle size={64} color="var(--color-success)" />
                <SuccessTitle>Message Sent Successfully!</SuccessTitle>
                <SuccessText>
                  Thank you for reaching out. We'll get back to you soon.
                </SuccessText>
              </SuccessMessage>
            )}
          </ContactFormColumn>
        </ContactContent>
      </ContentWrapper>
    </ContactContainer>
  );
};

const ContactContainer = styled.section`
  background-color: var(--color-bg-secondary);
  padding: 6rem 2rem;
`;

const ContentWrapper = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  max-width: 700px;
`;

const Headline = styled.h2`
  font-size: 3rem;
  color: var(--color-text);
  margin-bottom: 1rem;
`;

const HighlightText = styled.span`
  color: var(--color-primary);
`;

const Subheadline = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.25rem;
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContactInfoCard = styled.div`
  background-color: var(--color-surface);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 2px solid var(--color-border-light);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const IconWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => `${props.$color}14`};
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContactTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
`;

const ContactDetail = styled.p`
  color: var(--color-text-secondary);
`;

const ContactFormColumn = styled.div`
  background-color: var(--color-surface);
  border-radius: 16px;
  padding: 3rem;
  border: 2px solid var(--color-border-light);
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormTitle = styled.h3`
  font-size: 1.75rem;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  font-size: 1rem;
  min-height: 150px;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const SuccessMessage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
`;

const SuccessTitle = styled.h3`
  font-size: 1.75rem;
  color: var(--color-text);
`;

const SuccessText = styled.p`
  color: var(--color-text-secondary);
`;

export default ContactUsSection;
