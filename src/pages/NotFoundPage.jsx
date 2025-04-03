import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Goes back to the previous page
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ErrorWrapper>
        <ErrorTitle>404</ErrorTitle>
        <ErrorMessage>Page Not Found</ErrorMessage>
        <ErrorDescription>
          Oops! The page you are looking for does not exist or has been moved.
        </ErrorDescription>

        <ActionContainer>
          <BackButton onClick={handleGoBack}>
            <ArrowLeft size={20} />
            Go Back
          </BackButton>

          <HomeLink to="/dashboard">
            <Home size={20} />
            Go to Dashboard
          </HomeLink>
        </ActionContainer>
      </ErrorWrapper>
    </Container>
  );
};

const Container = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f6f9;
`;

const ErrorWrapper = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
`;

const ErrorTitle = styled.h1`
  font-size: 6rem;
  color: #e74c3c;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const ErrorDescription = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #2ecc71;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #27ae60;
  }
`;

export default NotFoundPage;
