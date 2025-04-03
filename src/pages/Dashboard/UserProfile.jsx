import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import useAuth from "../../contexts/useAuth";

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <PageWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ProfileContainer>
        <ProfileHeader>
          <AvatarPlaceholder>
            {user?.name?.charAt(0).toUpperCase()}
          </AvatarPlaceholder>
          <UserName>{user?.name}</UserName>
          <UserEmail>{user?.email}</UserEmail>
        </ProfileHeader>

        <ProfileSection>
          <SectionTitle>Personal Information</SectionTitle>
          <InfoGrid>
            <InfoCard>
              <InfoLabel>Full Name</InfoLabel>
              <InfoValue>{user?.name}</InfoValue>
            </InfoCard>
            <InfoCard>
              <InfoLabel>Email Address</InfoLabel>
              <InfoValue>{user?.email}</InfoValue>
            </InfoCard>
            {/* Add more info cards as needed */}
            <InfoCard>
              <InfoLabel>Account Created</InfoLabel>
              <InfoValue>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Not available"}
              </InfoValue>
            </InfoCard>
          </InfoGrid>
        </ProfileSection>

        <ActionSection>
          <ActionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Edit Profile
          </ActionButton>
          <ActionButton
            variant="secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Change Password
          </ActionButton>
        </ActionSection>
      </ProfileContainer>
    </PageWrapper>
  );
};

// Styled Components
const PageWrapper = styled(motion.div)`
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};

  @media (max-width: 768px) {
    height: auto;
    padding: 1rem 0;
    align-items: flex-start;
  }
`;

const ProfileContainer = styled.div`
  width: 95%;
  background-color: ${({ theme }) => theme.cardBackground};
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    border-radius: 0;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.primary},
    ${({ theme }) => theme.secondary}
  );
  color: white;

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;

const AvatarPlaceholder = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--color-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    font-size: 2.5rem;
  }
`;

const UserName = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const UserEmail = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  text-align: center;
  word-break: break-word;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ProfileSection = styled.div`
  padding: 1.5rem;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.primary};
  padding-bottom: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const InfoCard = styled.div`
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;
const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textLight};
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.background};

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const ActionButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  background-color: ${({ theme, variant }) =>
    variant === "secondary" ? theme.background : theme.primary};

  color: ${({ theme, variant }) =>
    variant === "secondary" ? theme.text : "white"};

  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`;

export default UserProfile;
