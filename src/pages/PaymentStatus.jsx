/**
 * PaymentStatus.js
 *
 * Displays the final payment outcome to the user after being redirected
 * from the backend callback.
 */
import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const StatusWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
  height: 70vh;
`;

const IconWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ status }) => {
    if (status === "success") return "#22c55e";
    if (status === "failure") return "#ef4444";
    return "#f97316";
  }};
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
`;

const StyledLink = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const txnid = searchParams.get("txnid");
  const message = searchParams.get("message");

  let statusContent = {
    icon: <AlertCircle size={80} color="#f97316" />,
    title: "Something Went Wrong",
    message: message
      ? message.replace(/_/g, " ")
      : "An unknown error occurred.",
  };

  if (status === "success") {
    statusContent = {
      icon: <CheckCircle size={80} color="#22c55e" />,
      title: "Payment Successful!",
      message: `Your ITR application has been submitted. Transaction ID: ${txnid}`,
    };
  } else if (status === "failure") {
    statusContent = {
      icon: <XCircle size={80} color="#ef4444" />,
      title: "Payment Failed",
      message: "Your payment could not be processed. Please try again.",
    };
  }

  return (
    <StatusWrapper
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <IconWrapper>{statusContent.icon}</IconWrapper>
      <Title status={status}>{statusContent.title}</Title>
      <Message>{statusContent.message}</Message>
      <StyledLink to="/dashboard/services">Go to My Services</StyledLink>
    </StatusWrapper>
  );
};

export default PaymentStatus;
