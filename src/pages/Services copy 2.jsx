/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";

import useAuth from "../contexts/useAuth";
import { Button, Spinner, Toast } from "../ui/UIComponents";

const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const handleApply = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        navigate("/login");
      } else {
        // Simulated async navigation to show loading state
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/apply/pan-card");
      }
    } catch (error) {
      setToast({
        type: "error",
        message: "Navigation failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Available Services</Title>

      <ServiceCardWrapper
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <ServiceCard>
          <IconWrapper>
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
              onClick={handleApply}
              disabled={isLoading}
            >
              {isLoading ? (
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

const ServiceCardWrapper = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  perspective: 1000px;
`;

const ServiceCard = styled.div`
  background: var(--color-surface);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 119, 255, 0.1),
    0 5px 15px rgba(0, 119, 255, 0.05);
  display: flex;
  align-items: center;
  padding: 2rem;
  gap: 1.5rem;
  border: 2px solid var(--color-border-light);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 119, 255, 0.15),
      0 8px 20px rgba(0, 119, 255, 0.1);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 119, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
`;

const ServiceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
`;
