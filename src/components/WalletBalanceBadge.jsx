import React from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

// Fetch just the balance
const fetchBalance = async () => {
  const res = await axiosInstance.get("/wallet/history");
  return res.data.balance;
};

const WalletBalanceBadge = () => {
  const navigate = useNavigate();

  const { data: balance, isLoading } = useQuery({
    queryKey: ["walletBalance"], // Unique key shared with the main Wallet page
    queryFn: fetchBalance,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  return (
    <Badge onClick={() => navigate("/dashboard/wallet")} title="Go to Wallet">
      <IconWrapper>
        <Wallet size={18} />
      </IconWrapper>
      <Amount>
        {isLoading ? "..." : `₹ ${balance?.toFixed(2) || "0.00"}`}
      </Amount>
    </Badge>
  );
};

export default WalletBalanceBadge;

// --- Styled Components ---

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  padding: 0.4rem 1rem;
  border-radius: 50px; /* Pill shape */
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;

const IconWrapper = styled.div`
  color: var(--color-primary);
  display: flex;
  align-items: center;
`;

const Amount = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--color-text);
  white-space: nowrap;
`;
