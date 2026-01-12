import React from "react";
import styled from "styled-components";
import { AlertOctagon, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceMaintenance = ({ serviceName }) => {
  const navigate = useNavigate();
  return (
    <Container>
      <IconWrapper>
        <AlertOctagon size={64} />
      </IconWrapper>
      <Title>Service Temporarily Unavailable</Title>
      <Message>
        The <strong>{serviceName}</strong> service is currently disabled for
        maintenance or administrative reasons. Please check back later.
      </Message>
      <BackButton onClick={() => navigate("/dashboard/services")}>
        <ArrowLeft size={18} /> Back to Dashboard
      </BackButton>
    </Container>
  );
};

export default ServiceMaintenance;

// Styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  max-width: 600px;
  margin: 2rem auto;
`;
const IconWrapper = styled.div`
  color: #ef4444;
  margin-bottom: 1.5rem;
`;
const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
`;
const Message = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;
const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;
