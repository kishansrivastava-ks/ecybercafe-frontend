import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FileText,
  Clipboard,
  Briefcase,
  Check,
  Globe,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../ui/UIComponents";

const ServicesOverview = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: FileText,
      title: "PAN Card Services",
      description:
        "Apply, update, or retrieve your Permanent Account Number with ease.",
      color: "var(--color-primary)",
    },
    {
      icon: Clipboard,
      title: "Document Verification",
      description:
        "Comprehensive document authentication and verification solutions.",
      color: "var(--color-secondary)",
    },
    {
      icon: Briefcase,
      title: "Professional Registrations",
      description:
        "Streamlined registration processes for professionals and businesses.",
      color: "var(--color-accent)",
    },
  ];

  return (
    <ServicesContainer>
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeader>
          <Headline>
            Our Digital <HighlightText>Services</HighlightText>
          </Headline>
          <Subheadline>
            Simplifying complex bureaucratic processes through digital
            innovation
          </Subheadline>
        </SectionHeader>

        <ServiceGrid>
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0,119,255,0.2)",
              }}
            >
              <IconWrapper $color={service.color}>
                <service.icon size={40} color={service.color} />
              </IconWrapper>
              <ServiceContent>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                <LearnMoreLink
                  onClick={() =>
                    navigate(
                      `/services/${service.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`
                    )
                  }
                >
                  Learn More <ArrowRight size={16} />
                </LearnMoreLink>
              </ServiceContent>
            </ServiceCard>
          ))}
        </ServiceGrid>

        <CallToActionSection>
          <CTAContent>
            <CTATitle>
              <Check color="var(--color-success)" size={32} />
              Trusted by Thousands of Users
            </CTATitle>
            <CTADescription>
              Experience hassle-free digital services with our secure and
              efficient platform
            </CTADescription>
          </CTAContent>
          <Button variant="primary" onClick={() => navigate("/services")}>
            Explore All Services
            <Globe size={20} />
          </Button>
        </CallToActionSection>
      </ContentWrapper>
    </ServicesContainer>
  );
};

const ServicesContainer = styled.section`
  background-color: var(--color-bg-secondary);
  padding: 6rem 2rem;
`;

const ContentWrapper = styled(motion.div)`
  /* max-width: 1200px; */
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

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  margin-bottom: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled(motion.div)`
  background-color: var(--color-surface);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid var(--color-border-light);
`;

const IconWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => `${props.$color}14`};
  margin-bottom: 1.5rem;
`;

const ServiceContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: 1rem;
`;

const ServiceDescription = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const LearnMoreLink = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-primary-dark);
  }
`;

const CallToActionSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-surface);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 119, 255, 0.1);
`;

const CTAContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CTATitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: 600;
`;

const CTADescription = styled.p`
  color: var(--color-text-secondary);
`;

export default ServicesOverview;
