/* eslint-disable no-unused-vars */
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
      color: "#6366F1",
      path: "aadhar-card",
      price: 50,
    },
    {
      icon: Vote,
      title: "Voter Card",
      description: "Register for or modify your voter identification card.",
      color: "#EC4899",
      path: "voter-card",
      price: 40,
    },
    {
      icon: Share2,
      title: "E Share Card",
      description:
        "Digital share certificates and electronic registration solutions.",
      color: "#10B981",
      path: "e-share-card",
      price: 100,
    },
    {
      icon: Heart,
      title: "Ayushman Card",
      description: "Health insurance card for affordable medical care access.",
      color: "#6366F1",
      path: "ayushman-card",
      price: 30,
    },
    {
      icon: FileText,
      title: "Pan Card",
      description: "Apply or update your Permanent Account Number easily.",
      color: "#EC4899",
      path: "pan-card",
      price: 50,
    },
    {
      icon: Printer,
      title: "Pan Card PVC Print",
      description: "Get your PAN card printed on durable PVC material.",
      color: "#10B981",
      path: "pan-card-pvc",
      price: 60,
    },
    {
      icon: FileSpreadsheet,
      title: "Computer Paper A4 Size",
      description: "High-quality A4 size paper for all your printing needs.",
      color: "#6366F1",
      path: "a4-paper",
      price: 15,
    },
    {
      icon: Image,
      title: "4X6 Photo Paper",
      description: "Professional photo paper for high-quality prints.",
      color: "#EC4899",
      path: "photo-paper",
      price: 20,
    },
    {
      icon: Layers,
      title: "Laminate A4 Pouch",
      description: "A4 size lamination pouches for document protection.",
      color: "#10B981",
      path: "laminate-pouch",
      price: 10,
    },
    {
      icon: BadgeCheck,
      title: "Laminated Pouch Aadhar Card",
      description:
        "Protect your Aadhar card with our special lamination service.",
      color: "#6366F1",
      path: "laminated-aadhar",
      price: 25,
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
                <service.icon size={56} color="#fff" />
              </IconWrapper>

              <ServiceContent>
                <ServiceTitle>{service.title}</ServiceTitle>
                <Price>₹{service.price}</Price>
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
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.3s ease;
  min-height: 320px;
`;

const IconWrapper = styled.div`
  background-color: ${(props) => props.$color};
  border-radius: 50%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;

const ServiceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: center;
  width: 100%;
`;

const ServiceTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const ServiceDescription = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1rem;
`;

const Price = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

// Helper function to convert hex color to RGB values
// function getColorValues(hex) {
//   // Remove the # if it exists
//   hex = hex.replace("#", "");

//   // Parse the hex values
//   const r = parseInt(hex.substring(0, 2), 16);
//   const g = parseInt(hex.substring(2, 4), 16);
//   const b = parseInt(hex.substring(4, 6), 16);

//   return `${r}, ${g}, ${b}`;
// }
