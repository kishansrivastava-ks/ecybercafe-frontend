import { useOutletContext, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const AdminServices = () => {
  const { services, isLoading, error } = useOutletContext();
  const navigate = useNavigate();

  const handleServiceClick = async (serviceId) => {
    const { data } = await axiosInstance.get(`/admin/service/${serviceId}`);
    console.log(data);
    const serviceType = data.serviceType;
    if (serviceType === "PanCard") {
      navigate(`/admin-dashboard/service/pan/${serviceId}`);
    } else if (serviceType === "RTPS") {
      navigate(`/admin-dashboard/service/rtps/${serviceId}`);
    } else if (serviceType === "JobCard") {
      navigate(`/admin-dashboard/service/job-card/${serviceId}`);
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <HeaderContainer>
        <Title>All Applied Services</Title>
        <ServiceCount>{services?.length || 0} Total Services</ServiceCount>
      </HeaderContainer>

      {isLoading && <LoadingMessage>Loading services...</LoadingMessage>}
      {error && <ErrorMessage>Error fetching services</ErrorMessage>}

      {!isLoading && !error && services.length === 0 && (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <p>No services have been applied yet.</p>
        </EmptyState>
      )}

      {!isLoading && !error && services.length > 0 && (
        <TableContainer>
          <ServiceTable>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Service Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
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
                  <td>{service.serviceType}</td>
                  <td>
                    <StatusBadge status={service.status}>
                      {getStatusIcon(service.status)}
                      {service.status}
                    </StatusBadge>
                  </td>
                  <td>
                    {/* <ActionLink to={`/admin-dashboard/service/${service._id}`}> */}
                    <ActionLink onClick={() => handleServiceClick(service._id)}>
                      <Eye size={16} />
                      View Details
                    </ActionLink>
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

// Helper function to get status icon
const getStatusIcon = (status) => {
  switch (status) {
    case "Approved":
      return <CheckCircle size={16} style={{ marginRight: "0.5rem" }} />;
    case "Pending":
      return <Clock size={16} style={{ marginRight: "0.5rem" }} />;
    case "Rejected":
      return <XCircle size={16} style={{ marginRight: "0.5rem" }} />;
    default:
      return null;
  }
};

export default AdminServices;

// Styled Components
const Container = styled(motion.div)`
  padding: 2rem;
  min-width: 100%;
  margin: 0 auto;

  @media (max-width: 767px) {
    padding: 1rem;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: var(--color-text);
  font-weight: 600;

  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
`;

const ServiceCount = styled.div`
  background-color: var(--color-surface-secondary);
  color: var(--color-text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: var(--color-error);
  padding: 2rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);

  @media (max-width: 767px) {
    padding: 2rem 1rem;
  }
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0 -1rem;
  padding: 0 1rem;

  @media (max-width: 767px) {
    margin: 0 -1rem;
    padding: 0 1rem;
  }
`;

const ServiceTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.75rem;
  min-width: 650px;

  thead {
    background-color: var(--color-surface-secondary);
  }

  th,
  td {
    padding: 1rem;
    text-align: left;
    background-color: var(--color-surface);

    @media (max-width: 767px) {
      padding: 0.75rem;
    }
  }

  th {
    color: var(--color-text-secondary);
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.75rem;
  }
`;

const ServiceRow = styled(motion.tr)`
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;

  td {
    border-top: 1px solid var(--color-border-light);
    border-bottom: 1px solid var(--color-border-light);

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
  gap: 1rem;

  @media (max-width: 767px) {
    gap: 0.5rem;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: var(--color-primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 500;

  @media (max-width: 767px) {
    width: 30px;
    height: 30px;
    font-size: 0.875rem;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;

  background-color: ${(props) =>
    props.status === "Approved"
      ? "var(--color-success)"
      : props.status === "Pending"
      ? "var(--color-warning)"
      : props.status === "Rejected"
      ? "var(--color-error)"
      : "var(--color-primary)"};
  color: white;

  @media (max-width: 767px) {
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
  }
`;

const ActionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-primary);
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-primary-dark);
  }

  @media (max-width: 767px) {
    font-size: 0.875rem;
  }
`;
