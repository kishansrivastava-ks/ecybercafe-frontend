import React from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X, Calendar, Wallet, FileText } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const fetchRetailerDetails = async (id) => {
  const res = await axiosInstance.get(`/admin/stats/retailer/${id}`);
  return res.data;
};

const RetailerDetailModal = ({ retailerId, onClose }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["retailerDetail", retailerId],
    queryFn: () => fetchRetailerDetails(retailerId),
  });

  if (!retailerId) return null;

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Modal
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>

        {isLoading ? (
          <Loading>Loading details...</Loading>
        ) : (
          <Content>
            {/* Header */}
            <Header>
              <Title>{data.user.name}</Title>
              <SubInfo>
                {data.user.email} • {data.user.jila}
              </SubInfo>
              <BalanceBadge>
                Current Balance: ₹{(data.user.walletBalance || 0).toFixed(2)}
              </BalanceBadge>
            </Header>

            <ScrollArea>
              {/* Service Breakdown */}
              <Section>
                <SectionHeader>
                  <FileText size={18} /> Service Usage Summary
                </SectionHeader>
                <Grid>
                  {data.serviceStats.length > 0 ? (
                    data.serviceStats.map((stat) => (
                      <ServiceCard key={stat._id}>
                        <ServiceName>{stat._id}</ServiceName>
                        <StatRow>
                          <span>Applications:</span>
                          <strong>{stat.count}</strong>
                        </StatRow>
                        <StatRow>
                          <span>Total Revenue:</span>
                          <strong>₹ {stat.totalSpent}</strong>
                        </StatRow>
                      </ServiceCard>
                    ))
                  ) : (
                    <EmptyMsg>No services used yet.</EmptyMsg>
                  )}
                </Grid>
              </Section>

              {/* Transaction History */}
              <Section>
                <SectionHeader>
                  <Wallet size={18} /> Recent Wallet History
                </SectionHeader>
                <HistoryTable>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.walletHistory.map((txn) => (
                      <tr key={txn._id}>
                        <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                        <td>{txn.description}</td>
                        <td>
                          <Badge type={txn.type}>{txn.type}</Badge>
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                            color: txn.type === "CREDIT" ? "green" : "red",
                          }}
                        >
                          {txn.type === "CREDIT" ? "+" : "-"} ₹{txn.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </HistoryTable>
              </Section>
            </ScrollArea>
          </Content>
        )}
      </Modal>
    </Overlay>
  );
};

export default RetailerDetailModal;

// --- Styled Components ---
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;
const Modal = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const Header = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #eee;
  background: #fafafa;
`;
const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;
const SubInfo = styled.p`
  color: #666;
  margin: 0.5rem 0 1rem;
`;
const BalanceBadge = styled.span`
  background: #e3f2fd;
  color: #1565c0;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
`;
const ScrollArea = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
`;
const Section = styled.div`
  margin-bottom: 2rem;
`;
const SectionHeader = styled.h3`
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 0.5rem;
  width: max-content;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;
const ServiceCard = styled.div`
  border: 1px solid #eee;
  padding: 1rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
`;
const ServiceName = styled.h4`
  margin: 0 0 0.8rem;
  color: var(--color-primary);
`;
const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
`;
const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    text-align: left;
    padding: 0.8rem;
    background: #f8f8f8;
    font-size: 0.85rem;
  }
  td {
    padding: 0.8rem;
    border-bottom: 1px solid #eee;
    font-size: 0.9rem;
  }
`;
const Badge = styled.span`
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  background: ${(p) => (p.type === "CREDIT" ? "#e8f5e9" : "#ffebee")};
  color: ${(p) => (p.type === "CREDIT" ? "#2e7d32" : "#c62828")};
`;
const Loading = styled.div`
  padding: 3rem;
  text-align: center;
  color: #666;
`;
const EmptyMsg = styled.div`
  color: #999;
  font-style: italic;
`;
