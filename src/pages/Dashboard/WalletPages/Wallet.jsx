import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import { successToast, errorToast } from "../../../utils/ToastNotfications";

// Fetch Wallet Data (Balance + History)
const fetchWalletData = async () => {
  const res = await axiosInstance.get("/wallet/history");
  return res.data;
};

const Wallet = () => {
  const [amount, setAmount] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["walletData"],
    queryFn: fetchWalletData,
    refetchInterval: 30000, // Refresh every 30s to keep balance updated
  });

  // Recharge Mutation
  const rechargeMutation = useMutation({
    mutationFn: async (rechargeAmount) => {
      const res = await axiosInstance.post("/wallet/recharge", {
        amount: rechargeAmount,
      });
      return res.data;
    },
    onSuccess: (data) => {
      // The backend returns a payment_url. We must redirect the user there.
      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    },
    onError: (error) => {
      errorToast(
        error.response?.data?.message || "Failed to initiate recharge"
      );
    },
  });

  const handleRecharge = (e) => {
    e.preventDefault();
    if (!amount || amount < 1) {
      errorToast("Please enter a valid amount");
      return;
    }
    rechargeMutation.mutate(amount);
  };

  if (isLoading) return <LoadingContainer>Loading Wallet...</LoadingContainer>;
  if (isError)
    return <ErrorContainer>Error loading wallet data</ErrorContainer>;

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Header>
        <Title>My Wallet</Title>
        <Subtitle>Manage your credits and view transaction history</Subtitle>
      </Header>

      <TopSection>
        {/* Balance Card */}
        <BalanceCard>
          <BalanceHeader>
            <WalletIcon size={24} color="white" />
            <span>Available Balance</span>
          </BalanceHeader>
          <BalanceAmount>₹ {data?.balance?.toFixed(2) || "0.00"}</BalanceAmount>
          <BalanceNote>Credits available for services</BalanceNote>
        </BalanceCard>

        {/* Recharge Form */}
        <RechargeCard>
          <h3>Add Money to Wallet</h3>
          <Form onSubmit={handleRecharge}>
            <InputWrapper>
              <CurrencySymbol>₹</CurrencySymbol>
              <Input
                type="number"
                placeholder="Enter Amount (e.g. 1000)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
            </InputWrapper>
            <RechargeButton
              type="submit"
              disabled={rechargeMutation.isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {rechargeMutation.isLoading ? "Processing..." : "Proceed to Pay"}
              <ArrowUpRight size={18} />
            </RechargeButton>
          </Form>
        </RechargeCard>
      </TopSection>

      {/* Transaction History */}
      <HistorySection>
        <SectionTitle>
          <History size={20} /> Transaction History
        </SectionTitle>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.transactions?.length > 0 ? (
                data.transactions.map((txn) => (
                  <tr key={txn._id}>
                    <td>
                      <DateWrapper>
                        <span className="date">
                          {new Date(txn.createdAt).toLocaleDateString()}
                        </span>
                        <span className="time">
                          {new Date(txn.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </DateWrapper>
                    </td>
                    <td>
                      <Description>
                        {txn.orderId && <OrderId>#{txn.orderId}</OrderId>}
                        {txn.description}
                      </Description>
                    </td>
                    <td>
                      <CategoryBadge type={txn.category}>
                        {txn.category.replace("_", " ")}
                      </CategoryBadge>
                    </td>
                    <td>
                      <Amount type={txn.type}>
                        {txn.type === "CREDIT" ? "+" : "-"} ₹{txn.amount}
                      </Amount>
                    </td>
                    <td>
                      <StatusBadge status={txn.status}>
                        {txn.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableContainer>
      </HistorySection>
    </Container>
  );
};

export default Wallet;

// --- Styled Components ---

const Container = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-text);
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BalanceCard = styled.div`
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-secondary)
  );
  padding: 2rem;
  border-radius: 16px;
  color: white;
  box-shadow: 0 10px 20px rgba(var(--color-primary-rgb), 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BalanceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
`;

const BalanceAmount = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const BalanceNote = styled.div`
  font-size: 0.85rem;
  opacity: 0.7;
`;

const RechargeCard = styled.div`
  background: var(--color-surface);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--color-border-light);

  h3 {
    margin-bottom: 1.5rem;
    color: var(--color-text);
  }
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const CurrencySymbol = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const RechargeButton = styled(motion.button)`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const HistorySection = styled.div``;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
`;

const TableContainer = styled.div`
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;

  th {
    text-align: left;
    padding: 1rem;
    background: var(--color-surface-secondary);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    text-transform: uppercase;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid var(--color-border-light);
    color: var(--color-text);
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .date {
    font-weight: 500;
  }
  .time {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OrderId = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-family: monospace;
`;

const Amount = styled.div`
  font-weight: 700;
  color: ${(props) =>
    props.type === "CREDIT" ? "var(--color-success)" : "var(--color-error)"};
`;

const CategoryBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => (props.type === "RECHARGE" ? "#e3f2fd" : "#f3e5f5")};
  color: ${(props) => (props.type === "RECHARGE" ? "#1565c0" : "#7b1fa2")};
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${(props) => {
    switch (props.status) {
      case "SUCCESS":
        return "background: #e8f5e9; color: #2e7d32;";
      case "PENDING":
        return "background: #fff3e0; color: #ef6c00;";
      case "FAILED":
        return "background: #ffebee; color: #c62828;";
      default:
        return "background: #eee; color: #666;";
    }
  }}
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;

const ErrorContainer = styled.div`
  text-align: center;
  color: var(--color-error);
  padding: 2rem;
`;
