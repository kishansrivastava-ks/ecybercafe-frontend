import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import useAuth from "../contexts/useAuth";

const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleApply = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/apply/pan-card");
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Available Services</Title>
      <ServiceCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <h2>PAN Card Application</h2>
        <p>Apply for a new PAN card or update details.</p>
        <ApplyButton onClick={handleApply}>Apply Now</ApplyButton>
      </ServiceCard>
    </Container>
  );
};

export default Services;

const Container = styled(motion.div)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
`;

const ServiceCard = styled(motion.div)`
  background: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
  transition: all 0.3s ease-in-out;
`;

const ApplyButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
`;
