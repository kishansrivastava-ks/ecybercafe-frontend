/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Briefcase, FileSignature } from "lucide-react";

import useAuth from "../contexts/useAuth";
import { Button, Spinner, Toast } from "../ui/UIComponents";

const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingService, setLoadingService] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  const handleApply = async (servicePath) => {
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
        {/* PAN Card Service */}
        <ServiceCardWrapper
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <ServiceCard $color="#0077FF">
            <IconWrapper $color="#0077FF">
              <FileText size={48} color="#0077FF" />
            </IconWrapper>

            <ServiceContent>
              <ServiceTitle>PAN Card Application</ServiceTitle>
              <ServiceDescription>
                Apply for a new PAN card or update your existing details quickly
                and securely.
              </ServiceDescription>

              <Button
                variant="primary"
                onClick={() => handleApply("pan-card")}
                disabled={isLoading}
                style={{ backgroundColor: "#0077FF" }}
              >
                {isLoading && loadingService === "pan-card" ? (
                  <Spinner size={20} />
                ) : (
                  <>
                    Apply Now
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </ServiceContent>
          </ServiceCard>
        </ServiceCardWrapper>

        {/* Job Card Service */}
        <ServiceCardWrapper
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <ServiceCard $color="#FF5722">
            <IconWrapper $color="#FF5722">
              <Briefcase size={48} color="#FF5722" />
            </IconWrapper>

            <ServiceContent>
              <ServiceTitle>Job Card Application</ServiceTitle>
              <ServiceDescription>
                Apply for employment programs and register for job opportunities
                in your area.
              </ServiceDescription>

              <Button
                variant="primary"
                onClick={() => handleApply("job-card")}
                disabled={isLoading}
                style={{ backgroundColor: "#FF5722" }}
              >
                {isLoading && loadingService === "job-card" ? (
                  <Spinner size={20} />
                ) : (
                  <>
                    Apply Now
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </ServiceContent>
          </ServiceCard>
        </ServiceCardWrapper>

        {/* RTPS Service */}
        <ServiceCardWrapper
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <ServiceCard $color="#4CAF50">
            <IconWrapper $color="#4CAF50">
              <FileSignature size={48} color="#4CAF50" />
            </IconWrapper>

            <ServiceContent>
              <ServiceTitle>RTPS Application</ServiceTitle>
              <ServiceDescription>
                Right to Public Service - Apply for government services with
                guaranteed timely processing.
              </ServiceDescription>

              <Button
                variant="primary"
                onClick={() => handleApply("rtps")}
                disabled={isLoading}
                style={{ backgroundColor: "#4CAF50" }}
              >
                {isLoading && loadingService === "rtps" ? (
                  <Spinner size={20} />
                ) : (
                  <>
                    Apply Now
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </ServiceContent>
          </ServiceCard>
        </ServiceCardWrapper>
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const ServiceCardWrapper = styled(motion.div)`
  width: 100%;
  perspective: 1000px;
`;

const ServiceCard = styled.div`
  background: var(--color-surface);
  /* border-radius: 16px; */
  /* box-shadow: 0 10px 25px
      ${(props) => `rgba(${getColorValues(props.$color)}, 0.1)`},
    0 5px 15px ${(props) => `rgba(${getColorValues(props.$color)}, 0.05)`}; */

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 1.5rem;
  /* border: 2px solid var(--color-border-light); */
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px
        ${(props) => `rgba(${getColorValues(props.$color)}, 0.15)`},
      0 8px 20px ${(props) => `rgba(${getColorValues(props.$color)}, 0.1)`};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => `rgba(${getColorValues(props.$color)}, 0.1)`};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ServiceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  width: 100%;
`;

const ServiceTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
`;

const ServiceDescription = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
  flex-grow: 1;
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
