import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useState } from "react";

const fetchUserServices = async () => {
  const res = await axiosInstance.get("/services/my-services");
  return res.data;
};

const UserServices = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["userServices"],
    queryFn: fetchUserServices,
  });

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
    }
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

      {isLoading && <LoadingMessage>Loading services...</LoadingMessage>}
      {error && <ErrorMessage>Error fetching services</ErrorMessage>}

      {!isLoading && !error && filteredServices.length === 0 && (
        <EmptyState>
          No services found matching the selected filters.
        </EmptyState>
      )}

      {!isLoading && !error && filteredServices.length > 0 && (
        <ServiceGrid>
          {filteredServices.map((service) => (
            <ServiceCard
              key={service._id}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchServiceDetails(service._id)}
              style={{ cursor: "pointer" }}
            >
              <ServiceHeader>
                <ServiceType>{service.serviceType}</ServiceType>

                <StatusBadge status={service.status}>
                  {service.status}
                </StatusBadge>
              </ServiceHeader>
              <div style={{ marginBottom: "1rem" }}>
                {console.log(service)}
                <div>Name: {service.specificService.fullName}</div>
                <div>
                  Applied on:{" "}
                  {format(new Date(service.createdAt), "dd MMM yyyy, HH:mm a")}
                </div>
              </div>

              {service.comments.length > 0 && (
                <CommentSection>
                  <CommentTitle>Admin Comments</CommentTitle>
                  {service.comments.map((comment, index) => (
                    <CommentItem key={index}>
                      <CommentText>{comment.text}</CommentText>
                      <CommentDate>
                        {new Date(comment.createdAt).toLocaleString()}
                      </CommentDate>
                    </CommentItem>
                  ))}
                </CommentSection>
              )}
            </ServiceCard>
          ))}
        </ServiceGrid>
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

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const ServiceCard = styled(motion.div)`
  background-color: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  padding: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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
  background-color: var(--color-surface-secondary);
  border-radius: 8px;
  padding: 1rem;
`;

const CommentTitle = styled.h4`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const CommentItem = styled.div`
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background-color: var(--color-bg);
  border-radius: 6px;
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
