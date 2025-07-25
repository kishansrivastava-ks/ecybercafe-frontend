import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { errorToast, successToast } from "../../utils/ToastNotfications";

const fetchUserServices = async () => {
  const res = await axiosInstance.get("/services/my-services");
  return res.data;
};

const UserServices = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["userServices"],
    queryFn: fetchUserServices,
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [showDeleteAllConfirmation, setShowDeleteAllConfirmation] =
    useState(false);
  const queryClient = useQueryClient();

  const [selectedServiceType, setSelectedServiceType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const navigate = useNavigate();

  const fetchServiceDetails = async (serviceId) => {
    const res = await axiosInstance.get(`/admin/service/${serviceId}`);
    console.log(res.data.serviceType);
    const serviceType = res.data.serviceType;
    if (serviceType === "PanCard") {
      navigate(`/dashboard/services/pan/${serviceId}`);
    } else if (serviceType === "RTPS") {
      navigate(`/dashboard/services/rtps/${serviceId}`);
    } else if (serviceType === "JobCard") {
      navigate(`/dashboard/services/job-card/${serviceId}`);
    } else if (serviceType === "ITR") {
      navigate(`/dashboard/services/itr/${serviceId}`);
    }
  };

  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId) => {
      return await axiosInstance.delete(`/services/${serviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userServices"]);
      successToast("Service deleted successfully");
    },
    onError: () => {
      errorToast("Failed to delete service");
    },
  });

  const deleteAllServicesMutation = useMutation({
    mutationFn: async () => {
      return await axiosInstance.delete("/services/all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userServices"]);
      successToast("All services deleted successfully");
    },
    onError: () => {
      errorToast("Failed to delete services");
    },
  });

  const handleDeleteClick = (e, serviceId) => {
    e.stopPropagation();
    setDeleteConfirmation(serviceId);
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteServiceMutation.mutate(deleteConfirmation);
      setDeleteConfirmation(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleDeleteAll = () => {
    setShowDeleteAllConfirmation(true);
  };

  const confirmDeleteAll = () => {
    deleteAllServicesMutation.mutate();
    setShowDeleteAllConfirmation(false);
  };

  const cancelDeleteAll = () => {
    setShowDeleteAllConfirmation(false);
  };

  // Filter services based on selected filters
  const filteredServices =
    !isLoading && !error && data
      ? data.filter((service) => {
          const matchesServiceType =
            selectedServiceType === "All" ||
            service.serviceType === selectedServiceType;
          const matchesStatus =
            selectedStatus === "All" || service.status === selectedStatus;
          return matchesServiceType && matchesStatus;
        })
      : [];

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Title>My Services</Title>
      <FiltersContainer>
        <FilterGroup>
          <FilterLabel>Service Type</FilterLabel>
          <FilterTabs>
            <FilterTab
              active={selectedServiceType === "All"}
              onClick={() => setSelectedServiceType("All")}
            >
              All
            </FilterTab>
            <FilterTab
              active={selectedServiceType === "PanCard"}
              onClick={() => setSelectedServiceType("PanCard")}
            >
              PanCard
            </FilterTab>
            <FilterTab
              active={selectedServiceType === "RTPS"}
              onClick={() => setSelectedServiceType("RTPS")}
            >
              RTPS
            </FilterTab>
            <FilterTab
              active={selectedServiceType === "JobCard"}
              onClick={() => setSelectedServiceType("JobCard")}
            >
              JobCard
            </FilterTab>

            <FilterTab
              active={selectedServiceType === "ITR"}
              onClick={() => setSelectedServiceType("ITR")}
            >
              ITR
            </FilterTab>
          </FilterTabs>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Status</FilterLabel>
          <FilterTabs>
            <FilterTab
              active={selectedStatus === "All"}
              onClick={() => setSelectedStatus("All")}
            >
              All
            </FilterTab>
            <FilterTab
              active={selectedStatus === "completed"}
              onClick={() => setSelectedStatus("completed")}
            >
              Completed
            </FilterTab>
            <FilterTab
              active={selectedStatus === "pending"}
              onClick={() => setSelectedStatus("pending")}
            >
              Pending
            </FilterTab>
            <FilterTab
              active={selectedStatus === "in_progress"}
              onClick={() => setSelectedStatus("in_progress")}
            >
              In Progress
            </FilterTab>
          </FilterTabs>
        </FilterGroup>
      </FiltersContainer>
      <DeleteAllContainer>
        <DeleteAllButton
          onClick={handleDeleteAll}
          disabled={
            isLoading || (filteredServices && filteredServices.length === 0)
          }
        >
          Delete All Services
          <Trash2 size={16} />
        </DeleteAllButton>
      </DeleteAllContainer>
      {isLoading && <LoadingMessage>Loading services...</LoadingMessage>}
      {error && <ErrorMessage>Error fetching services</ErrorMessage>}
      {!isLoading && !error && filteredServices.length === 0 && (
        <EmptyState>
          No services found matching the selected filters.
        </EmptyState>
      )}

      {!isLoading && !error && filteredServices.length > 0 && (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Service Type</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Applied On</TableHeaderCell>
                <TableHeaderCell>Comments</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {filteredServices.map((service) => (
                <TableRow
                  key={service._id}
                  whileHover={{
                    backgroundColor: "var(--color-surface-secondary)",
                  }}
                  onClick={() => fetchServiceDetails(service._id)}
                >
                  <TableCell>
                    <ServiceType>{service.serviceType}</ServiceType>
                  </TableCell>
                  <TableCell>{service.specificService.fullName}</TableCell>
                  <TableCell>
                    <StatusBadge status={service.status}>
                      {service.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(service.createdAt),
                      "dd MMM yyyy, HH:mm a"
                    )}
                  </TableCell>
                  <TableCell>
                    {service.comments.length > 0 ? (
                      <CommentSection>
                        {service.comments.map((comment, index) => (
                          <CommentItem key={index}>
                            <CommentText>{comment.text}</CommentText>
                            <CommentDate>
                              {new Date(comment.createdAt).toLocaleString()}
                            </CommentDate>
                          </CommentItem>
                        ))}
                      </CommentSection>
                    ) : (
                      <span style={{ color: "var(--color-text-muted)" }}>
                        No comments
                      </span>
                    )}
                  </TableCell>
                  <ActionCell>
                    <DeleteButton
                      onClick={(e) => handleDeleteClick(e, service._id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={16} color="var(--color-error)" />
                    </DeleteButton>
                  </ActionCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}

      {deleteConfirmation && (
        <ConfirmationModal>
          <ConfirmationContent>
            <h3>Delete Service</h3>
            <p>
              Are you sure you want to delete this service? This action cannot
              be undone.
            </p>
            <ConfirmationActions>
              <CancelButton onClick={cancelDelete}>Cancel</CancelButton>
              <DeleteConfirmButton
                onClick={confirmDelete}
                disabled={deleteServiceMutation.isLoading}
              >
                {deleteServiceMutation.isLoading ? "Deleting..." : "Delete"}
              </DeleteConfirmButton>
            </ConfirmationActions>
          </ConfirmationContent>
        </ConfirmationModal>
      )}
      {showDeleteAllConfirmation && (
        <ConfirmationModal>
          <ConfirmationContent>
            <h3>Delete All Services</h3>
            <p>
              Are you sure you want to delete all your services? This action
              cannot be undone.
            </p>
            <ConfirmationActions>
              <CancelButton onClick={cancelDeleteAll}>Cancel</CancelButton>
              <DeleteConfirmButton
                onClick={confirmDeleteAll}
                disabled={deleteAllServicesMutation.isLoading}
              >
                {deleteAllServicesMutation.isLoading
                  ? "Deleting..."
                  : "Delete All"}
              </DeleteConfirmButton>
            </ConfirmationActions>
          </ConfirmationContent>
        </ConfirmationModal>
      )}
    </Container>
  );
};

export default UserServices;

// Styled Components
const Container = styled(motion.div)`
  padding: 2rem;
  margin: 0 auto;
  background-color: var(--color-bg);
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const FiltersContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.h3`
  font-size: 1rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) =>
    props.active ? "var(--color-primary)" : "var(--color-surface)"};
  color: ${(props) => (props.active ? "white" : "var(--color-text)")};
  border: 1px solid
    ${(props) =>
      props.active ? "var(--color-primary)" : "var(--color-border-light)"};

  &:hover {
    background-color: ${(props) =>
      props.active ? "var(--color-primary)" : "var(--color-surface-secondary)"};
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 1rem;
  padding: 1rem;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: var(--color-error);
  font-size: 1rem;
  padding: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  color: var(--color-text-muted);
  padding: 2rem;
  background-color: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
`;

const TableContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: var(--color-surface-secondary);
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border-light);
  font-size: 0.875rem;
`;

const TableRow = styled(motion.tr)`
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-surface-secondary);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--color-border-light);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  vertical-align: top;
`;

const ActionCell = styled(TableCell)`
  width: 60px;
  text-align: center;
