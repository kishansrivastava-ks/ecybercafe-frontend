import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Users, Target, Award, Stars, ArrowRight } from "lucide-react";

const AboutUsSection = () => {
  const coreValues = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "Empowering citizens through seamless digital transformation and innovative technological solutions.",
      color: "var(--color-primary)",
    },
    {
      icon: Users,
      title: "Our Team",
      description:
        "A diverse group of experts dedicated to simplifying complex bureaucratic processes.",
      color: "var(--color-secondary)",
    },
    {
      icon: Award,
      title: "Our Commitment",
      description:
        "Delivering top-quality, secure, and user-friendly digital services with integrity.",
      color: "var(--color-accent)",
    },
  ];

  return (
    <AboutContainer>
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeader>
          <Headline>
            About <HighlightText>Us</HighlightText>
          </Headline>
          <Subheadline>
            Pioneering digital solutions that transform how citizens interact
            with government services
          </Subheadline>
        </SectionHeader>

        <ValuesGrid>
          {coreValues.map((value, index) => (
            <ValueCard
              key={value.title}
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
              <IconWrapper $color={value.color}>
                <value.icon size={40} color={value.color} />
              </IconWrapper>
              <ValueContent>
                <ValueTitle>{value.title}</ValueTitle>
                <ValueDescription>{value.description}</ValueDescription>
              </ValueContent>
            </ValueCard>
          ))}
        </ValuesGrid>

        <TestimonialSection>
          <CTAContent>
            <CTATitle>
              <Stars color="var(--color-success)" size={32} />
              Trusted by Government and Citizens
            </CTATitle>
            <CTADescription>
              With years of experience and a proven track record of digital
              innovation
            </CTADescription>
          </CTAContent>
          <LearnMoreButton>
            Our Story <ArrowRight size={20} />
          </LearnMoreButton>
        </TestimonialSection>
      </ContentWrapper>
    </AboutContainer>
  );
};

const AboutContainer = styled.section`
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

const ValuesGrid = styled.div`
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

const ValueCard = styled(motion.div)`
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

const ValueContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ValueTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: 1rem;
`;

const ValueDescription = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const TestimonialSection = styled.div`
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

const LearnMoreButton = styled.button`
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

export default AboutUsSection;
