import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ServicesByType = () => {
  const navigate = useNavigate();

  const serviceCards = [
    {
      title: "Pan Card",
      description: "Apply and manage your PAN services seamlessly.",
      route: "/admin-dashboard/services/pan",
    },
    {
      title: "Voter ID Card",
      description: "Apply and manage your Voter services seamlessly.",
      route: "/admin-dashboard/services/voter-card",
    },
    {
      title: "RTPS",
      description: "Access RTPS services and details here.",
      route: "/admin-dashboard/services/rtps",
    },
    {
      title: "Labour Card",
      description: "Labour Card related services and requests.",
      route: "/admin-dashboard/services/labour-card",
    },
  ];

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Title>Select a Service Type</Title>
      <CardGrid>
        {serviceCards.map((card, index) => (
          <ServiceCard
            key={index}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(card.route)}
          >
            <CardTitle>{card.title}</CardTitle>
            {/* <CardDescription>{card.description}</CardDescription> */}
          </ServiceCard>
        ))}
      </CardGrid>
    </Container>
  );
};

export default ServicesByType;

// Styled Components
const Container = styled(motion.div)`
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--color-bg);
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: var(--color-text);
  margin-bottom: 2.5rem;
  font-weight: 600;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const ServiceCard = styled(motion.div)`
  background-color: var(--color-surface);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--color-border-light);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* min-height: 200px; */
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--color-primary);
  font-weight: 600;
`;

const CardDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.5;
`;
