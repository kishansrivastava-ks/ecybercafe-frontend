import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";

const fetchUserServices = async () => {
  const res = await axiosInstance.get("/services/my-services");
  return res.data;
};

const UserServices = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["userServices"],
    queryFn: fetchUserServices,
  });

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Title>My Services</Title>

      {isLoading && <Message>Loading services...</Message>}
      {error && <ErrorMessage>Error fetching services</ErrorMessage>}

      {!isLoading && !error && data?.length === 0 && (
        <Message>No services applied yet.</Message>
      )}

      {!isLoading && !error && data?.length > 0 && (
        <ServiceList>
          {data.map((service) => (
            <ServiceItem
              key={service._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3>{service.serviceType}</h3>
              <Status>Status: {service.status}</Status>
              {service.comments.length > 0 && (
                <CommentsContainer>
                  <h4>Admin Comments:</h4>
                  <ul>
                    {service.comments.map((comment, index) => (
                      <CommentItem key={index}>
                        {comment.text} -{" "}
                        <i>{new Date(comment.createdAt).toLocaleString()}</i>
                      </CommentItem>
                    ))}
                  </ul>
                </CommentsContainer>
              )}
            </ServiceItem>
          ))}
        </ServiceList>
      )}
    </Container>
  );
};

export default UserServices;

// Styled Components
const Container = styled(motion.div)`
  padding: 20px;
  max-width: 600px;
  margin: auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.primary};
`;

const Message = styled.p`
  text-align: center;
  font-size: 16px;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  font-size: 16px;
`;

const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ServiceItem = styled(motion.div)`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: ${({ theme }) => theme.cardBackground};
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const Status = styled.p`
  font-weight: bold;
  margin: 5px 0;
`;

const CommentsContainer = styled.div`
  margin-top: 10px;
`;

const CommentItem = styled.li`
  font-size: 14px;
  list-style: none;
  padding: 5px;
  background: #f0f0f0;
  border-radius: 5px;
  margin-top: 5px;
`;
