import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Globe, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../ui/UIComponents";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/services");
  };

  return (
    <HeroContainer>
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <TextContent>
          <Headline>
            Simplify Your <HighlightText>Digital Services</HighlightText>
          </Headline>

          <Subheadline>
            Your one-stop platform for seamless document applications, digital
            services, and government paperwork.
          </Subheadline>

          <ButtonGroup>
            <Button variant="primary" onClick={() => navigate("/login")}>
              Login
              <ArrowRight size={20} />
            </Button>
            <Button variant="outline" onClick={() => navigate("/signup")}>
              SignUp
            </Button>
          </ButtonGroup>

          <FeatureHighlights>
            <Feature>
              <Shield color="var(--color-success)" size={24} />
              Secure & Verified
            </Feature>
            <Feature>
              <Globe color="var(--color-primary)" size={24} />
              100% Online Process
            </Feature>
          </FeatureHighlights>
        </TextContent>

        <IllustrationWrapper
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ServiceIcons>
            <ServiceIcon whileHover={{ scale: 1.1 }}>
              <FileText size={40} color="var(--color-primary)" />
              <IconLabel>PAN Card</IconLabel>
            </ServiceIcon>
            <ServiceIcon whileHover={{ scale: 1.1 }}>
              <Globe size={40} color="var(--color-secondary)" />
              <IconLabel>Digital Services</IconLabel>
            </ServiceIcon>
          </ServiceIcons>
        </IllustrationWrapper>
      </ContentWrapper>
    </HeroContainer>
  );
};

const HeroContainer = styled.section`
  background-color: var(--color-bg);
  min-height: 90vh;
  display: flex;
  align-items: center;
  padding: 2rem;
`;

const ContentWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TextContent = styled.div`
  flex: 1;
  max-width: 600px;
`;

const Headline = styled.h1`
  font-size: 3.5rem;
  color: var(--color-text);
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HighlightText = styled.span`
  color: var(--color-primary);
`;

const Subheadline = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const FeatureHighlights = styled.div`
  display: flex;
  gap: 1.5rem;
  color: var(--color-text-muted);

  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
`;

const IllustrationWrapper = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ServiceIcons = styled.div`
  display: flex;
  gap: 2rem;
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 119, 255, 0.1),
    0 5px 15px rgba(0, 119, 255, 0.05);
`;

const ServiceIcon = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
`;

const IconLabel = styled.span`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

export default HeroSection;
