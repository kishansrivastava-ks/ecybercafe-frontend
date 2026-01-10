import React, { useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, XCircle, MessageSquare, X } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import LabourActionModal from "../../components/modals/LabourActionModal";

const fetchLabourServices = async () => {
  const res = await axiosInstance.get("/admin/service/by-type?type=LabourCard");
  return res.data.data;
};

const AdminLabourServices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedService, setSelectedService] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve', 'reject', 'general_remark'
  const [historyModalData, setHistoryModalData] = useState(null); // For history view

  const {
    data: services,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminLabour"],
    queryFn: fetchLabourServices,
  });

  const filteredData = services?.filter((s) => {
    const term = searchTerm.toLowerCase();
    const specific = s.specificService || {};
    const matchesSearch =
      (specific.applicationNumber?.toLowerCase() || "").includes(term) ||
      (specific.name?.toLowerCase() || "").includes(term);

    if (filter === "all") return matchesSearch;
    return matchesSearch && s.status === filter;
  });

  const handleAction = (service, type) => {
    setSelectedService(service);
    setActionType(type);
  };

  return (
    <Container>
      <Header>
        <Title>Labour Card Applications</Title>
        <Controls>
          <SearchInput
            placeholder="Search App No or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
        </Controls>
      </Header>

      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Retailer</th>
              <th>Applicant</th>
              <th>App No / Block</th>
              <th>Status</th>
              <th>Remarks</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7">Loading...</td>
              </tr>
            ) : (
              filteredData?.map((service) => (
                <tr key={service._id}>
                  <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{service.user?.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#777" }}>
                      {service.user?.email}
                    </div>
                  </td>
                  <td>{service.specificService?.name}</td>
                  <td>
                    <div style={{ fontFamily: "monospace" }}>
                      {service.specificService?.applicationNumber}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>
                      {service.specificService?.block}
                    </div>
                  </td>

                  {/* Status with Remark */}
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        alignItems: "flex-start",
                      }}
                    >
                      <StatusBadge status={service.status}>
                        {service.status}
                      </StatusBadge>
                      {service.specificService?.statusRemark && (
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "#666",
                            fontStyle: "italic",
                            maxWidth: "150px",
                          }}
                        >
                          "{service.specificService.statusRemark}"
                        </span>
                      )}
                    </div>
                  </td>

                  {/* General Remarks with History Link */}
                  <td>
                    {service.specificService?.generalRemarks?.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "0.85rem",
                          }}
                        >
                          <MessageSquare size={12} color="#666" />
                          <span>
                            {service.specificService.generalRemarks[
                              service.specificService.generalRemarks.length - 1
                            ].text.substring(0, 15)}
                            ...
                          </span>
                        </div>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--color-primary)",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            padding: 0,
                            textDecoration: "underline",
                          }}
                          onClick={() =>
                            setHistoryModalData(
                              service.specificService.generalRemarks
                            )
                          }
                        >
                          History (
                          {service.specificService.generalRemarks.length})
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "#ccc", fontSize: "0.85rem" }}>
                        No notes
                      </span>
                    )}
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <ActionGroup>
                      <ActionBtn
                        className="approve"
                        onClick={() => handleAction(service, "approve")}
                      >
                        <CheckCircle size={16} />
                      </ActionBtn>
                      <ActionBtn
                        className="reject"
                        onClick={() => handleAction(service, "reject")}
                      >
                        <XCircle size={16} />
                      </ActionBtn>
                      <ActionBtn
                        className="remark"
                        onClick={() => handleAction(service, "general_remark")}
                      >
                        <MessageSquare size={16} />
                      </ActionBtn>
                    </ActionGroup>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>

      {/* Action Modal */}
      {selectedService && (
        <LabourActionModal
          service={selectedService}
          type={actionType}
          onClose={() => {
            setSelectedService(null);
            setActionType(null);
          }}
          onSuccess={() => {
            setSelectedService(null);
            setActionType(null);
            refetch();
          }}
        />
      )}

      {/* History Modal */}
      {historyModalData && (
        <Overlay onClick={() => setHistoryModalData(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Remarks History</h3>
              <CloseBtn onClick={() => setHistoryModalData(null)}>
                <X size={20} />
              </CloseBtn>
            </ModalHeader>
            <ModalBody>
              {historyModalData
                .slice()
                .reverse()
                .map((rem, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginBottom: "1rem",
                      borderLeft: "2px solid #ddd",
                      paddingLeft: "10px",
                    }}
                  >
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem" }}>
                      {rem.text}
                    </p>
                    <span style={{ fontSize: "0.75rem", color: "#888" }}>
                      {new Date(rem.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
            </ModalBody>
          </Modal>
        </Overlay>
      )}
    </Container>
  );
};

export default AdminLabourServices;

// --- Styled Components (Minimal set for admin view) ---
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
  padding: 0.5rem 1rem;
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
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 10px;
  ${(p) =>
    p.status === "approved"
      ? "background:#dcfce7; color:#166534"
      : p.status === "rejected"
      ? "background:#fee2e2; color:#991b1b"
      : "background:#fff7ed; color:#9a3412"}
`;
const ActionGroup = styled.div`
  display: flex;
  gap: 5px;
  justify-content: flex-end;
`;
const ActionBtn = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &.approve {
    background: #f0fdf4;
    color: #16a34a;
  }
  &.reject {
    background: #fef2f2;
    color: #ef4444;
  }
  &.remark {
    background: #eff6ff;
    color: #3b82f6;
  }
`;
const Overlay = styled.div`
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
`;
const Modal = styled.div`
  background: white;
  width: 400px;
  max-height: 60vh;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  h3 {
    margin: 0;
  }
`;
const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
`;
const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;
