import React, { useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  X,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axiosInstance from "../../../api/axiosInstance";

const fetchMyLabourServices = async () => {
  const res = await axiosInstance.get("/services/my-services");
  return res.data.filter((s) => s.serviceType === "LabourCard");
};

const LabourCardList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedRemarks, setSelectedRemarks] = useState(null);

  const {
    data: services,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myLabourServices"],
    queryFn: fetchMyLabourServices,
  });

  // Filter
  const filteredData = services?.filter((service) => {
    if (!service.specificService) return false;
    const { applicationNumber, name, block } = service.specificService;
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      applicationNumber?.toLowerCase().includes(term) ||
      name?.toLowerCase().includes(term) ||
      block?.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "all" || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
  const currentData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container>
      <Header>
        <div>
          <Title>Labour Card Applications</Title>
          <Subtitle>Track your applications</Subtitle>
        </div>
        <Link to="/dashboard/services/labour-card">
          <NewButton>+ New Application</NewButton>
        </Link>
      </Header>

      <Controls>
        <SearchWrapper>
          <Search size={18} />
          <SearchInput
            placeholder="Search App No, Name or Block..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
      </Controls>

      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Applicant Details</th>
              <th>Location</th>
              <th>Status & Remark</th>
              <th>General Remarks</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="center">
                  Loading...
                </td>
              </tr>
            ) : currentData?.length === 0 ? (
              <tr>
                <td colSpan="5" className="center muted">
                  No records found.
                </td>
              </tr>
            ) : (
              currentData.map((service) => {
                const specific = service.specificService;
                const latestRemark =
                  specific?.generalRemarks?.length > 0
                    ? specific.generalRemarks[
                        specific.generalRemarks.length - 1
                      ]
                    : null;

                return (
                  <tr key={service._id}>
                    <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{specific?.name}</div>
                      <RefBadge>{specific?.applicationNumber}</RefBadge>
                    </td>
                    <td>
                      <LocationWrapper>
                        <MapPin size={14} />
                        {specific?.block}{" "}
                        {specific?.district ? `, ${specific.district}` : ""}
                      </LocationWrapper>
                    </td>

                    {/* Status Column */}
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
                          {service.status === "completed" ||
                          service.status === "approved" ? (
                            <CheckCircle size={12} />
                          ) : service.status === "rejected" ? (
                            <XCircle size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {service.status}
                        </StatusBadge>
                        {specific?.statusRemark && (
                          <StatusRemarkText>
                            "{specific.statusRemark}"
                          </StatusRemarkText>
                        )}
                      </div>
                    </td>

                    {/* General Remarks */}
                    <td>
                      {latestRemark ? (
                        <GeneralRemarkCell>
                          <RemarkPreview>
                            <MessageSquare size={14} color="#666" />
                            <span>{latestRemark.text.substring(0, 25)}...</span>
                          </RemarkPreview>
                          <SeeMoreBtn
                            onClick={() =>
                              setSelectedRemarks(specific.generalRemarks)
                            }
                          >
                            See History ({specific.generalRemarks.length})
                          </SeeMoreBtn>
                        </GeneralRemarkCell>
                      ) : (
                        <span
                          style={{
                            color: "#ccc",
                            fontStyle: "italic",
                            fontSize: "0.85rem",
                          }}
                        >
                          No remarks
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </TableCard>

      {/* Pagination & Remarks Modal (Same logic as RTPS) */}
      {totalPages > 1 && (
        <Pagination>
          <PageBtn
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
          </PageBtn>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <PageBtn
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={20} />
          </PageBtn>
        </Pagination>
      )}

      {selectedRemarks && (
        <Overlay onClick={() => setSelectedRemarks(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Remarks History</h3>
              <CloseBtn onClick={() => setSelectedRemarks(null)}>
                <X size={20} />
              </CloseBtn>
            </ModalHeader>
            <ModalBody>
              <Timeline>
                {selectedRemarks
                  .slice()
                  .reverse()
                  .map((rem, idx) => (
                    <TimelineItem key={idx}>
                      <TimelineDot />
                      <TimelineContent>
                        <p className="text">{rem.text}</p>
                        <span className="date">
                          {new Date(rem.createdAt).toLocaleString()}
                        </span>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
              </Timeline>
            </ModalBody>
          </Modal>
        </Overlay>
      )}
    </Container>
  );
};

export default LabourCardList;

// --- Reuse Styled Components from previous RTPS List ---
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;
const Title = styled.h1`
  font-size: 1.8rem;
  margin: 0;
`;
const Subtitle = styled.p`
  color: #666;
`;
const NewButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
`;
const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;
const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 350px;
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
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
`;
const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
`;
const TableCard = styled.div`
  background: white;
  border-radius: 12px;
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
  .center {
    text-align: center;
    padding: 2rem;
  }
  .muted {
    color: #888;
  }
`;
const RefBadge = styled.div`
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  font-family: monospace;
  font-size: 0.85rem;
  margin-top: 2px;
`;
const LocationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #555;
`;
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  ${(p) =>
    p.status === "approved"
      ? "background:#dcfce7; color:#166534"
      : p.status === "rejected"
      ? "background:#fee2e2; color:#991b1b"
      : "background:#fff7ed; color:#c2410c"}
`;
const StatusRemarkText = styled.div`
  font-size: 0.8rem;
  color: #666;
  font-style: italic;
  margin-left: 5px;
  margin-top: 2px;
  max-width: 200px;
`;
const GeneralRemarkCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
`;
const RemarkPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #333;
`;
const SeeMoreBtn = styled.button`
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  margin-left: 20px;
`;
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  span {
    align-self: center;
    color: #666;
  }
`;
const PageBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
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
  max-height: 80vh;
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
const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;
const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
`;
const Timeline = styled.div`
  display: flex;
  flex-direction: column;
`;
const TimelineItem = styled.div`
  display: flex;
  gap: 1rem;
  position: relative;
  padding-bottom: 1.5rem;
  &:not(:last-child)::before {
    content: "";
    position: absolute;
    left: 7px;
    top: 18px;
    bottom: 0;
    width: 2px;
    background: #e5e7eb;
  }
`;
const TimelineDot = styled.div`
  width: 16px;
  height: 16px;
  background: #e0f2fe;
  border: 2px solid #0ea5e9;
  border-radius: 50%;
  margin-top: 4px;
  z-index: 1;
`;
const TimelineContent = styled.div`
  flex: 1;
  .text {
    margin: 0 0 4px 0;
    color: #333;
    font-size: 0.95rem;
  }
  .date {
    font-size: 0.8rem;
    color: #888;
  }
`;
