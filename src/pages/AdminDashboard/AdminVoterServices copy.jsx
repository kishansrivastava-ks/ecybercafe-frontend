import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import VoterDocUploadModal from "./VoterDocUploadModal"; // Creating this next

// Fetch Voter Services
const fetchVoterServices = async () => {
  const res = await axiosInstance.get("/admin/service/by-type?type=VoterCard");
  console.log("Fetched Voter Services:", res.data.data);
  return res.data.data; // The controller returns { results: n, data: [...] }
};

const AdminVoterServices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, completed
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for Upload Modal
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: services,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["adminVoterServices"],
    queryFn: fetchVoterServices,
  });

  // --- Filtering & Sorting Logic ---
  const filteredData = useMemo(() => {
    if (!services) return [];

    return (
      services
        .filter((service) => {
          // 1. Search Filter (Applicant, Ref No, Retailer Name, Retailer Email)
          const term = searchTerm.toLowerCase();
          const specific = service.specificService || {};
          const user = service.user || {};

          const matchesSearch =
            (specific.name?.toLowerCase() || "").includes(term) ||
            (specific.referenceNumber?.toLowerCase() || "").includes(term) ||
            (user.name?.toLowerCase() || "").includes(term) ||
            (user.email?.toLowerCase() || "").includes(term);

          // 2. Status Filter
          const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "completed" && service.status === "completed") ||
            (statusFilter === "pending" && service.status !== "completed");

          return matchesSearch && matchesStatus;
        })
        // sort by newest first
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ); // Newest first
  }, [services, searchTerm, statusFilter]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // --- Handlers ---
  const handleOpenUpload = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDownloadExisting = async (serviceId) => {
    try {
      const response = await axiosInstance.get(
        `/services/${serviceId}/voter/download`,
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "existing_voter_card.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
      alert("Could not download file.");
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>Voter Card Applications</Title>
          <Subtitle>Manage applications and upload generated PDFs</Subtitle>
        </div>
        <StatsBadge>
          Total: <strong>{filteredData.length}</strong>
        </StatsBadge>
      </Header>

      {/* --- Controls Section --- */}
      <ControlsContainer>
        <SearchWrapper>
          <Search size={18} />
          <SearchInput
            placeholder="Search by Applicant, Reference No, or Retailer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>

        <FiltersWrapper>
          <FilterGroup>
            <Filter size={16} />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </Select>
          </FilterGroup>

          <RefreshButton onClick={() => refetch()} title="Refresh Data">
            <RefreshCw size={18} />
          </RefreshButton>
        </FiltersWrapper>
      </ControlsContainer>

      {/* --- Table Section --- */}
      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Retailer Details</th>
              <th>Applicant Info</th>
              <th>State</th>
              <th>EPIC No</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="center">
                  Loading applications...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="7" className="center error">
                  Error loading data
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan="7" className="center muted">
                  No applications found matching criteria.
                </td>
              </tr>
            ) : (
              currentData.map((service) => (
                <tr key={service._id}>
                  <td>
                    <DateText>
                      {new Date(service.createdAt).toLocaleDateString()}
                    </DateText>
                    <TimeText>
                      {new Date(service.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TimeText>
                  </td>
                  <td>
                    <RetailerInfo>
                      <span className="name">
                        {service.user?.name || "Unknown"}
                      </span>
                      <span className="email">{service.user?.email}</span>
                    </RetailerInfo>
                  </td>
                  <td>
                    <ApplicantName>
                      {service.specificService?.name}
                    </ApplicantName>
                  </td>
                  <td>{service.specificService?.state}</td>
                  <td>
                    <RefBadge>
                      {service.specificService?.referenceNumber}
                    </RefBadge>
                  </td>
                  <td>
                    <StatusBadge status={service.status}>
                      {service.status === "completed" ? (
                        <>
                          <CheckCircle size={12} /> Completed
                        </>
                      ) : (
                        <>
                          <Clock size={12} /> Pending
                        </>
                      )}
                    </StatusBadge>
                  </td>
                  <td>
                    <ActionCell>
                      {/* If file exists, show download icon */}
                      {service.specificService?.adminFilePath && (
                        <IconButton
                          onClick={() => handleDownloadExisting(service._id)}
                          title="View Existing Document"
                        >
                          <Eye size={18} />
                        </IconButton>
                      )}

                      {/* Upload/Replace Button */}
                      <UploadButton
                        onClick={() => handleOpenUpload(service)}
                        isCompleted={service.status === "completed"}
                      >
                        <Upload size={14} />
                        {service.status === "completed"
                          ? "Replace PDF"
                          : "Upload PDF"}
                      </UploadButton>
                    </ActionCell>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>

      {/* --- Pagination --- */}
      {totalPages > 1 && (
        <Pagination>
          <PageBtn
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            {/* <ChevronLeft size={20} /> */}
            {`<`}
          </PageBtn>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <PageBtn
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            {/* <ChevronRight size={20} /> */}
            {`>`}
          </PageBtn>
        </Pagination>
      )}

      {/* --- Upload Modal --- */}
      {isModalOpen && (
        <VoterDocUploadModal
          service={selectedService}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            refetch(); // Refresh table data after upload
          }}
        />
      )}
    </Container>
  );
};

export default AdminVoterServices;

// --- Styled Components ---

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;
const Title = styled.h1`
  font-size: 1.8rem;
  color: var(--color-text);
  margin-bottom: 0.25rem;
`;
const Subtitle = styled.p`
  color: var(--color-text-secondary);
`;
const StatsBadge = styled.div`
  background: var(--color-surface-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  justify-content: space-between;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
`;

const FiltersWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const FilterGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  svg {
    position: absolute;
    left: 10px;
    color: #666;
    pointer-events: none;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem 0.75rem 2.2rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: white;
  cursor: pointer;
`;

const RefreshButton = styled.div`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  color: black;
  &:hover {
    background: #f5f5f5;
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  overflow-x: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;

  th {
    text-align: left;
    padding: 1rem;
    background: #f8f9fa;
    color: #666;
    font-size: 0.85rem;
    text-transform: uppercase;
  }
  td {
    padding: 1rem;
    border-bottom: 1px solid #eee;
    font-size: 0.95rem;
    vertical-align: middle;
  }
  tr:last-child td {
    border-bottom: none;
  }

  .center {
    text-align: center;
    padding: 3rem;
  }
  .error {
    color: red;
  }
  .muted {
    color: #888;
  }
`;

const DateText = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
`;
const TimeText = styled.div`
  font-size: 0.8rem;
  color: #888;
`;

const RetailerInfo = styled.div`
  display: flex;
  flex-direction: column;
  .name {
    font-weight: 600;
    font-size: 0.95rem;
  }
  .email {
    font-size: 0.85rem;
    color: #666;
  }
`;

const ApplicantName = styled.div`
  font-weight: 600;
  color: var(--color-text);
`;
const RefBadge = styled.span`
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
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
    p.status === "completed"
      ? `background: #dcfce7; color: #166534;`
      : `background: #fff7ed; color: #c2410c;`}
`;

const ActionCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 5px;
  &:hover {
    color: var(--color-primary);
  }
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(p) => (p.isCompleted ? "white" : "var(--color-primary)")};
  color: ${(p) => (p.isCompleted ? "var(--color-text)" : "white")};
  border: 1px solid
    ${(p) => (p.isCompleted ? "var(--color-border)" : "var(--color-primary)")};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(p) =>
      p.isCompleted ? "#f5f5f5" : "var(--color-primary-dark)"};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  span {
    font-size: 0.9rem;
    color: #666;
  }
`;
const PageBtn = styled.button`
  width: 36px;
  height: 36px;
  /* border-radius: 50%; */
  border: 1px solid #ddd;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
  &:hover:not(:disabled) {
    background: #f9f9f9;
  }
`;
