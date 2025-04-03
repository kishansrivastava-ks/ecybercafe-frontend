import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import useAuth from "../contexts/useAuth";
import { motion } from "framer-motion";
import {
  User,
  Grid,
  Settings,
  HelpCircle,
  LogOut,
  Home,
  Menu,
  X,
} from "lucide-react";
import ThemeToggle from "../utils/ThemeToggle";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const DashboardLayout = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      } else if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && sidebarOpen && e.target.id === "overlay") {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile, sidebarOpen]);

  return (
    <Container>
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && <Overlay id="overlay" />}

      <Sidebar
        initial={{ x: isMobile ? -300 : 0 }}
        animate={{ x: sidebarOpen ? 0 : isMobile ? -400 : 0 }}
        transition={{ type: "tween", duration: 0.3 }}
        $isMobile={isMobile}
      >
        <SidebarHeader>
          <LogoContainer>
            <HomeLink to={"/"}>
              <Home size={28} />
            </HomeLink>
            <Logo>Dashboard</Logo>
          </LogoContainer>

          {isMobile && (
            <CloseButton onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </CloseButton>
          )}
        </SidebarHeader>

        <UserProfile>
          <UserAvatar>{user?.name?.charAt(0).toUpperCase()}</UserAvatar>
          <UserInfo>
            <UserName>{user?.name.toUpperCase()}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </UserInfo>
        </UserProfile>

        <NavLinks>
          <StyledLink
            to="/dashboard/profile"
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <User size={20} />
            Profile
          </StyledLink>
          <StyledLink
            to="/dashboard/services"
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <Grid size={20} />
            My Services
          </StyledLink>
          <ServiceDropdown>
            <div onClick={() => setIsServicesOpen(!isServicesOpen)}>
              <Grid size={20} />
              Apply for a Service
              <ChevronDown
                size={16}
                style={{
                  marginLeft: "auto",
                  transform: isServicesOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            </div>
            {isServicesOpen && (
              <DropdownContent>
                <StyledLink
                  to="/dashboard/services/pan-card"
                  onClick={() => {
                    setIsServicesOpen(false);
                    isMobile && setSidebarOpen(false);
                  }}
                >
                  PAN Card
                </StyledLink>
                <StyledLink
                  to="/dashboard/services/rtps"
                  onClick={() => {
                    setIsServicesOpen(false);
                    isMobile && setSidebarOpen(false);
                  }}
                >
                  RTPS
                </StyledLink>
                <StyledLink
                  to="/dashboard/services/job-card"
                  onClick={() => {
                    setIsServicesOpen(false);
                    isMobile && setSidebarOpen(false);
                  }}
                >
                  Job Card
                </StyledLink>
              </DropdownContent>
            )}
          </ServiceDropdown>
        </NavLinks>

        <LogoutSection>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </LogoutButton>
        </LogoutSection>
      </Sidebar>

      <MainContent>
        <Header>
          {isMobile && (
            <HamburgerButton onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </HamburgerButton>
          )}
          <HeaderContent $isMobile={isMobile}>
            <div>
              <HeaderTitle $isMobile={isMobile}>
                Welcome, {user?.name}
              </HeaderTitle>
              <HeaderSubtitle>
                Here's an overview of your dashboard
              </HeaderSubtitle>
            </div>
            <HeaderActions>
              <ThemeToggle />
              <UserCircle>{user?.name[0].toUpperCase()}</UserCircle>
            </HeaderActions>
          </HeaderContent>
        </Header>

        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </MainContent>
    </Container>
  );
};

export default DashboardLayout;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
`;

const HamburgerButton = styled.button`
  background: transparent;
  border: none;
  color: #2563eb;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;

  &:hover {
    background: rgba(37, 99, 235, 0.1);
    border-radius: 50%;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  /* flex-direction: ${(props) => (props.$isMobile ? "column" : "row")}; */
  /* align-items: ${(props) => (props.$isMobile ? "flex-start" : "center")}; */
  justify-content: space-between;
  gap: ${(props) => (props.$isMobile ? "1rem" : "0")};
  width: 100%;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ServiceDropdown = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  color: white;
  cursor: pointer;
  /* border: 2px solid white; */
  max-width: 100%;

  > div {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    transition: background 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    svg {
      color: rgba(255, 255, 255, 0.7);
    }
    @media (max-width: 768px) {
      padding: 0rem;
      padding: 0.75rem 1rem;
    }
  }
`;

const DropdownContent = styled.div`
  padding-left: 2.5rem;
  display: flex;
  flex-direction: column;
`;

const UserCircle = styled.div`
  width: 50px;
  height: 50px;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ffffff;
  background-color: var(--color-primary);
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 1.5rem;
  }
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f4f6f9;
  overflow: hidden;
  position: relative;
`;

const Sidebar = styled(motion.aside)`
  /* width: 280px; */
  width: max-content;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  box-shadow: 10px 0 15px -3px rgba(0, 0, 0, 0.1);
  z-index: ${(props) => (props.$isMobile ? "20" : "1")};
  position: ${(props) => (props.$isMobile ? "fixed" : "relative")};
  height: 100%;
  overflow-y: auto;
`;

const LogoContainer = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HomeLink = styled(NavLink)`
  color: #fff;
  border: 2px solid white;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 10px;
`;

const UserAvatar = styled.div`
  min-width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  margin-right: 1rem;
`;

const UserInfo = styled.div`
  flex-grow: 1;
  overflow: hidden;
`;

const UserName = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.25rem;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NavLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-grow: 1;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: background 0.3s ease;
  min-width: 100%;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  svg {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const LogoutSection = styled.div`
  margin-top: 2rem;
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background: #f4f6f9;
  overflow-y: auto;
  width: 100%;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 1rem;
    /* border: 2px solid red; */
    height: max-content;
  }
  & > div {
  }
`;

const HeaderTitle = styled.h1`
  font-size: ${(props) => (props.$isMobile ? "1rem" : "1.75rem")};
  color: #2563eb;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    /* font-size: 1.5rem; */
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  background: #f4f6f9;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;
