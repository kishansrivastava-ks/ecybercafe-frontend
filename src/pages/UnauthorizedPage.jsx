import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const UnauthorizedPage = () => {
  return (
    <Container>
      <ErrorWrapper>
        <ErrorTitle>403</ErrorTitle>
        <ErrorMessage>Access Denied</ErrorMessage>
        <ErrorDescription>
          You do not have permission to access this page.
        </ErrorDescription>
        <BackLink to="/dashboard">Return to Dashboard</BackLink>
      </ErrorWrapper>
    </Container>
  );
};

const Container = styled.div`
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

const BackLink = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

export default UnauthorizedPage;