`;

const ServiceType = styled.h3`
  font-size: 1.125rem;
  color: var(--color-text);
  font-weight: 500;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${(props) =>
    props.status === "completed"
      ? "var(--color-success)"
      : props.status === "pending"
      ? "var(--color-warning)"
      : props.status === "in_progress"
      ? "var(--color-primary)"
      : "var(--color-primary)"};
  color: white;
`;

const CommentSection = styled.div`
  background-color: var(--color-bg);
  border-radius: 6px;
  padding: 0.75rem;
  margin: 0.25rem 0;
  max-width: 300px;
`;

const CommentTitle = styled.h4`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const CommentItem = styled.div`
  margin-bottom: 0.5rem;
  padding: 0.25rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const CommentText = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const CommentDate = styled.span`
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-style: italic;
`;

const DeleteButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background-color: rgba(255, 59, 48, 0.1);
  }
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfirmationContent = styled.div`
  background-color: var(--color-surface);
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--color-text);
  }

  p {
    margin-bottom: 1.5rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }
`;

const ConfirmationActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  border: 1px solid var(--color-border-light);
  background-color: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;

  &:hover {
    background-color: var(--color-surface-secondary);
  }
`;

const DeleteConfirmButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  background-color: var(--color-error);
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #d63031;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const DeleteAllContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const DeleteAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  background-color: var(--color-error);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #d63031;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
