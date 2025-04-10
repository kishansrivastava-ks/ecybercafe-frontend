import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Clipboard,
  Briefcase,
  Check,
  Globe,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileSignature,
  Building,
  Fingerprint,
  Truck,
  FileSearch,
  UserCheck,
  Vote,
  Share2,
  Heart,
  Printer,
  FileSpreadsheet,
  Image,
  Layers,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../ui/UIComponents";

const ServicesOverview = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const services = [
    {
      icon: CreditCard,
      title: "Aadhar Card",
      description: "Apply for or update your Aadhar identity card with ease.",
      color: "var(--color-primary)",
    },
    {
      icon: Vote,
      title: "Voter Card",
      description: "Register for or modify your voter identification card.",
      color: "var(--color-secondary)",
    },
    {
      icon: Share2,
      title: "E Share Card",
      description:
        "Digital share certificates and electronic registration solutions.",
      color: "var(--color-accent)",
    },
    {
      icon: Heart,
      title: "Ayushman Card",
      description: "Health insurance card for affordable medical care access.",
      color: "var(--color-primary)",
    },
    {
      icon: FileText,
      title: "Pan Card",
      description: "Apply or update your Permanent Account Number easily.",
      color: "var(--color-secondary)",
    },
    {
      icon: Printer,
      title: "Pan Card PVC Print",
      description: "Get your PAN card printed on durable PVC material.",
      color: "var(--color-accent)",
    },
    {
      icon: FileSpreadsheet,
      title: "Computer Paper A4 Size",
      description: "High-quality A4 size paper for all your printing needs.",
      color: "var(--color-primary)",
    },
    {
      icon: Image,
      title: "4X6 Photo Paper",
      description: "Professional photo paper for high-quality prints.",
      color: "var(--color-secondary)",
    },
    {
      icon: Layers,
      title: "Laminate A4 Pouch",
      description: "A4 size lamination pouches for document protection.",
      color: "var(--color-accent)",
    },
    {
      icon: BadgeCheck,
      title: "Laminated Pouch Aadhar Card",
      description:
        "Protect your Aadhar card with our special lamination service.",
      color: "var(--color-primary)",
    },
  ];

  // Function to get the visible services (3 at a time)
  const getVisibleServices = () => {
    const visibleServices = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % services.length;
      visibleServices.push({
        ...services[index],
        index,
      });
    }
    return visibleServices;
  };

  // Navigation functions
  const goNext = () => {
    resetTimer();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
  };

  const goPrev = () => {
    resetTimer();
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + services.length) % services.length
    );
  };

  // Reset the auto-slide timer when manually navigating
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(goNext, 3000);
    }
  };

  // Set up auto-sliding
  useEffect(() => {
    timerRef.current = setInterval(goNext, 3000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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

        <ServiceCarouselContainer>
          <AnimatePresence mode="popLayout">
            {getVisibleServices().map((service, idx) => (
              <ServiceCard
                key={`${service.title}-${service.index}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
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
                  <BuyNowButton
                    onClick={() =>
                      navigate(
                        `/services/${service.title
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      )
                    }
                  >
                    Buy Now <ArrowRight size={16} />
                  </BuyNowButton>
                </ServiceContent>
              </ServiceCard>
            ))}
          </AnimatePresence>
        </ServiceCarouselContainer>

        <NavigationButtons>
          <NavButton onClick={goPrev}>
            <ChevronLeft size={24} />
          </NavButton>
          <NavButton onClick={goNext}>
            <ChevronRight size={24} />
          </NavButton>
        </NavigationButtons>

        <ViewAllButtonWrapper>
          <Button variant="primary" onClick={() => navigate("/services")}>
            View All Services
            <Globe size={20} />
          </Button>
        </ViewAllButtonWrapper>

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

const ServiceCarouselContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  margin-bottom: 2rem;
  position: relative;
  min-height: 350px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
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
  position: relative;
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
  flex: 1;
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
  flex: 1;
`;

const BuyNowButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  background-color: var(--color-primary);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NavButton = styled.div`
  background-color: var(--color-surface);
  border: 2px solid var(--color-border-light);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-primary);
  color: black;

  &:hover {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
`;

const ViewAllButtonWrapper = styled.div`
  margin-bottom: 4rem;
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
