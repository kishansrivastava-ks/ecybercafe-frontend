import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FileText,
  ArrowRight,
  Briefcase,
  FileSignature,
  CreditCard,
  Vote,
  Share2,
  Heart,
  Printer,
  FileSpreadsheet,
  Image,
  Layers,
  BadgeCheck,
} from "lucide-react";

import useAuth from "../contexts/useAuth";
import { Button, Spinner, Toast } from "../ui/UIComponents";

const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingService, setLoadingService] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  const services = [
    {
      icon: CreditCard,
      title: "Aadhar Card",
      description: "Apply for or update your Aadhar identity card with ease.",
      color: "#6366F1", // var(--color-primary)
      path: "aadhar-card",
    },
    {
      icon: Vote,
      title: "Voter Card",
      description: "Register for or modify your voter identification card.",
      color: "#EC4899", // var(--color-secondary)
      path: "voter-card",
    },
    {
      icon: Share2,
      title: "E Share Card",
      description:
        "Digital share certificates and electronic registration solutions.",
      color: "#10B981", // var(--color-accent)
      path: "e-share-card",
    },
    {
      icon: Heart,
      title: "Ayushman Card",
      description: "Health insurance card for affordable medical care access.",
      color: "#6366F1", // var(--color-primary)
      path: "ayushman-card",
    },
    {
      icon: FileText,
      title: "Pan Card",
      description: "Apply or update your Permanent Account Number easily.",
      color: "#EC4899", // var(--color-secondary)
      path: "pan-card",
    },
    {
      icon: Printer,
      title: "Pan Card PVC Print",
      description: "Get your PAN card printed on durable PVC material.",
      color: "#10B981", // var(--color-accent)
      path: "pan-card-pvc",
    },
    {
      icon: FileSpreadsheet,
      title: "Computer Paper A4 Size",
      description: "High-quality A4 size paper for all your printing needs.",
      color: "#6366F1", // var(--color-primary)
      path: "a4-paper",
    },
    {
      icon: Image,
      title: "4X6 Photo Paper",
      description: "Professional photo paper for high-quality prints.",
      color: "#EC4899", // var(--color-secondary)
      path: "photo-paper",
    },
    {
      icon: Layers,
      title: "Laminate A4 Pouch",
      description: "A4 size lamination pouches for document protection.",
      color: "#10B981", // var(--color-accent)
      path: "laminate-pouch",
    },
    {
      icon: BadgeCheck,
      title: "Laminated Pouch Aadhar Card",
      description:
        "Protect your Aadhar card with our special lamination service.",
      color: "#6366F1", // var(--color-primary)
      path: "laminated-aadhar",
    },
  ];

  const handleBuy = async (servicePath) => {
    setIsLoading(true);
    setLoadingService(servicePath);
    try {
      if (!user) {
        navigate("/login");
      } else {
        // Simulated async navigation to show loading state
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate(`/dashboard/services/${servicePath}`);
      }
    } catch (error) {
      setToast({
        type: "error",
        message: "Navigation failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setLoadingService(null);
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Available Services</Title>

      <ServiceGrid>
        {services.map((service) => (
          <ServiceCardWrapper
            key={service.path}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ServiceCard $color={service.color}>
              <IconWrapper $color={service.color}>
                <service.icon size={48} color={service.color} />
              </IconWrapper>

              <ServiceContent>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>

                <Button
                  variant="primary"
                  onClick={() => handleBuy(service.path)}
                  disabled={isLoading}
                  style={{ backgroundColor: service.color }}
                >
                  {isLoading && loadingService === service.path ? (
                    <Spinner size={20} />
                  ) : (
                    <>
                      Buy Now
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>
              </ServiceContent>
            </ServiceCard>
          </ServiceCardWrapper>
        ))}
      </ServiceGrid>

      {toast && <Toast type={toast.type}>{toast.message}</Toast>}
    </Container>
  );
};

export default Services;

// Styled Components with Modern Design
const Container = styled(motion.div)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  background-color: var(--color-bg);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--color-text);
  margin-bottom: 2rem;
  font-weight: 700;
  text-align: center;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
`;

const ServiceCardWrapper = styled(motion.div)`
  width: 100%;
  perspective: 1000px;
`;

const ServiceCard = styled.div`
  background: var(--color-surface);
  border-radius: 16px;
  box-shadow: 0 8px 20px
    ${(props) => `rgba(${getColorValues(props.$color)}, 0.1)`};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.75rem;
  gap: 1.25rem;
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px
        ${(props) => `rgba(${getColorValues(props.$color)}, 0.15)`},
      0 8px 20px ${(props) => `rgba(${getColorValues(props.$color)}, 0.1)`};
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background-color: ${(props) => props.$color};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => `rgba(${getColorValues(props.$color)}, 0.1)`};
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 0.25rem;
`;

const ServiceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: center;
  width: 100%;
`;

const ServiceTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: 0.25rem;
`;

const ServiceDescription = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
  flex-grow: 1;
  font-size: 0.95rem;
`;

// Helper function to convert hex color to RGB values
function getColorValues(hex) {
  // Remove the # if it exists
  hex = hex.replace("#", "");

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}
