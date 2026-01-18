import React, { useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Clock, XCircle, Filter, Search } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { successToast, errorToast } from "../../utils/ToastNotfications";

const fetchTransactions = async () => {
  const res = await axiosInstance.get("/admin/transactions");
  return res.data;
};

const approveTransaction = async (id) => {
  const res = await axiosInstance.post(`/admin/transactions/${id}/approve`);
  return res.data;
};

const AdminTransactions = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all"); // all, PENDING, SUCCESS
  const [searchTerm, setSearchTerm] = useState("");

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["adminTransactions"],
    queryFn: fetchTransactions,
  });

  const approveMutation = useMutation({
    mutationFn: approveTransaction,
    onSuccess: () => {
      successToast("Transaction approved & Wallet updated");
      queryClient.invalidateQueries(["adminTransactions"]);
    },
    onError: (err) => errorToast(err.response?.data?.message),
  });

  const filteredData = transactions?.filter((txn) => {
    const matchesStatus = filter === "all" || txn.status === filter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      txn.user?.name.toLowerCase().includes(term) ||
      txn.description?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  return (
    <Container>
      <Header>
        <Title>Transaction Monitor</Title>
        <Controls>
          <SearchInput
            placeholder="Search User or Desc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="PENDING">Pending (Issues)</option>
            <option value="SUCCESS">Success</option>
          </Select>
        </Controls>
      </Header>

      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="center">
                  Loading...
                </td>
              </tr>
            ) : (
              filteredData?.map((txn) => (
                <tr key={txn._id}>
                  <td>{new Date(txn.createdAt).toLocaleString()}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>
                      {txn.user?.name || "Unknown"}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>
                      {txn.user?.mobile}
                    </div>
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: txn.type === "CREDIT" ? "green" : "red",
                    }}
                  >
                    {txn.type === "CREDIT" ? "+" : "-"} ₹{txn.amount}
                  </td>
                  <td>{txn.category || txn.type}</td>
                  <td>
                    <StatusBadge status={txn.status}>{txn.status}</StatusBadge>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {txn.status === "PENDING" && txn.type === "CREDIT" && (
                      <ApproveBtn
                        onClick={() => {
                          if (
                            window.confirm(
                              `Force approve ₹${txn.amount} for ${txn.user?.name}?`,
                            )
                          ) {
                            approveMutation.mutate(txn._id);
                          }
                        }}
                      >
                        Force Verify
                      </ApproveBtn>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>
    </Container>
  );
};

export default AdminTransactions;

// --- Styles ---
const Container = styled.div`
  padding: 2rem;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  align-items: center;
`;
const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;
const Controls = styled.div`
  display: flex;
  gap: 1rem;
`;
const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 200px;
`;
const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
`;
const TableCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #eee;
  overflow-x: auto;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    text-align: left;
    padding: 1rem;
    background: #f9f9f9;
    color: #666;
  }
  td {
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }
`;
const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  background: ${(p) =>
    p.status === "SUCCESS"
      ? "#dcfce7"
      : p.status === "PENDING"
        ? "#fef9c3"
        : "#fee2e2"};
  color: ${(p) =>
    p.status === "SUCCESS"
      ? "#166534"
      : p.status === "PENDING"
        ? "#854d0e"
        : "#991b1b"};
`;
const ApproveBtn = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    opacity: 0.9;
  }
`;
