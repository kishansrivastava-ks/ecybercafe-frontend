import React, { useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  Users,
  DollarSign,
  Search,
  MapPin,
  Eye,
  ArrowRight,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import RetailerDetailModal from "./RetailerDetailModal"; // We will create this next
import { AnimatePresence } from "framer-motion";

// Fetch Stats functions
const fetchOverview = async () => {
  const res = await axiosInstance.get("/admin/stats/overview");
  return res.data;
};

const fetchRetailers = async () => {
  const res = await axiosInstance.get("/admin/stats/retailers");
  return res.data;
};

const AdminWalletDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRetailerId, setSelectedRetailerId] = useState(null);

  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ["adminOverview"],
    queryFn: fetchOverview,
  });

  const { data: retailers, isLoading: loadingRetailers } = useQuery({
    queryKey: ["adminRetailers"],
    queryFn: fetchRetailers,
  });

  // Filter Retailers
  const filteredRetailers = retailers?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <Title>Financial Overview</Title>
        <Subtitle>Monitor wallet recharges and retailer performance</Subtitle>
      </Header>

      {/* --- Top Stats Cards --- */}
      <StatsGrid>
        <StatCard>
          <IconWrapper color="var(--color-success)">
            <TrendingUp size={24} />
          </IconWrapper>
          <StatInfo>
            <Label>Today's Revenue</Label>
            <Value>₹ {overview?.todayRevenue?.toFixed(2) || "0.00"}</Value>
          </StatInfo>
        </StatCard>

        <StatCard>
          <IconWrapper color="var(--color-primary)">
            <DollarSign size={24} />
          </IconWrapper>
          <StatInfo>
            <Label>Total Revenue (All Time)</Label>
            <Value>₹ {overview?.totalRevenue?.toFixed(2) || "0.00"}</Value>
          </StatInfo>
        </StatCard>

        <StatCard>
          <IconWrapper color="var(--color-secondary)">
            <Users size={24} />
          </IconWrapper>
          <StatInfo>
            <Label>Total Retailers</Label>
            <Value>{overview?.totalRetailers || 0}</Value>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      {/* --- Retailer Table Section --- */}
      <SectionContainer>
        <TableHeader>
          <SectionTitle>Retailer Performance</SectionTitle>
          <SearchWrapper>
            <Search size={18} />
            <SearchInput
              placeholder="Search retailer by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>
        </TableHeader>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Retailer</th>
                <th>Location</th>
                <th>Current Balance</th>
                <th>Recharge (Today)</th>
                <th>Recharge (Total)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingRetailers ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredRetailers?.length > 0 ? (
                filteredRetailers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <UserInfo>
                        {/* <Avatar>{user.name[0]}</Avatar> */}
                        <div>
                          <UserName>{user.name}</UserName>
                          <UserEmail>{user.email}</UserEmail>
                        </div>
                      </UserInfo>
                    </td>
                    <td>
                      <Location>
                        <MapPin size={14} /> {user.jila}, {user.prakhand}
                      </Location>
                    </td>
                    <td>
                      <Balance>
                        ₹ {(user.walletBalance || 0).toFixed(2)}
                      </Balance>
                    </td>
                    <td>
                      <TodayRevenue highlight={user.todayRecharge > 0}>
                        {user.todayRecharge > 0
                          ? `+ ₹${user.todayRecharge}`
                          : "-"}
                      </TodayRevenue>
                    </td>
                    <td>₹ {user.totalRecharge.toFixed(2)}</td>
                    <td>
                      <ViewButton
                        onClick={() => setSelectedRetailerId(user._id)}
                      >
                        <Eye size={16} />
                      </ViewButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No retailers found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableContainer>
      </SectionContainer>

      {/* --- Drill Down Modal --- */}
      <AnimatePresence>
        {selectedRetailerId && (
          <RetailerDetailModal
            retailerId={selectedRetailerId}
            onClose={() => setSelectedRetailerId(null)}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

export default AdminWalletDashboard;

// --- Styled Components ---

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${(props) => props.color}20; // 20% opacity
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
const Label = styled.span`
  font-size: 0.9rem;
  color: var(--color-text-secondary);
`;
const Value = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-text);
`;

const SectionContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border-light);
  flex-wrap: wrap;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 300px;
  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.2rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    text-align: left;
    padding: 1rem 1.5rem;
    background: #f8f9fa;
    font-size: 0.85rem;
    color: #666;
    text-transform: uppercase;
  }
  td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #eee;
  }
  tr:last-child td {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const Avatar = styled.div`
  width: 36px;
  height: 36px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;
const UserName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
`;
const UserEmail = styled.div`
  font-size: 0.8rem;
  color: #777;
`;
const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #555;
  font-size: 0.9rem;
`;
const Balance = styled.span`
  font-weight: 600;
`;
const TodayRevenue = styled.span`
  font-weight: 700;
  color: ${(props) => (props.highlight ? "var(--color-success)" : "#ccc")};
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: 1px solid var(--color-border);
  padding: 6px 12px;
  border-radius: 6px;
  color: black;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
`;
