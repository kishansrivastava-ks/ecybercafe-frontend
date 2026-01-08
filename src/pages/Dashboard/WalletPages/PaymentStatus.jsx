import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CheckCircle, XCircle, Loader, ArrowLeft } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";

const PaymentStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // checking, SUCCESS, FAILED
  const [newBalance, setNewBalance] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Call backend to verify status with gateway
        const res = await axiosInstance.post("/wallet/check-status", {
          order_id: orderId,
        });
        setStatus(res.data.status);
        if (res.data.status === "SUCCESS") {
          setNewBalance(res.data.balance);
        }
      } catch (error) {
        console.error("Verification failed", error);
        setStatus("FAILED");
      }
    };

    if (orderId) {
      verifyPayment();
    }
  }, [orderId]);

  return (
    <Container>
      <Card>
        {status === "checking" && (
          <Content>
            <SpinnerWrapper>
              <Loader className="spin" size={60} color="var(--color-primary)" />
            </SpinnerWrapper>
            <Title>Verifying Payment...</Title>
            <Message>
              Please wait while we confirm your transaction with the bank.
            </Message>
          </Content>
        )}

        {status === "SUCCESS" && (
          <Content>
            <IconWrapper color="var(--color-success)">
              <CheckCircle size={80} />
            </IconWrapper>
            <Title>Payment Successful!</Title>
            <Message>Your wallet has been recharged successfully.</Message>
            {newBalance && (
              <BalanceUpdate>
                Updated Balance: <strong>₹ {newBalance}</strong>
              </BalanceUpdate>
            )}
            <ActionButton onClick={() => navigate("/dashboard/wallet")}>
              Go to Wallet
            </ActionButton>
          </Content>
        )}

        {status === "FAILED" && (
          <Content>
            <IconWrapper color="var(--color-error)">
              <XCircle size={80} />
            </IconWrapper>
            <Title>Payment Failed</Title>
            <Message>
              We could not process your payment. If money was deducted, it will
              be refunded within 3-5 days.
            </Message>
            <ActionButton onClick={() => navigate("/wallet")}>
              Try Again
            </ActionButton>
          </Content>
        )}
      </Card>
    </Container>
  );
};

export default PaymentStatus;

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  background-color: var(--color-bg);
`;

const Card = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
`;

const Message = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

const IconWrapper = styled.div`
  color: ${(props) => props.color};
  margin-bottom: 1rem;
`;

const SpinnerWrapper = styled.div`
  margin-bottom: 1rem;
  .spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const BalanceUpdate = styled.div`
  background: var(--color-surface-secondary);
  padding: 1rem 2rem;
  border-radius: 10px;
  margin: 1rem 0;
  color: var(--color-primary);
  font-size: 1.1rem;
`;

const ActionButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: var(--color-primary-dark);
  }
`;
