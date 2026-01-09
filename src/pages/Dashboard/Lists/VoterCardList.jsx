import React, { useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import { Link } from "react-router-dom";

// Fetch all user services
const fetchMyServices = async () => {
  const res = await axiosInstance.get("/services/my-services");
  // Filter only VoterCards on client side
  return res.data.filter((s) => s.serviceType === "VoterCard");
};

const VoterCardList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: services,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myVoterServices"],
    queryFn: fetchMyServices,
  });

  // Filter Logic
  const filteredData = services?.filter((service) => {
    if (!service.specificService) return false;
    const { name, referenceNumber, state } = service.specificService;
    const term = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(term) ||
      referenceNumber.toLowerCase().includes(term) ||
      state.toLowerCase().includes(term)
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
  const currentData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle Download Trigger
  const handleDownload = async (serviceId, fileName = "voter_card.pdf") => {
    try {
      // 1. Fetch the file using Axios (Passes the Token)
      const response = await axiosInstance.get(
        `/services/${serviceId}/voter/download`,
        {
          responseType: "blob", // Important: Tell Axios this is a file
        }
      );

      // 2. Create a temporary URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // 3. Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from headers if possible, or use default
      // (Optional: You can try to parse content-disposition header here)
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      // 4. Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      // Optional: Show error toast
      // errorToast("Failed to download file. It might not be ready yet.");
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>Voter Card Applications</Title>
          <Subtitle>Manage and download your generated Voter PDFs</Subtitle>
        </div>
        <Link to="/dashboard/services/voter-card">
          <NewButton>+ New Application</NewButton>
        </Link>
      </Header>

      <Controls>
        <SearchWrapper>
          <Search size={18} />
          <SearchInput
            placeholder="Search by name, ref no, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>
      </Controls>

      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Applicant Name</th>
              <th>State</th>
              <th>Reference No</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Voter PDF</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Loading records...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "red" }}>
                  Error loading data
                </td>
              </tr>
            ) : currentData?.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#888",
                  }}
                >
                  No records found.
                </td>
              </tr>
            ) : (
              currentData.map((service) => (
                <tr key={service._id}>
                  <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                  <td>
                    <NameWrapper>
                      <FileText size={16} color="#666" />
                      {service.specificService?.name}
                    </NameWrapper>
                  </td>
                  <td>{service.specificService?.state}</td>
                  <td>
                    <RefBadge>
                      {service.specificService?.referenceNumber}
                    </RefBadge>
                  </td>
                  <td>
                    <StatusBadge status={service.status}>
                      {service.status}
                    </StatusBadge>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {service.specificService?.adminFilePath ? (
                      <DownloadButton
                        onClick={() => handleDownload(service._id)}
                      >
                        <Download size={16} /> Download
                      </DownloadButton>
                    ) : (
                      <PendingText>Processing...</PendingText>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>

      {/* Pagination */}
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
    </Container>
  );
};

export default VoterCardList;

// --- Styled Components ---

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const NewButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const Controls = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
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
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
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
  min-width: 800px;

  th {
    text-align: left;
    padding: 1rem 1.5rem;
    background: #f8f9fa;
    color: #666;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
  }

  td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #eee;
    color: #333;
    font-size: 0.95rem;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;
const RefBadge = styled.span`
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${(props) => {
    switch (props.status) {
      case "completed":
        return "background: #dcfce7; color: #166534;";
      case "processing":
        return "background: #e0f2fe; color: #075985;";
      case "rejected":
        return "background: #fee2e2; color: #991b1b;";
      default:
        return "background: #f3f4f6; color: #374151;";
    }
  }}
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-primary);
    color: white;
  }
`;

const PendingText = styled.span`
  color: #999;
  font-style: italic;
  font-size: 0.9rem;
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
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #f9f9f9;
  }
`;
