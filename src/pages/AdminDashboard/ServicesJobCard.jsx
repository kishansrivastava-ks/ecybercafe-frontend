import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, Clock, XCircle, ArrowLeft } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const ServicesJobCard = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobCardServices = async () => {
      try {
        const { data } = await axiosInstance.get(
          "admin/service/by-type?type=JobCard"
        );
        setServices(data.data || []);
      } catch (err) {
        setError("Failed to fetch services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobCardServices();
  }, []);

  const handleServiceClick = (serviceId) => {
    navigate(`/admin-dashboard/service/job-card/${serviceId}`);
  };

  const filteredServices =
    statusFilter === "All"
      ? services
      : services.filter((s) => s.status === statusFilter);

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <HeaderContainer>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </BackButton>
        <Title>Job Card Services</Title>
        <ServiceCount>{filteredServices.length} Services</ServiceCount>
      </HeaderContainer>

      <FilterContainer>
        {["All", "completed", "pending", "in_progress"].map((status) => (
          <FilterButton
            key={status}
            active={statusFilter === status}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </FilterButton>
        ))}
      </FilterContainer>

      {isLoading && <LoadingMessage>Loading services...</LoadingMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!isLoading && !error && filteredServices.length === 0 && (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <p>No Job card services available.</p>
        </EmptyState>
      )}

      {!isLoading && !error && filteredServices.length > 0 && (
        <TableContainer>
          <ServiceTable>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <ServiceRow
                  key={service._id}
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  }}
                  whileTap={{ scale: 0.99 }}
                >
                  <td>
                    <UserInfo>
                      <UserAvatar>
                        {service.user.name.charAt(0).toUpperCase()}
                      </UserAvatar>
                      {service.user.name}
                    </UserInfo>
                  </td>
                  <td>
                    <StatusBadge status={service.status}>
                      {getStatusIcon(service.status)}
                      {service.status}
                    </StatusBadge>
                  </td>
                  <td>
                    <ActionButton
                      onClick={() => handleServiceClick(service._id)}
                    >
                      <Eye size={16} />
                      View Details
                    </ActionButton>
                  </td>
                </ServiceRow>
              ))}
            </tbody>
          </ServiceTable>
        </TableContainer>
      )}
    </Container>
  );
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Approved":
    case "completed":
      return <CheckCircle size={16} style={{ marginRight: "0.5rem" }} />;
    case "Pending":
    case "pending":
      return <Clock size={16} style={{ marginRight: "0.5rem" }} />;
    case "Rejected":
      return <XCircle size={16} style={{ marginRight: "0.5rem" }} />;
    default:
      return null;
  }
};

export default ServicesJobCard;

// Styled Components
const Container = styled(motion.div)`
  padding: 2rem;
  width: 100%;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const BackButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  margin-right: 1rem;
  color: var(--color-primary);

  &:hover {
    background-color: white;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
  flex: 1;
`;

const ServiceCount = styled.div`
  background: var(--color-surface-secondary);
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled.button`
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 20px;
  background-color: ${(props) =>
    props.active ? "var(--color-primary)" : "var(--color-surface-secondary)"};
  color: ${(props) => (props.active ? "white" : "var(--color-text-secondary)")};
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: var(--color-primary-dark);
    color: white;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: var(--color-text-secondary);
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: var(--color-error);
`;

const EmptyState = styled.div`
  text-align: center;
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const ServiceTable = styled.table`
  width: 100%;
  border-spacing: 0 0.75rem;

  thead {
    background: var(--color-surface-secondary);
  }

  th,
  td {
    padding: 1rem;
    background: var(--color-surface);
  }

  th {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }
`;

const ServiceRow = styled(motion.tr)`
  border-radius: 12px;
  overflow: hidden;

  td {
    &:first-child {
      border-left: 1px solid var(--color-border-light);
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
    }

    &:last-child {
      border-right: 1px solid var(--color-border-light);
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: var(--color-primary-light);
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  color: white;
  font-size: 0.875rem;
  text-transform: uppercase;

  background-color: ${(props) =>
    props.status === "completed"
      ? "var(--color-success)"
      : props.status === "pending"
      ? "var(--color-warning)"
      : props.status === "in_progress"
      ? "var(--color-primary)"
      : "var(--color-primary)"};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: white;
  }
`;
